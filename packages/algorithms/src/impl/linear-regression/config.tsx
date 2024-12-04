import { getNextId } from "../../lib/utils";
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

function generateRandomPoints(
  numberOfPoints: number,
  noise: number,
  heightScale: number,
): DataPoint[] {
  const points: DataPoint[] = [];

  // generate points along a 3D line with controlled noise
  for (let i = 0; i < numberOfPoints; i++) {
    const t = i / (numberOfPoints - 1);
    const coords = {
      x:
        noise === 0
          ? t * 100
          : Math.floor(t * 100 + Math.random() * 60 * noise),
      y:
        noise === 0
          ? t * heightScale
          : Math.floor(t * heightScale + Math.random() * 60 * noise),
      z: noise === 0 ? t * 60 : Math.floor(t * 60 + Math.random() * 60 * noise),
    };

    points.push({
      id: getNextId(),
      coords,
    });
  }

  return points;
}
