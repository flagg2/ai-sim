import type { LinearRegressionDefinition } from "./types";

export const getLinearRegressionInitialStep: LinearRegressionDefinition["getInitialStep"] =
  (config) => {
    return {
      type: "initial",
      title: "Initial State",
      description: (
        <div>We want to fit a linear regression model to the data.</div>
      ),
      state: {
        means: undefined,
        coefficients: undefined,
        predictionLine: undefined,
      },
    };
  };
