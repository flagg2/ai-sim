import { getFFNNConfig } from "./config";
import { getNNInitialStep } from "../neural-networks/initial-step";
import { ffnnParamConfigurators } from "./param-configurators";
import { renderNN } from "../neural-networks/render";
import { getNNSteps } from "../neural-networks/steps";
import type { FFNNDefinition } from "./types";
import { ffnnMeta } from "./meta";

const ffnn: FFNNDefinition = {
  meta: ffnnMeta,
  getSceneSetup: () => ({ dimension: "2D", renderAxes: false }),
  getInitialStep: getNNInitialStep,
  render: renderNN,
  getConfig: getFFNNConfig,
  getSteps: (config, initialStep) => getNNSteps(config, initialStep, "ffnn"),
  paramConfigurators: ffnnParamConfigurators,
};

export default ffnn;
