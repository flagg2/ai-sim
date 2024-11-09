import { getFFNNConfig } from "./config";
import { getFFNNInitialStep } from "./initialStep";
import { renderFFNN } from "./render";
import { getFFNNSteps } from "./steps";
import type { FFNNDefinition } from "./types";

export const ffnn: FFNNDefinition = {
  title: "Feedforward Neural Network",
  getSceneSetup: () => ({ dimension: "2D", renderAxes: false }),
  getInitialStep: getFFNNInitialStep,
  render: renderFFNN,
  description: "a neural network",
  getConfig: getFFNNConfig,
  getSteps: getFFNNSteps,
  paramConfigurators: {},
};
