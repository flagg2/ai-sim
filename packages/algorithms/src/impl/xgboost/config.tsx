import type { XGBoostDefinition, DataPoint } from "./types";

const BOUNDARY_SCALE = 150; // Scale of the visualization space
const CLASS_SEPARATION = 40; // Distance between class centers

export const getXGBoostConfig: XGBoostDefinition["getConfig"] = (params) => {
  const points: DataPoint[] = [];
  let id = 0;

  // Generate points for class 1 (centered in upper right)
  const center1X = BOUNDARY_SCALE * 0.6;
  const center1Y = BOUNDARY_SCALE * 0.6;

  // Generate points for class -1 (centered in lower left)
  const center2X = BOUNDARY_SCALE * 0.4;
  const center2Y = BOUNDARY_SCALE * 0.4;

  // Generate points for each class
  for (let i = 0; i < params.points; i++) {
    // Add point for class 1
    const angle1 = Math.random() * 2 * Math.PI;
    const radius1 = Math.random() * 20; // Spread of the cluster
    points.push({
      id: id++,
      coords: {
        x: center1X + radius1 * Math.cos(angle1),
        y: center1Y + radius1 * Math.sin(angle1),
      },
      label: 1,
    });

    // Add point for class -1
    const angle2 = Math.random() * 2 * Math.PI;
    const radius2 = Math.random() * 20; // Spread of the cluster
    points.push({
      id: id++,
      coords: {
        x: center2X + radius2 * Math.cos(angle2),
        y: center2Y + radius2 * Math.sin(angle2),
      },
      label: -1,
    });
  }

  return {
    trainingPoints: points,
    learningRate: params.learningRate,
    maxDepth: params.maxDepth,
    numTrees: params.numTrees,
  };
};
