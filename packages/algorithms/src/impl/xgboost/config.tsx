import type { XGBoostDefinition, DataPoint } from "./types";

const BOUNDARY_SCALE = 150; // Scale of the visualization space
const CLASS_SEPARATION = 40; // Distance between class centers

export const getXGBoostConfig: XGBoostDefinition["getConfig"] = (params) => {
  const points: DataPoint[] = [];
  let id = 0;

  // Define multiple cluster centers for each class
  const clusters = [
    // Class 1 clusters (three clusters)
    { x: BOUNDARY_SCALE * 0.7, y: BOUNDARY_SCALE * 0.7, label: 1, spread: 15 },
    { x: BOUNDARY_SCALE * 0.3, y: BOUNDARY_SCALE * 0.8, label: 1, spread: 20 },
    { x: BOUNDARY_SCALE * 0.8, y: BOUNDARY_SCALE * 0.3, label: 1, spread: 25 },
    // Class -1 clusters (two clusters with different spreads)
    { x: BOUNDARY_SCALE * 0.2, y: BOUNDARY_SCALE * 0.2, label: -1, spread: 30 },
    { x: BOUNDARY_SCALE * 0.6, y: BOUNDARY_SCALE * 0.4, label: -1, spread: 18 },
    // class -1 cluster at top right
    { x: BOUNDARY_SCALE * 0.9, y: BOUNDARY_SCALE * 0.9, label: -1, spread: 20 },
  ] as const;

  // Generate points for each cluster
  const pointsPerCluster = Math.ceil(params.points / clusters.length);

  clusters.forEach((cluster) => {
    for (let i = 0; i < pointsPerCluster; i++) {
      const angle = Math.random() * 2 * Math.PI;
      // Use square root for more uniform distribution
      const radius = Math.sqrt(Math.random()) * cluster.spread;
      points.push({
        id: id++,
        coords: {
          x: cluster.x + radius * Math.cos(angle),
          y: cluster.y + radius * Math.sin(angle),
        },
        label: cluster.label,
      });
    }
  });

  return {
    trainingPoints: points,
    learningRate: params.learningRate,
    maxDepth: params.maxDepth,
    numTrees: params.numTrees,
  };
};
