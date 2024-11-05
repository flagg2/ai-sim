import type { KNNDefinition } from "./types";

export const getKnnSceneSetup: KNNDefinition["getSceneSetup"] = () => {
  return {
    dimension: "3D",
  };
};
