import { getAutoEncoderConfig } from "./config";
import { autoEncoderParamConfigurators } from "./paramConfigurators";
import { renderNN } from "../render";
import { getNNSteps } from "../steps";
import type { AutoEncoderDefinition } from "./types";
import { getNNInitialStep } from "../initialStep";

export const autoencoder: AutoEncoderDefinition = {
  title: "Autoencoder",
  getSceneSetup: () => ({ dimension: "2D", renderAxes: false }),
  getInitialStep: getNNInitialStep,
  render: renderNN,
  description: "a neural network",
  getConfig: getAutoEncoderConfig,
  getSteps: (config, initialStep) =>
    getNNSteps(config, initialStep, "autoencoder"),
  paramConfigurators: autoEncoderParamConfigurators,
};
