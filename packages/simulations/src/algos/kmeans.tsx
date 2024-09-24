import type { Algorithm, Coords, Group, Step } from "./common";
import { MathJax } from "better-react-mathjax";
import { getMaterial } from "../utils/materials";

export type Point = {
  id: string;
  coords: Coords;
  group: Group;
};

type KMeansStepType =
  | "initializeCentroids"
  | "assignPointsToClusters"
  | "updateCentroids"
  | "checkConvergence";

type KMeansStepState = {
  points: Point[];
  centroids: Point[];
  iteration: number;
};

type KMeansStep = Step<KMeansStepState, KMeansStepType>;

type KMeansConfig = {
  k: number;
  maxIterations: number;
};

export type KMeansAlgorithm = Algorithm<KMeansStep, KMeansConfig>;

function getLastStep(kmeans: KMeansAlgorithm): KMeansStep {
  if (kmeans.steps.length === 0) {
    throw new Error("No steps found");
  }
  return kmeans.steps[kmeans.steps.length - 1]!;
}

function getPreviousStepOfType(
  kmeans: KMeansAlgorithm,
  type: KMeansStepType,
): KMeansStep | null {
  const steps = kmeans.steps.slice(0, -1);
  try {
    const lastStep = getLastStep({
      ...kmeans,
      steps,
    });
    if (lastStep.type === type) {
      return lastStep;
    }
    return getPreviousStepOfType(
      {
        ...kmeans,
        steps,
      },
      type,
    );
  } catch (error) {
    return null;
  }
}

export function stepKMeans(kmeans: KMeansAlgorithm): KMeansStep {
  const lastStep = getLastStep(kmeans);

  switch (lastStep.nextStep) {
    case "initializeCentroids":
      return initializeCentroidsStep(kmeans);
    case "assignPointsToClusters":
      return assignPointsToClustersStep(kmeans);
    case "updateCentroids":
      return updateCentroidsStep(kmeans);
    case "checkConvergence":
      return checkConvergenceStep(kmeans);
    default:
      return lastStep;
  }
}

