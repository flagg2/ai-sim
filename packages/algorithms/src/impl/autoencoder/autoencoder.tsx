import { getAutoEncoderConfig } from "./config";
import { autoEncoderParamConfigurators } from "./param-configurators";
import { renderNN } from "../neural-networks/render";
import { getNNSteps } from "../neural-networks/steps";
import type { AutoEncoderDefinition } from "./types";
import { getNNInitialStep } from "../neural-networks/initial-step";
import { autoencoderMeta } from "./meta";

const autoencoder: AutoEncoderDefinition = {
  meta: autoencoderMeta,
  getSceneSetup: () => ({ dimension: "2D", renderAxes: false }),
  getInitialStep: getNNInitialStep,
  render: renderNN,
  getConfig: getAutoEncoderConfig,
  getSteps: (config, initialStep) =>
    getNNSteps(config, initialStep, "autoencoder"),
  paramConfigurators: autoEncoderParamConfigurators,
};

export default autoencoder;
