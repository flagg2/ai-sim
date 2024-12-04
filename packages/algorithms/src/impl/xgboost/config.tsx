import { BOUNDARY_SCALE } from "./const";
import type { XGBoostDefinition, DataPoint } from "./types";

export const getXGBoostConfig: XGBoostDefinition["getConfig"] = (params) => {
  const points: DataPoint[] = [];
  let id = 0;

  const clusters = [
    { x: BOUNDARY_SCALE * 0.7, y: BOUNDARY_SCALE * 0.7, label: 1, spread: 15 },
    { x: BOUNDARY_SCALE * 0.3, y: BOUNDARY_SCALE * 0.8, label: 1, spread: 20 },
    { x: BOUNDARY_SCALE * 0.8, y: BOUNDARY_SCALE * 0.3, label: 1, spread: 25 },
    { x: BOUNDARY_SCALE * 0.2, y: BOUNDARY_SCALE * 0.2, label: -1, spread: 30 },
    { x: BOUNDARY_SCALE * 0.6, y: BOUNDARY_SCALE * 0.4, label: -1, spread: 18 },
    { x: BOUNDARY_SCALE * 0.9, y: BOUNDARY_SCALE * 0.9, label: -1, spread: 20 },
  ] as const;

  const pointsPerCluster = Math.ceil(params.points / clusters.length);

  clusters.forEach((cluster) => {
    for (let i = 0; i < pointsPerCluster; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.sqrt(Math.random()) * cluster.spread;
      points.push({
        id: (id++).toString(),
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