function initializeCentroidsStep(kmeans: KMeansAlgorithm): KMeansStep {
  const { points } = kmeans.steps.at(-1)!.state;
  const { k } = kmeans.config;
  const centroids = generateRandomCentroids(points, k);

  return {
    type: "initializeCentroids",
    state: {
      points,
      centroids,
      iteration: 0,
    },
    nextStep: "assignPointsToClusters",
    description: (
      <div>
        <p>Initializing {k} random centroids:</p>
        <ul>
          {centroids.map((centroid, index) => (
            <li key={centroid.id}>
              Centroid {index + 1}: ({centroid.coords.x.toFixed(2)},{" "}
              {centroid.coords.y.toFixed(2)}, {centroid.coords.z.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>
    ),
  };
}

function assignPointsToClustersStep(kmeans: KMeansAlgorithm): KMeansStep {
  const lastStep = getLastStep(kmeans);
  const { points, centroids } = lastStep.state;

  const updatedPoints = points.map((point) => {
    const nearestCentroid = findNearestCentroid(point, centroids);
    return { ...point, group: nearestCentroid.group };
  });

  return {
    type: "assignPointsToClusters",
    state: {
      ...lastStep.state,
      points: updatedPoints,
    },
    nextStep: "updateCentroids",
    description: (
      <div>
        <p>Assigning points to the nearest centroid:</p>
        <p>
          Each point is assigned to the cluster of its nearest centroid based on
          Euclidean distance.
        </p>
      </div>
    ),
  };
}

function updateCentroidsStep(kmeans: KMeansAlgorithm): KMeansStep {
  const lastStep = getLastStep(kmeans);
  const { points, centroids } = lastStep.state;

  const updatedCentroids = centroids.map((centroid) => {
    const clusterPoints = points.filter(
      (p) => p.group.label === centroid.group.label,
    );
    const newCoords = calculateMeanCoords(clusterPoints);
    return { ...centroid, coords: newCoords };
  });

  return {
    type: "updateCentroids",
    state: {
      ...lastStep.state,
      centroids: updatedCentroids,
      iteration: lastStep.state.iteration + 1,
    },
    nextStep: "checkConvergence",
    description: (
      <div>
        <p>Updating centroid positions:</p>
        <ul>
          {updatedCentroids.map((centroid, index) => (
            <li key={centroid.id}>
              Centroid {index + 1}: ({centroid.coords.x.toFixed(2)},{" "}
              {centroid.coords.y.toFixed(2)}, {centroid.coords.z.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>
    ),
  };
}

function checkConvergenceStep(kmeans: KMeansAlgorithm): KMeansStep {
  const lastConvergenceStep = getPreviousStepOfType(kmeans, "updateCentroids");
  const lastStep = getLastStep(kmeans);
  let hasConverged = false;
  if (lastConvergenceStep) {
    const { iteration, centroids } = lastStep.state;
    const { maxIterations } = kmeans.config;

    hasConverged =
      iteration >= maxIterations ||
      centroids.every((centroid, index) => {
        const previousCentroid =
          lastConvergenceStep.state.centroids[index]?.coords;
        return (
          previousCentroid &&
          calculateDistance(centroid.coords, previousCentroid) === 0
        );
      });
  }

  return {
    type: "checkConvergence",
    state: lastStep.state,
    nextStep: hasConverged ? null : "assignPointsToClusters",
    description: (
      <div>
        <p>Checking convergence:</p>
        <p>
          Current iteration: {lastStep.state.iteration} /{" "}
          {kmeans.config.maxIterations}
        </p>
        {hasConverged ? (
          <p>The algorithm has converged or reached the maximum iterations.</p>
        ) : (
          <p>The algorithm will continue to the next iteration.</p>
        )}
      </div>
    ),
  };
}

// Helper functions

function calculateDistance(a: Point["coords"], b: Point["coords"]): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
  );
}

function findNearestCentroid(point: Point, centroids: Point[]): Point {
  return centroids.reduce((nearest, centroid) => {
    const distance = calculateDistance(point.coords, centroid.coords);
    return distance < calculateDistance(point.coords, nearest.coords)
      ? centroid
      : nearest;
  });
}

function calculateMeanCoords(points: Point[]): Coords {
  const sum = points.reduce(
    (acc, point) => ({
      x: acc.x + point.coords.x,
      y: acc.y + point.coords.y,
      z: acc.z + point.coords.z,
    }),
    { x: 0, y: 0, z: 0 },
  );

  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
    z: sum.z / points.length,
  };
}

function generateRandomCentroids(points: Point[], k: number): Point[] {
  const centroids: Point[] = [];
  const groups = generateKGroups(k);
  const availablePoints = [...points];

  for (let i = 0; i < k; i++) {
    if (availablePoints.length === 0) {
      throw new Error("Not enough unique points to generate centroids");
    }
    const randomIndex = Math.floor(Math.random() * availablePoints.length);
    const randomPoint = availablePoints[randomIndex]!;
    centroids.push({
      id: `centroid-${i}`,
      coords: { ...randomPoint.coords },
      group: groups[i]!,
    });
    availablePoints.splice(randomIndex, 1);
  }

  return centroids;
}

export function generateKGroups(k: number): Group[] {
  return Array.from({ length: k }, (_, i) => ({
    label: `Group ${i + 1}`,
    material: getMaterial(i),
  }));
}

// Data generation functions (similar to KNN)

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

export function generateRandomPoint({
  groups,
  points,
}: {
  groups: Group[];
  points: Point[];
}): Point {
  const group = groups[0]!;
  const coords = {
    x: randomValue(defaultGroupSimilarityTendency, group),
    y: randomValue(defaultGroupSimilarityTendency, group),
    z: randomValue(defaultGroupSimilarityTendency, group),
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

  const distance = closestPoint.point
    ? calculateDistance(coords, closestPoint.point.coords)
    : Infinity;

  if (distance < 10) {
    return generateRandomPoint({ groups, points });
  }
  return {
    id: getNextId().toString(),
    coords: coords,
    group: group,
  };
}

export function generateRandomPoints(
  state: {
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
