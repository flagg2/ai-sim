import type { XGBoostDefinition, DataPoint } from "./types";

export const getXGBoostConfig: XGBoostDefinition["getConfig"] = (params) => {
  const points = generatePoints(params.points);
  return {
    points,
    maxDepth: params.maxDepth,
    numTrees: params.numTrees,
    learningRate: params.learningRate,
  };
};

let id = 0;

function getNextId() {
  return (id++).toString();
}

function generatePoints(numberOfPoints: number): DataPoint[] {
  const points: DataPoint[] = [];

  // Generate points following a simple pattern for regression
  // y = sin(x) + noise
  for (let i = 0; i < numberOfPoints; i++) {
    const x = (i / numberOfPoints) * 200 - 100; // Range: -100 to 100
    const y = Math.sin(x / 30) * 50; // Base pattern
    const noise = (Math.random() - 0.5) * 20; // Random noise

    points.push({
      id: getNextId(),
      coords: {
        x,
        y: y + noise,
      },
      label: y, // True value without noise
    });
  }

  return points;
}
