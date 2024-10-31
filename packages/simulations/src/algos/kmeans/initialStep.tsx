import type { KMeansDefinition } from "./types";

export const getKMeansInitialStep: KMeansDefinition["getInitialStep"] = (
  config,
) => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <div>
        We will cluster {config.points.length} points into {config.k} groups
        using the K-means algorithm.
      </div>
    ),
    index: 1,
    state: {
      points: config.points,
      centroids: [],
      iteration: 0,
    },
    nextStep: "initializeCentroids",
  };
};
