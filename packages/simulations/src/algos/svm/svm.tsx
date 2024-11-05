import { getSVMConfig } from "./config";
import { getSVMInitialStep } from "./initialStep";
import { paramConfigurators } from "./paramConfigurators";
import { renderSVM } from "./render";
import type { SVMDefinition } from "./types";
import { getSVMSteps } from "./steps";
import { getSVMSceneSetup } from "./scene";

export const svm: SVMDefinition = {
  title: "Support Vector Machine",
  description:
    "Support Vector Machine (SVM) is a powerful classification algorithm that finds the optimal hyperplane to separate data points into different classes. When data isn't linearly separable, SVM uses the 'kernel trick' to transform the data into a higher dimension where it becomes separable.",
  paramConfigurators: paramConfigurators,
  getSceneSetup: getSVMSceneSetup,
  getConfig: getSVMConfig,
  getInitialStep: getSVMInitialStep,
  getSteps: getSVMSteps,
  render: renderSVM,
};
