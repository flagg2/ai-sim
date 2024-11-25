import Description from "../../lib/descriptions/description";
import type { LinearRegressionDefinition } from "./types";

export const getLinearRegressionInitialStep: LinearRegressionDefinition["getInitialStep"] =
  () => {
    return {
      type: "initial",
      title: "Initial State",
      description: (
        <Description>
          We want to fit a linear regression line, which is going to capture the
          nature of our data and help us predict future values. We demonstrate
          the Ordinary Least Squares method (OLS), which works well for
          manageable datasets.
        </Description>
      ),
      state: {
        means: undefined,
        coefficients: undefined,
        predictionLine: undefined,
      },
    };
  };
