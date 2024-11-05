import type { DataPoint, SVMDefinition } from "./types";
import type { Coords3D } from "../common/types";

export const getSVMSteps: SVMDefinition["getSteps"] = (config, initialStep) => {
  const steps = [initialStep];
  const { points } = config;

  // Step 1: Transform to higher dimension if needed
  const transformedPoints = points.map((point) => ({
    ...point,
    transformedCoords: {
      x: point.coords.x,
      y: point.coords.y,
      z: (Math.pow(point.coords.x, 2) + Math.pow(point.coords.y, 2)) / 100, // Polynomial transformation
    } as Coords3D,
  }));

  steps.push({
    type: "transformToHigherDimension",
    title: "Transform to Higher Dimension",
    state: {
      transformedPoints,
    },
    description: (
      <div>
        <p>
          Transform the data points to a higher dimension using a kernel
          function. There are many different types of kernel functions, but in
          this case, we will use a polynomial kernel (with added division)
        </p>
        <p>
          This transformation allows us to find a linear separator in 3D that
          will correspond to a nonlinear boundary in the original 2D space.
        </p>
      </div>
    ),
  });

  // Step 2: Prepare data for perceptron training
  const labels = new Set(points.map((p) => p.label));
  const labelArray = Array.from(labels);
  if (labelArray.length !== 2) {
    throw new Error("Perceptron requires exactly two classes.");
  }
  const labelToNumber = new Map<string, number>();
  labelToNumber.set(labelArray[0]!.toString(), 1);
  labelToNumber.set(labelArray[1]!.toString(), -1);

  const X = transformedPoints.map((point) => [
    point.transformedCoords!.x,
    point.transformedCoords!.y,
    point.transformedCoords!.z,
  ]);
  const y = transformedPoints.map(
    (point) => labelToNumber.get(point.label!.toString())!,
  );

  // Step 3: Implement the perceptron algorithm
  const learningRate = 0.1;
  const maxIterations = 1000;
  const nFeatures = 3;
  let w = new Array(nFeatures).fill(0);
  let b = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    let errors = 0;
    for (let i = 0; i < X.length; i++) {
      const xi = X[i]!;
      const yi = y[i]!;
      const activation = w[0] * xi[0]! + w[1] * xi[1]! + w[2] * xi[2]! + b;
      if (yi * activation <= 0) {
        // Misclassified point, update weights and bias
        for (let j = 0; j < nFeatures; j++) {
          w[j] += learningRate * yi * xi[j]!;
        }
        b += learningRate * yi;
        errors++;
      }
    }
    if (errors === 0) {
      // Converged
      break;
    }
  }

  // Step 4: Identify support vectors
  const distances = transformedPoints.map((point, index) => {
    const xi = X[index]!;
    const distance =
      Math.abs(w[0] * xi[0]! + w[1] * xi[1]! + w[2] * xi[2]! + b) /
      Math.sqrt(w[0] ** 2 + w[1] ** 2 + w[2] ** 2);
    return { point, distance };
  });

  // Sort the distances to find the closest points to the hyperplane
  distances.sort((a, b) => a.distance - b.distance);

  const supportVectors = distances.map((d) => d.point).slice(0, 6);

  steps.push({
    type: "findSupportVectors",
    title: "Identify Support Vectors",
    state: { supportVectors, transformedPoints },
    description: (
      <p>
        Identify the support vectors as the points closest to the hyperplane. To
        do this, you would use a quadratic programming technique.
      </p>
    ),
  });

  // Step 5: Calculate margin
  const wNorm = Math.sqrt(w[0] ** 2 + w[1] ** 2 + w[2] ** 2);
  const margin = 2 / wNorm; // For perceptron, this is a rough estimation

  steps.push({
    type: "calculateHyperplane",
    title: "Calculate Separating Hyperplane",
    state: {
      transformedPoints,
      supportVectors,
      hyperplane: {
        normal: { x: w[0], y: w[1], z: w[2] },
        bias: b,
      },
      margin,
    },
    description: (
      <div>
        <p>
          Use the perceptron algorithm to find a hyperplane that separates the
          data in the transformed space.
        </p>
        <p>The margin width is approximately: {margin.toFixed(2)}</p>
      </div>
    ),
  });

  return steps;
};
