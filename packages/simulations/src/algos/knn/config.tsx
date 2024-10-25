import { getMaterial } from "@repo/simulations/utils/materials";
import type { Group } from "../types";
import { calculateDistance } from "../utils";
import type { DataPoint, KNNDefinition } from "./types";

export const getKNNConfig: KNNDefinition["getConfig"] = (params) => {
  const groups = generateKGroups(params.groups);
  const points = generateRandomPoints({ groups, points: [] }, params.points);
  return { points, k: params.k, groups };
};

function generateKGroups(k: number): Group[] {
  return Array.from({ length: k }, (_, i) => ({
    label: `Group ${i + 1}`,
    material: getMaterial(i),
  }));
}

function randomValue(similarityTendency: number, group: Group): number {
  return (
    Math.floor(Math.random() * 100) +
    1 +
    (Math.random() < similarityTendency ? group.label.charCodeAt(6) : 0)
  );
}

const defaultGroupSimilarityTendency = 0;
let id = 0;

function getNextId() {
  return id++;
}

function generateRandomPoint({
  groups,
  points,
}: {
  groups: Group[];
  points: DataPoint[];
}): DataPoint {
  const group = groups[Math.floor(Math.random() * groups.length)]!;
  const coords = {
    x: randomValue(defaultGroupSimilarityTendency, group),
    y: randomValue(defaultGroupSimilarityTendency, group),
    z: randomValue(defaultGroupSimilarityTendency, group),
  };

  // TODO: this check can be improved but we can tolerate it since max number of points is low
  const closestPoint = points.reduce(
    (closest, point) => {
      const distance = calculateDistance(coords, point.coords);
      return distance < closest.distance ? { point, distance } : closest;
    },
    { point: null, distance: Infinity } as {
      point: DataPoint | null;
      distance: number;
    },
  );

  const distance = closestPoint.point
    ? calculateDistance(coords, closestPoint.point.coords)
    : Infinity;

  if (distance < 10) {
    return generateRandomPoint({ groups, points });
  }
  return {
    id: getNextId().toString(),
    coords: {
      x: randomValue(defaultGroupSimilarityTendency, group),
      y: randomValue(defaultGroupSimilarityTendency, group),
      z: randomValue(defaultGroupSimilarityTendency, group),
    },
    group: group,
  };
}

function generateRandomPoints(
  state: {
    groups: Group[];
    points: DataPoint[];
  },
  numberOfPoints: number,
): DataPoint[] {
  const points: DataPoint[] = state.points.slice(0, numberOfPoints);
  while (points.length < numberOfPoints) {
    points.push(generateRandomPoint(state));
  }
  return points;
}
