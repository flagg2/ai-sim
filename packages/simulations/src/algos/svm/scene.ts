import type { SVMDefinition } from "./types";

export const getSVMSceneSetup: SVMDefinition["getSceneSetup"] = (
  currentStep,
) => {
  return {
    dimension: currentStep?.type === "initial" ? "2D" : "3D",
  };
};
