import { getXGBoostConfig } from "./config";
import { getXGBoostInitialStep } from "./initial-step";
import { paramConfigurators } from "./param-configurators";
import { renderXGBoost } from "./render";
import { getXGBoostSteps } from "./steps";
import { xgboostMeta } from "./meta";
import type { XGBoostDefinition } from "./types";

const xgboost: XGBoostDefinition = {
  meta: xgboostMeta,
  paramConfigurators: paramConfigurators,
  getSceneSetup: () => ({
    dimension: "2D",
    renderAxes: true,
  }),
  getConfig: getXGBoostConfig,
  getInitialStep: getXGBoostInitialStep,
  getSteps: getXGBoostSteps,
  render: renderXGBoost,
};

export default xgboost;
