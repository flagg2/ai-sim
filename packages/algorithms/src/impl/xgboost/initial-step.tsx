import type { XGBoostDefinition } from "./types";

export const getXGBoostInitialStep: XGBoostDefinition["getInitialStep"] = (
  config,
) => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <div>
        <p>
          We'll train an XGBoost model with {config.numTrees} trees to predict
          values based on the input data points.
        </p>
        <ul>
          <li>Number of training points: {config.points.length}</li>
          <li>Maximum tree depth: {config.maxDepth}</li>
          <li>Learning rate: {config.learningRate}</li>
        </ul>
        <p>
          Each tree will attempt to correct the prediction errors made by the
          previous trees.
        </p>
      </div>
    ),
    state: {
      points: config.points,
    },
  };
};
