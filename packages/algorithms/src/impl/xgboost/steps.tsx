import type { XGBoostDefinition } from "./types";
import Description from "../../lib/descriptions/description";
import Paragraph from "../../lib/descriptions/paragraph";
import Note from "../../lib/descriptions/note";
import Expression from "../../lib/descriptions/math";

// Add these constants at the top
const BOUNDARY_SCALE = 150;
const GRID_SIZE = 50;

export const getXGBoostSteps: XGBoostDefinition["getSteps"] = async (
  config,
  initialStep,
) => {
  const steps = [initialStep];

  // Generate grid points for the decision boundary
  const boundaryPoints = [];
  const step = BOUNDARY_SCALE / GRID_SIZE;
  for (let x = 0; x <= BOUNDARY_SCALE; x += step) {
    for (let y = 0; y <= BOUNDARY_SCALE; y += step) {
      boundaryPoints.push({ coords: [x, y] });
    }
  }

  // Update API call to include grid points
  const response = await fetch("http://localhost:8000/api/xgboost", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...config,
      boundaryPoints,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to process XGBoost model");
  }

  const { decisionBoundary } = await response.json();

  // Calculate Residuals Step
  steps.push({
    type: "calculateResiduals",
    title: "Calculate Residuals",
    description: (
      <Description>
        <Paragraph>
          For each point, we calculate the residual (error) between its true
          label and current prediction:
        </Paragraph>
        <Expression>residual = actual_value - predicted_value</Expression>
        <Note>
          These residuals tell us how much we need to correct our predictions.
          Positive residuals mean we predicted too low, negative means we
          predicted too high.
        </Note>
      </Description>
    ),
    state: {},
  });

  // Build Tree Step
  steps.push({
    type: "buildTree",
    title: "Build Decision Tree",
    description: (
      <Description>
        <Paragraph>
          A new decision tree is built to predict the residuals. The tree:
        </Paragraph>
        <ul>
          <li>
            Finds the best splits based on our features (x and y coordinates)
          </li>
          <li>Creates branches up to maximum depth of {config.maxDepth}</li>
          <li>Assigns prediction values to leaf nodes</li>
        </ul>
        <Note>
          Each split aims to group similar residuals together, helping us
          identify regions where our predictions need similar corrections.
        </Note>
      </Description>
    ),
    state: {},
  });

  // Update afterOneIteration step
  steps.push({
    type: "afterOneIteration",
    title: "Update Predictions",
    description: (
      <Description>
        <Paragraph>
          We update our predictions using the new tree's output scaled by the
          learning rate ({config.learningRate}):
        </Paragraph>
        <Expression>
          new_prediction = current_prediction + learning_rate × tree_prediction
        </Expression>
        <Note>
          The learning rate helps us make conservative updates, preventing us
          from overcorrecting.
        </Note>
      </Description>
    ),
    state: { boundaryPredictions: decisionBoundary },
  });

  // Update final result step
  steps.push({
    type: "showFinalResult",
    title: "Final Result",
    description: (
      <Description>
        <Paragraph>
          After {config.numTrees} iterations, each adding a new tree to our
          ensemble, we have our final model. Each prediction is the sum of:
        </Paragraph>
        <ul>
          <li>The initial prediction (mean)</li>
          <li>Weighted contributions from each tree</li>
        </ul>
        <Note>
          The final decision boundary shows how the model has learned to
          separate the two classes.
        </Note>
      </Description>
    ),
    state: { boundaryPredictions: decisionBoundary },
  });

  return steps;
};
