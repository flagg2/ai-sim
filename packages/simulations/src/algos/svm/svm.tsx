import { getSVMConfig } from "./config";
import { getSVMInitialStep } from "./initial-step";
import { paramConfigurators } from "./param-configurators";
import type { SVMDefinition } from "./types";
import { renderSVM2 } from "./render";
import { getSVMSteps2 } from "./steps";

export const svm: SVMDefinition = {
  title: "Support Vector Machine",
  description:
    "Support Vector Machine (SVM) is a powerful classification algorithm that finds the optimal hyperplane to separate data points into different classes. When data isn't linearly separable, SVM uses the 'kernel trick' to transform the data into a higher dimension where it becomes separable.",
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
