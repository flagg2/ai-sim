import type { XGBoostDefinition } from "./types";
import Description from "../../lib/descriptions/description";
import Paragraph from "../../lib/descriptions/paragraph";
import Note from "../../lib/descriptions/note";
import Expression from "../../lib/descriptions/math";

// Add these constants at the top
const BOUNDARY_SCALE = 150;
const GRID_SIZE = 50;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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

  // Perform both fetches concurrently at the start
  const [mainResponse, iterationResponse] = await Promise.all([
    fetch(`${API_URL}/api/xgboost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...config,
        boundaryPoints,
      }),
    }),
    fetch(`${API_URL}/api/xgboost/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...config,
        maxDepth: 1,
        boundaryPoints,
      }),
    }),
  ]);

  if (!mainResponse.ok || !iterationResponse.ok) {
    throw new Error("Failed to process XGBoost model");
  }

  const [{ decisionBoundary }, { decisionBoundary: iterationResult }] =
    await Promise.all([mainResponse.json(), iterationResponse.json()]);

  // Calculate Residuals Step
  steps.push({
    type: "calculateResiduals",
    title: "Calculate Gradients",
    description: (
      <Description>
        <Paragraph>
          For each point, we calculate the gradient of the loss function
          (pseudo-residuals). For binary classification with logistic loss:
        </Paragraph>
        <Expression>
          {"gradient = y - \\frac{1}{1 + e^{-\\text{prediction}}}"}
        </Expression>
        <Note>
          These gradients tell us how to adjust our predictions to minimize the
          loss function. We also calculate second-order derivatives (Hessians)
          to optimize the learning process.
        </Note>
      </Description>
    ),
    state: {},
  });

  console.log({ iterationResult });

  // Build Tree Step
  steps.push({
    type: "buildTree",
    title: "Build Decision Tree",
    description: (
      <Description>
        <Paragraph>
          A new decision tree is built to optimize the loss function using the
          gradients and Hessians. Let's look at an example decision tree.
        </Paragraph>
        <ul>
          <li>At each node, XGBoost finds the split that maximizes the gain</li>
          <li>
            The gain includes both the improvement in the loss function and a
            regularization term
          </li>
          <li>
            Leaf values are calculated using both first and second-order
            gradients
          </li>
        </ul>
        <Note>
          In the actual model, each tree grows to a maximum depth of{" "}
          {config.maxDepth} and uses regularization to prevent overfitting.
        </Note>
      </Description>
    ),
    state: {},
  });

  // Update afterOneIteration step with both results
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
          new\_prediction = current\_prediction + learning\_rate ×
          tree\_prediction
        </Expression>
        <Note>
          The decision boundary shows regions where predictions are positive
          (one class) vs negative (other class). The learning rate of{" "}
          {config.learningRate} helps prevent overfitting by making small,
          careful updates.
        </Note>
      </Description>
    ),
    state: {
      boundaryPredictions: iterationResult,
    },
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
