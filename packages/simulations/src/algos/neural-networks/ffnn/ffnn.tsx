import { getFFNNConfig } from "./config";
import { getNNInitialStep } from "../initialStep";
import { ffnnParamConfigurators } from "./paramConfigurators";
import { renderNN } from "../render";
import { getNNSteps } from "../steps";
import type { NNDefinition } from "../types";
import type { FFNNDefinition } from "./types";

export const ffnn: FFNNDefinition = {
  title: "Feedforward Neural Network",
  getSceneSetup: () => ({ dimension: "2D", renderAxes: false }),
  getInitialStep: getNNInitialStep,
  render: renderNN,
  description: "a neural network",
  getConfig: getFFNNConfig,
  getSteps: (config, initialStep) => getNNSteps(config, initialStep, "ffnn"),
  paramConfigurators: ffnnParamConfigurators,
};
