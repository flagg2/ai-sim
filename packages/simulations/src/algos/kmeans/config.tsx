import { getMaterial } from "@repo/simulations/utils/materials";
import type { Group } from "../types";
import { calculateDistance } from "../utils";
import type { KMeansDefinition, Point } from "./types";

export const getKMeansConfig: KMeansDefinition["getConfig"] = (params) => {
  const points = generateRandomPoints({ points: [] }, params.points);
  return {
    points,
    k: params.k,
    maxIterations: params.maxIterations,
  };
};

let id = 0;

function getNextId() {
  return id++;
}

function generateRandomPoint({ points }: { points: Point[] }): Point {
  const coords = {
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
    z: Math.floor(Math.random() * 100),
  };

  const closestPoint = points.reduce(
    (closest, point) => {
      const distance = calculateDistance(coords, point.coords);
      return distance < closest.distance ? { point, distance } : closest;
    },
    { point: null, distance: Infinity } as {
      point: Point | null;
      distance: number;
    },
  );

  if (closestPoint.distance < 10) {
    return generateRandomPoint({ points });
  }

  return {
    id: getNextId().toString(),
    coords,
    group: {
      label: "Unassigned",
      material: getMaterial(0),
    },
  };
}

function generateRandomPoints(
  state: {
    points: Point[];
  },
  numberOfPoints: number,
): Point[] {
  const points: Point[] = state.points.slice(0, numberOfPoints);
  while (points.length < numberOfPoints) {
    points.push(generateRandomPoint(state));
  }
  return points;
}
