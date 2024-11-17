import { getAutoEncoderConfig } from "./config";
import { autoEncoderParamConfigurators } from "./param-configurators";
import { renderNN } from "../render";
import { getNNSteps } from "../steps";
import type { AutoEncoderDefinition } from "./types";
import { getNNInitialStep } from "../initial-step";

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
