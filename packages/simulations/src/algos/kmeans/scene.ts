import type { KMeansDefinition } from "./types";

export const getKMeansSceneSetup: KMeansDefinition["getSceneSetup"] = (
  config,
) => {
  return {
    dimension: "3D",
  };
};
