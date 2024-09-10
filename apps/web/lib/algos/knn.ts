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

// type Step = {

// }

type Simulation<T extends object> = {
  next: (state: T) => T;
  nextMinor: (state: T) => T;
  previous: (state: T) => T;
};

export type KNNState = {
  points: Point[];
  groups: Group[];
  k: number;
  queryPoint: Point;
  distances: { point: Point; distance: number }[];
  currentIndex: number;
  nearestNeighbors: Point[];
  isMajorStep: boolean;
};

export const KNN: Simulation<KNNState> = {
  next: (state) => {
    let currentState = state;
    while (!currentState.isMajorStep) {
      currentState = KNN.nextMinor(currentState);
    }
    return currentState;
  },
  nextMinor: (state) => {
    if (state.isMajorStep) {
      // Evaluating phase: find k nearest neighbors
      const kNearest = state.distances
        .sort((a, b) => a.distance - b.distance)
        .slice(0, state.k)
        .map((d) => d.point);

      return {
        ...state,
        nearestNeighbors: kNearest,
        finished: true,
      };
    }

    if (state.currentIndex >= state.points.length) {
      return { ...state, isMajorStep: true };
    }

    const currentPoint = state.points[state.currentIndex]!;
    const distance = calculateDistance(
      state.queryPoint.coords,
      currentPoint.coords,
    );

    return {
      ...state,
      distances: [...state.distances, { point: currentPoint, distance }],
      currentIndex: state.currentIndex + 1,
    };
  },
  previous: (state) => {
    if (state.isMajorStep) {
      return {
        ...state,
        isMajorStep: false,
        finished: false,
        nearestNeighbors: [],
      };
    }
    if (state.currentIndex <= 0) {
      return state; // Can't go back further
    }
    return {
      ...state,
      distances: state.distances.slice(0, -1),
      currentIndex: state.currentIndex - 1,
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
