import { getMaterial, getWhiteMaterial } from "../utils/materials";
import type { Algorithm, Coords3D, Group, Step } from "./common";

// this just doesnt work, probably have to do it myself

let id = 0;

function getNextId() {
  return (id++).toString();
}

function generateRandomPointForGroup(
  group: Group,
  centerOffset: Coords3D,
): Point {
  const spread = 20; // Adjust this to control the spread of points within a group
  const coords = {
    x: centerOffset.x + (Math.random() - 0.5) * spread,
    y: centerOffset.y + (Math.random() - 0.5) * spread,
    z: centerOffset.z + (Math.random() - 0.5) * spread,
  };

  return {
    id: getNextId(),
    coords,
    group,
  };
}

export function generateRandomPoints(
  groups: Group[],
  numberOfPointsPerGroup: number,
): Point[] {
  if (groups.length !== 2) {
    throw new Error(
      "SVM requires exactly two groups for binary classification",
    );
  }

  const centerOffsets = [
    { x: -30, y: -30, z: -30 },
    { x: 30, y: 30, z: 30 },
  ];

  const points: Point[] = [];

  groups.forEach((group, index) => {
    for (let i = 0; i < numberOfPointsPerGroup; i++) {
      points.push(generateRandomPointForGroup(group, centerOffsets[index]!));
    }
  });

  return points;
}

export function generateQueryPoint(): Point {
  const coords = {
    x: (Math.random() - 0.5) * 100,
    y: (Math.random() - 0.5) * 100,
    z: (Math.random() - 0.5) * 100,
  };

  return {
    id: getNextId(),
    coords,
    group: getDefaultGroup(),
  };
}

// ... (Import statements remain the same)

export type Point = {
  id: string;
  coords: Coords3D;
  group: Group;
};

type SVMStepType =
  | "initializeHyperplane"
  | "findSupportVectors"
  | "optimizeHyperplane"
  | "classifyQueryPoint";

type SVMStepState = {
  queryPoint: Point;
  hyperplane: {
    weights: Coords3D;
    bias: number;
  };
  supportVectors: Point[];
  iteration: number;
};

export type SVMStep = Step<SVMStepState, SVMStepType>;

export type SVMConfig = {
  trainingPoints: Point[];
  queryPoint: Point;
  maxIterations: number;
  learningRate: number;
  groups: Group[];
};

export type SVMAlgorithm = Algorithm<SVMStep, SVMConfig>;

function getLastStep(svm: SVMAlgorithm): SVMStep {
  if (svm.steps.length === 0) {
    throw new Error("No steps found");
  }
  return svm.steps[svm.steps.length - 1]!;
}

export function stepSVM(svm: SVMAlgorithm): SVMStep {
  const lastStep = getLastStep(svm);

  switch (lastStep.nextStep) {
    case "initializeHyperplane":
      return initializeHyperplaneStep(svm);
    case "findSupportVectors":
      return findSupportVectorsStep(svm);
    case "optimizeHyperplane":
      return optimizeHyperplaneStep(svm);
    case "classifyQueryPoint":
      return classifyQueryPointStep(svm);
    default:
      return lastStep;
  }
}

function initializeHyperplaneStep(svm: SVMAlgorithm): SVMStep {
  return {
    type: "initializeHyperplane",
    title: "Initialize Hyperplane",
    index: 0,
    state: {
      queryPoint: svm.config.queryPoint,
      hyperplane: {
        weights: { x: 0, y: 0, z: 0 },
        bias: 0,
      },
      supportVectors: [],
      iteration: 0,
    },
    nextStep: "optimizeHyperplane",
    description: (
      <div>
        <p>We initialize the hyperplane parameters to zero:</p>
        <ul>
          <li>Weights: (0, 0, 0)</li>
          <li>Bias: 0</li>
        </ul>
      </div>
    ),
  };
}

function hingeLossAndGradient(
  point: Point,
  weights: Coords3D,
  bias: number,
  C: number,
): { loss: number; gradW: Coords3D; gradB: number } {
  const x = point.coords;
  const y = point.group.label === "Group 1" ? 1 : -1;
  const margin =
    y * (weights.x * x.x + weights.y * x.y + weights.z * x.z + bias);
  if (margin >= 1) {
    return {
      loss: 0,
      gradW: { x: 0, y: 0, z: 0 },
      gradB: 0,
    };
  } else {
    return {
      loss: C * (1 - margin), // Apply C to the hinge loss
      gradW: {
        x: -C * y * x.x, // Scale the gradient by C
        y: -C * y * x.y,
        z: -C * y * x.z,
      },
      gradB: -C * y, // Scale the bias gradient by C
    };
  }
}

