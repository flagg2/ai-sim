import type { KMeansDefinition } from "./types";

export const getKMeansSceneSetup: KMeansDefinition["getSceneSetup"] = () => {
  return {
    dimension: "3D",
  };
};
