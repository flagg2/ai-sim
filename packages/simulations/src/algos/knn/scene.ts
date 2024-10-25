import type { KNNDefinition } from "./types";

export const getKnnSceneSetup: KNNDefinition["getSceneSetup"] = (config) => {
  return {
    dimension: "3D",
  };
};