function optimizeHyperplaneStep(svm: SVMAlgorithm): SVMStep {
  const lastStep = getLastStep(svm);
  const { learningRate, maxIterations } = svm.config;
  const { hyperplane, iteration } = lastStep.state;
  const { weights, bias } = hyperplane;
  const { trainingPoints } = svm.config;
  const C = 1; // Penalty parameter (you can adjust this value)

  // Initialize gradients and loss
  let gradW = { x: 0, y: 0, z: 0 };
  let gradB = 0;
  let totalLoss = 0;

  // Compute gradients over all training points
  for (const point of trainingPoints) {
    const {
      loss,
      gradW: gW,
      gradB: gB,
    } = hingeLossAndGradient(point, weights, bias, C);
    totalLoss += loss;
    gradW.x += gW.x;
    gradW.y += gW.y;
    gradW.z += gW.z;
    gradB += gB;
  }

  // Include regularization in the gradient
  gradW.x += weights.x;
  gradW.y += weights.y;
  gradW.z += weights.z;

  // Update weights and bias
  const updatedWeights = {
    x: weights.x - learningRate * gradW.x,
    y: weights.y - learningRate * gradW.y,
    z: weights.z - learningRate * gradW.z,
  };
  const updatedBias = bias - learningRate * gradB;

  const newIteration = iteration + 1;

  // Check for convergence
  const tolerance = 0.001;
  const change = Math.sqrt(
    Math.pow(updatedWeights.x - weights.x, 2) +
      Math.pow(updatedWeights.y - weights.y, 2) +
      Math.pow(updatedWeights.z - weights.z, 2) +
      Math.pow(updatedBias - bias, 2),
  );

  const hasConverged = change < tolerance;
  const nextStep =
    hasConverged || newIteration >= maxIterations
      ? "classifyQueryPoint"
      : "optimizeHyperplane";

  return {
    type: "optimizeHyperplane",
    title: "Optimize Hyperplane",
    index: lastStep.index + 1,
    state: {
      ...lastStep.state,
      hyperplane: {
        weights: updatedWeights,
        bias: updatedBias,
      },
      iteration: newIteration,
    },
    nextStep,
    description: (
      <div>
        <p>We optimize the hyperplane using gradient descent and hinge loss:</p>
        <ul>
          <li>
            Updated Weights: ({updatedWeights.x.toFixed(4)},{" "}
            {updatedWeights.y.toFixed(4)}, {updatedWeights.z.toFixed(4)})
          </li>
          <li>Updated Bias: {updatedBias.toFixed(4)}</li>
          <li>Total Loss: {totalLoss.toFixed(4)}</li>
        </ul>
        <p>
          Iteration: {newIteration} / {maxIterations}
        </p>
        {hasConverged && (
          <p>
            <strong>Convergence achieved!</strong> The change in hyperplane
            parameters is below the tolerance threshold.
          </p>
        )}
      </div>
    ),
  };
}

function findSupportVectorsStep(svm: SVMAlgorithm): SVMStep {
  const lastStep = getLastStep(svm);
  const { hyperplane } = lastStep.state;
  const { weights, bias } = hyperplane;
  const { trainingPoints } = svm.config;

  // Identify support vectors where hinge loss is positive
  const supportVectors = trainingPoints.filter((point) => {
    const x = point.coords;
    const y = point.group.label === "Group 1" ? 1 : -1;
    const margin =
      y * (weights.x * x.x + weights.y * x.y + weights.z * x.z + bias);
    return margin < 1;
  });

  return {
    type: "findSupportVectors",
    title: "Find Support Vectors",
    index: lastStep.index + 1,
    state: {
      ...lastStep.state,
      supportVectors,
    },
    nextStep: "optimizeHyperplane",
    description: (
      <div>
        <p>We identify the support vectors (points with hinge loss &gt; 0):</p>
        <ul>
          {supportVectors.map((sv) => (
            <li key={sv.id}>
              Point {sv.id}: ({sv.coords.x.toFixed(2)}, {sv.coords.y.toFixed(2)}
              , {sv.coords.z.toFixed(2)})
            </li>
          ))}
        </ul>
      </div>
    ),
  };
}

function classifyQueryPointStep(svm: SVMAlgorithm): SVMStep {
  const lastStep = getLastStep(svm);
  const { queryPoint, hyperplane } = lastStep.state;
  const { weights, bias } = hyperplane;
  const { groups } = svm.config;

  const decisionValue =
    weights.x * queryPoint.coords.x +
    weights.y * queryPoint.coords.y +
    weights.z * queryPoint.coords.z +
    bias;

  const classifiedGroup = decisionValue >= 0 ? groups[0]! : groups[1]!;

  const classifiedQueryPoint = {
    ...queryPoint,
    group: classifiedGroup,
  };

  return {
    type: "classifyQueryPoint",
    title: "Classify Query Point",
    index: lastStep.index + 1,
    state: {
      ...lastStep.state,
      queryPoint: classifiedQueryPoint,
    },
    nextStep: null, // Algorithm complete
    description: (
      <div>
        <p>We classify the query point using the optimized hyperplane:</p>
        <p>Decision Value: {decisionValue.toFixed(4)}</p>
        <p>
          The query point is classified as:{" "}
          <strong
            style={{
              color: `#${classifiedGroup.material.color.getHexString()}`,
            }}
          >
            {classifiedGroup.label}
          </strong>
        </p>
      </div>
    ),
  };
}

// Helper functions remain the same except for necessary adjustments

function getDefaultGroup(): Group {
  return {
    label: "Unclassified",
    material: getWhiteMaterial(),
  };
}

function calculateDistanceToHyperplane(
  point: Coords3D,
  hyperplane: SVMStepState["hyperplane"],
): number {
  const { weights, bias } = hyperplane;
  return weights.x * point.x + weights.y * point.y + weights.z * point.z + bias;
}

export function generateKGroups(k: number): Group[] {
  const labels = ["Group 1", "Group -1"];
  return Array.from({ length: k }, (_, i) => ({
    label: labels[i]!,
    material: getMaterial(i),
  }));
}

// The rest of the code remains unchanged
