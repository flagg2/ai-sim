import type { LinearRegressionDefinition, DataPoint } from "./types";

export const getLinearRegressionConfig: LinearRegressionDefinition["getConfig"] =
  (params) => {
    const points = generateRandomPoints(
      params.points,
      params.noise,
      params.heightScale,
    );
    return {
      points,
      noise: params.noise,
    };
  };

let id = 0;

function getNextId() {
  return id++;
}

function generateRandomPoints(
  numberOfPoints: number,
  noise: number,
  heightScale: number,
): DataPoint[] {
  const points: DataPoint[] = [];

  // Generate points along a 3D line with controlled noise

  for (let i = 0; i < numberOfPoints; i++) {
    // Generate more controlled coordinates along a path
    const t = i / (numberOfPoints - 1); // Parameter between 0 and 1
    const coords = {
      x: Math.floor(t * 100 + Math.random() * 60 * noise),
      y: Math.floor(t * heightScale + Math.random() * 60 * noise),
      z: Math.floor(t * 60 + Math.random() * 60 * noise),
    };

    points.push({
      id: getNextId().toString(),
      coords,
    });
  }

  return points;
}
