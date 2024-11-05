import type { LinearRegressionDefinition } from "./types";

export const getLinearRegressionInitialStep: LinearRegressionDefinition["getInitialStep"] =
  (config) => {
    return {
      type: "initial",
      title: "Initial State",
      description: (
        <div>
          We want to fit a linear regression line, which is going to capture the
          nature of our data and help us predict future values. We demonstrate
          the Ordinary Least Squares method (OLS), which works well for
          manageable datasets.
        </div>
      ),
      state: {
        means: undefined,
        coefficients: undefined,
        predictionLine: undefined,
      },
    };
  };
