import { getLinearRegressionConfig } from "./config";
import { getLinearRegressionInitialStep } from "./initial-step";
import { paramConfigurators } from "./param-configurators";
import { renderLinearRegression } from "./render";
import type { LinearRegressionDefinition } from "./types";
import { getLinearRegressionSteps } from "./steps";
import { linearRegressionMeta } from "./meta";

const linearRegression: LinearRegressionDefinition = {
  meta: linearRegressionMeta,
  paramConfigurators: paramConfigurators,
  getSceneSetup: () => ({
    dimension: "3D",
  }),
  getConfig: getLinearRegressionConfig,
  getInitialStep: getLinearRegressionInitialStep,
  getSteps: getLinearRegressionSteps,
  render: renderLinearRegression,
};

export default linearRegression;
