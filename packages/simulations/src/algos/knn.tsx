import { getMaterial } from "../utils/materials";
import React from "react";
import type { Coords, Group, Simulation } from "./common";

export type Point = {
  id: string;
  coords: Coords;
  group: Group;
};

type Step = {
  type: "calculateDistance" | "updateNearestNeighbors";
  currentIndex: number;
  distances?: { point: Point; distance: number }[];
  nearestNeighbors?: Point[];
  description: React.ReactNode;
};

type Config = {
  points: Point[];
  k: number;
  queryPoint: Point;
  groups: Group[];
};

export type KNNState = {
  config: Config;
  steps: Step[];
};

export const KNN: Simulation<KNNState> = {
  fastForward: (state) => {
    let currentState = state;
    const lastStep = currentState.steps[currentState.steps.length - 1];
    if (!lastStep || lastStep.type === "updateNearestNeighbors") {
      currentState = KNN.forward(currentState);
    }
    currentState = KNN.forward(currentState);
    return currentState;
  },
  forward: (state) => {
    const lastStep = state.steps[state.steps.length - 1];

    if (!lastStep || lastStep.type === "updateNearestNeighbors") {
      return calculateDistanceStep(state);
    } else {
      return updateNearestNeighborsStep(state);
    }
  },
  backward: (state) => {
    if (state.steps.length <= 1) {
      return { ...state, steps: [] }; // Reset to initial state
    }
    return {
      ...state,
      steps: state.steps.slice(0, -1),
    };
  },
  fastBackward: (state) => {
    return { ...state, steps: [] };
  },
};

function calculateDistanceStep(state: KNNState): KNNState {
  const lastStep = state.steps[state.steps.length - 1];
  const currentIndex = lastStep ? lastStep.currentIndex + 1 : 0;

  if (currentIndex >= state.config.points.length) {
    return state; // Algorithm finished
  }

  const currentPoint = state.config.points[currentIndex]!;
  const distance = calculateDistance(
    state.config.queryPoint.coords,
    currentPoint.coords,
  );

  return {
    ...state,
    steps: [
      ...state.steps,
      {
        type: "calculateDistance",
        currentIndex,
        distances: [
          ...(lastStep?.distances || []),
          { point: currentPoint, distance },
        ],
        description: (
          <div>
            <p>
              Calculating distance between point {currentIndex} and query point
            </p>
            <p>Distance: {distance.toFixed(2)}</p>
          </div>
        ),
      },
    ],
  };
}

function updateNearestNeighborsStep(state: KNNState): KNNState {
  const lastStep = state.steps[state.steps.length - 1]!;
  const kNearest = lastStep
    .distances!.sort((a, b) => a.distance - b.distance)
    .slice(0, state.config.k)
    .map((d) => d.point);

  return {
    ...state,
    steps: [
      ...state.steps,
      {
        type: "updateNearestNeighbors",
        currentIndex: lastStep.currentIndex,
        distances: lastStep.distances,
        nearestNeighbors: kNearest,
        description: (
          <div>
            <p>Updating nearest neighbors for point {lastStep.currentIndex}</p>
            <p>Nearest neighbors: {kNearest.map((p) => p.id).join(", ")}</p>
          </div>
        ),
      },
    ],
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
