import { getSVMConfig } from "./config";
import { getSVMInitialStep } from "./initial-step";
import { paramConfigurators } from "./param-configurators";
import type { SVMDefinition } from "./types";
import { renderSVM2 } from "./render";
import { getSVMSteps2 } from "./steps";
import { svmMeta } from "./meta";

const svm: SVMDefinition = {
  meta: svmMeta,
  paramConfigurators: paramConfigurators,
  getSceneSetup: () => {
    return {
      dimension: "2D",
    };
  },
  getConfig: getSVMConfig,
  getInitialStep: getSVMInitialStep,
  getSteps: getSVMSteps2,
  render: renderSVM2,
};

export default svm;
