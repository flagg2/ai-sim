import { getKNNConfig } from "./config";
import { getKNNInitialStep } from "./initialStep";
import { paramConfigurators } from "./paramConfigurators";
import { renderKNN } from "./render";
import type { KNNDefinition } from "./types";
import { getKNNSteps } from "./steps";

export const knn: KNNDefinition = {
  paramConfigurators: paramConfigurators,
  getConfig: getKNNConfig,
  getInitialStep: getKNNInitialStep,
  getSteps: getKNNSteps,
  render: renderKNN,
};
