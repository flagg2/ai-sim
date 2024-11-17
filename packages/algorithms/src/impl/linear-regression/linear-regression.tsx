import { getLinearRegressionConfig } from "./config";
import { getLinearRegressionInitialStep } from "./initial-step";
import { paramConfigurators } from "./param-configurators";
import { renderLinearRegression } from "./render";
import type { LinearRegressionDefinition } from "./types";
import { getLinearRegressionSteps } from "./steps";

export const linearRegression: LinearRegressionDefinition = {
  title: "Linear Regression",
  description:
    "Linear regression is a supervised learning algorithm that finds the best-fitting line through a set of points. It works by minimizing the sum of squared distances between the predicted line and the actual data points.",
  paramConfigurators: paramConfigurators,
  getSceneSetup: () => ({
    dimension: "3D",
  }),
  getConfig: getLinearRegressionConfig,
  getInitialStep: getLinearRegressionInitialStep,
  getSteps: getLinearRegressionSteps,
  render: renderLinearRegression,
};
