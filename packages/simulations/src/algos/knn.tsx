import type { MeshStandardMaterial } from "three";
import { getMaterial } from "../utils/materials";
import type { Algorithm, Coords, Group, Simulation, Step } from "./common";

export type Point = {
  id: string;
  coords: Coords;
  group: Group;
};

type KNNStepState = {
  currentIndex: number;
  distances?: { point: Point; distance: number }[];
  nearestNeighbors?: Point[];
  queryPoint: Point;
};

type KNNStep = Step<
  KNNStepState,
  "calculateDistance" | "updateNearestNeighbors" | "updateQueryPoint"
>;

type KNNConfig = {
  points: Point[];
  k: number;
  groups: Group[];
  initialQueryPoint: Point;
};

export type KNNAlgorithm = Algorithm<KNNStep, KNNConfig>;

export function stepKNN(knn: KNNAlgorithm): KNNStep {
  const lastStep = knn.steps[knn.steps.length - 1];

  // if we are at the end, update the query point
  if (lastStep?.state.distances?.length === knn.config.points.length) {
    return updateQueryPointStep(knn);
  }

  if (lastStep?.type === "calculateDistance") {
    return updateNearestNeighborsStep(knn);
  }

  return calculateDistanceStep(knn);
}

function updateQueryPointStep(knn: KNNAlgorithm): KNNStep {
  const lastStep = knn.steps[knn.steps.length - 1]!;

  // find most common group among nearest neighbors
  const nearestNeighbors = lastStep.state.nearestNeighbors || [];
  const groupCounts = new Map<Group["label"], number>();

  nearestNeighbors.forEach((neighbor) => {
    const groupLabel = neighbor.group.label;
    groupCounts.set(groupLabel, (groupCounts.get(groupLabel) || 0) + 1);
  });

  // find the group with the most count
  let mostCommonGroup: Group | undefined;
  let maxCount = 0;

  groupCounts.forEach((count, groupLabel) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonGroup = knn.config.groups.find((g) => g.label === groupLabel);
    }
  });

  if (!mostCommonGroup) {
    throw new Error("No most common group found");
  }

  const updatedQueryPoint = {
    ...lastStep.state.queryPoint,
    group: mostCommonGroup,
  };

  return {
    type: "updateQueryPoint",
    state: {
      ...lastStep.state,
      queryPoint: updatedQueryPoint,
    },
    description: (
      <div>
        <p>Updating query point to {mostCommonGroup?.label}</p>
      </div>
    ),
  };
}

function calculateDistanceStep(knn: KNNAlgorithm): KNNStep {
  const lastStep = knn.steps[knn.steps.length - 1];
  const currentIndex = lastStep ? lastStep.state.currentIndex + 1 : 0;

  if (currentIndex >= knn.config.points.length) {
    return lastStep;
  }

  const currentPoint =
    lastStep.state.queryPoint ?? knn.config.initialQueryPoint;
  const distance = calculateDistance(
    lastStep?.state.queryPoint.coords,
    currentPoint.coords,
  );

  return {
    type: "calculateDistance",
    state: {
      currentIndex,
      distances: [
        ...(lastStep?.state.distances || []),
        { point: currentPoint, distance },
      ],
      queryPoint: currentPoint,
    },
    description: (
      <div>
        <p>Calculating distance between point {currentIndex} and query point</p>
        <p>Distance: {distance.toFixed(2)}</p>
      </div>
    ),
  };
}

function updateNearestNeighborsStep(knn: KNNAlgorithm): KNNStep {
  const lastStep = knn.steps[knn.steps.length - 1]!;
  const kNearest = lastStep.state
    .distances!.sort((a, b) => a.distance - b.distance)
    .slice(0, knn.config.k)
    .map((d) => d.point);

  return {
    type: "updateNearestNeighbors",
    state: {
      ...lastStep.state,
      nearestNeighbors: kNearest,
    },
    description: (
      <div>
        <p>
          Updating nearest neighbors for point {lastStep.state.currentIndex}
        </p>
        <p>Nearest neighbors: {kNearest.map((p) => p.id).join(", ")}</p>
      </div>
    ),
  };
}

// Helper function to calculate Euclidean distance
function calculateDistance(a: Point["coords"], b: Point["coords"]): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
  );
}

export function generateKGroups(k: number): Group[] {
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

export function generateRandomPoint({
  k,
  groups,
  points,
}: {
  k: number;
  groups: Group[];
  points: Point[];
}): Point {
  const group = groups[Math.floor(Math.random() * k)]!;
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
      point: Point | null;
      distance: number;
    },
  );

  const distance = closestPoint.point
    ? calculateDistance(coords, closestPoint.point.coords)
    : Infinity;

  // TODO: doesn't work
  if (distance < 10) {
    return generateRandomPoint({ k, groups, points });
  }
  return {
    id: crypto.randomUUID(),
    coords: {
      x: randomValue(defaultGroupSimilarityTendency, group),
      y: randomValue(defaultGroupSimilarityTendency, group),
      z: randomValue(defaultGroupSimilarityTendency, group),
    },
    group: group,
  };
}

export function generateRandomPoints(
  state: {
    k: number;
    groups: Group[];
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
