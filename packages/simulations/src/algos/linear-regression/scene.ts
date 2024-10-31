import type { LinearRegressionDefinition } from "./types";

export const getLinearRegressionSceneSetup: LinearRegressionDefinition["getSceneSetup"] =
  (config) => {
    return {
      dimension: "3D",
    };
  };
