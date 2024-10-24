import type { Algorithm, Coords3D, Group, Step } from "./common";
import { MathJax } from "better-react-mathjax";
import { getMaterial } from "../utils/materials";

export type Point = {
  id: string;
  coords: Coords3D;
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

export type KMeansStep = Step<KMeansStepState, KMeansStepType>;

export type KMeansConfig = {
  k: number;
  maxIterations: number;
  initialPoints: Point[];
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
  const lastStep = getLastStep(kmeans);
  const { points } = lastStep.state;
  const { k } = kmeans.config;
  const centroids = generateRandomCentroids(points, k);

  return {
    index: lastStep.index + 1,
    title: "Initialize Centroids",
    type: "initializeCentroids",
    state: {
      points,
      centroids,
      iteration: 0,
    },
    nextStep: "assignPointsToClusters",
    description: (
      <div>
        <p>Start by initializing {k} random centroids:</p>
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
    index: lastStep.index + 1,
    title: "Assign Points to Clusters",
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
    index: lastStep.index + 1,
    title: "Update Centroids",
    type: "updateCentroids",
    state: {
      ...lastStep.state,
      centroids: updatedCentroids,
      iteration: lastStep.state.iteration + 1,
    },
    nextStep: "checkConvergence",
    description: (
      <div>
        <p>
          We update the centroids to the mean of the points in each cluster.
        </p>
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

function getStateText(
  state: "continue" | "maxIterations" | "converged",
): string {
  switch (state) {
    case "continue":
      return "The algorithm will continue to the next iteration.";
    case "maxIterations":
      return "The algorithm has reached the maximum number of iterations.";
    case "converged":
      return "The algorithm has converged.";
  }
}

function checkConvergenceStep(kmeans: KMeansAlgorithm): KMeansStep {
  const lastConvergenceStep = getPreviousStepOfType(kmeans, "updateCentroids");
  const lastStep = getLastStep(kmeans);
  let state = "continue" as "continue" | "maxIterations" | "converged";
  if (lastStep.state.iteration >= kmeans.config.maxIterations) {
    state = "maxIterations";
  } else if (lastConvergenceStep) {
    const { iteration, centroids } = lastStep.state;
    const { maxIterations } = kmeans.config;

    if (
      centroids.every((centroid, index) => {
        const previousCentroid =
          lastConvergenceStep.state.centroids[index]?.coords;
        return (
          previousCentroid &&
          calculateDistance(centroid.coords, previousCentroid) === 0
        );
      })
    ) {
      state = "converged";
    }
  }

  return {
    index: lastStep.index + 1,
    title: "Check Convergence",
    type: "checkConvergence",
    state: lastStep.state,
    nextStep: state === "continue" ? "assignPointsToClusters" : null,
    description: (
      <div>
        <p>
          We check for convergence by comparing the current centroids to the
          previous centroids. If the centroids do not change, the algorithm has
          converged. Alternatively, we also stop the algorithm if it has reached
          the maximum number of iterations.
        </p>
        <br />
        <p>
          Current iteration: {lastStep.state.iteration} /{" "}
          {kmeans.config.maxIterations}
        </p>
        {getStateText(state)}
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

function calculateMeanCoords(points: Point[]): Coords3D {
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
