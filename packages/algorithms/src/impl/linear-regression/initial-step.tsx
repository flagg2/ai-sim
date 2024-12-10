import type { LinearRegressionDefinition } from "./types";

export const getLinearRegressionInitialStep: LinearRegressionDefinition["getInitialStep"] =
  () => {
    return {
      type: "initial",
      title: "Initial State",
      description: (
        <div>
          We want to fit a <strong>linear regression line</strong>, which is
          going to capture the nature of our data and help us predict future
          values. We demonstrate the <strong>Ordinary Least Squares</strong>{" "}
          method (OLS), which works well for manageable datasets.
        </div>
      ),
      state: {
        means: undefined,
        coefficients: undefined,
        predictionLine: undefined,
      },
    };
  };
