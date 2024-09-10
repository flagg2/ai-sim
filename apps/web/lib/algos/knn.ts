import { MeshStandardMaterial } from "three";
import { getMaterial } from "../utils/materials";

type Coords = {
  x: number;
  y: number;
  z: number;
};

export type Point = {
  id: string;
  coords: Coords;
  group: Group;
};

type Group = {
  label: string;
  material: MeshStandardMaterial;
};
type Simulation<T extends object> = {
  next: (state: T) => T;
  nextMinor: (state: T) => T;
  previous: (state: T) => T;
};

type Step = {
  type: "calculateDistance" | "updateNearestNeighbors";
  currentIndex: number;
  distances?: { point: Point; distance: number }[];
  nearestNeighbors?: Point[];
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
  next: (state) => {
    let currentState = state;
    const lastStep = currentState.steps[currentState.steps.length - 1];
    if (!lastStep || lastStep.type === "updateNearestNeighbors") {
      currentState = KNN.nextMinor(currentState);
    }
    currentState = KNN.nextMinor(currentState);
    return currentState;
  },
  nextMinor: (state) => {
    const lastStep = state.steps[state.steps.length - 1];

    if (!lastStep || lastStep.type === "updateNearestNeighbors") {
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
            distance,
            distances: [
              ...(lastStep?.distances || []),
              { point: currentPoint, distance },
            ],
          },
        ],
      };
    } else {
      // Update nearest neighbors
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
          },
        ],
      };
    }
  },
  previous: (state) => {
    if (state.steps.length <= 1) {
      return { ...state, steps: [] }; // Reset to initial state
    }
    return {
      ...state,
      steps: state.steps.slice(0, -1),
    };
  },
};

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
