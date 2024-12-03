import type { XGBoostDefinition } from "./types";
import { getXGBoostConfig } from "./config";
import { getXGBoostInitialStep } from "./initial-step";
import { getXGBoostSteps } from "./steps";
import { renderXGBoost } from "./render";
import { xgboostMeta } from "./meta";
import { xgboostParamConfigurators } from "./param-configurators";

const xgboost: XGBoostDefinition = {
  meta: xgboostMeta,
  getSceneSetup: () => ({
    dimension: "2D",
  }),
  paramConfigurators: xgboostParamConfigurators,
  getConfig: getXGBoostConfig,
  getInitialStep: getXGBoostInitialStep,
  getSteps: getXGBoostSteps,
  render: renderXGBoost,
};

export default xgboost;
