import type { SVMDefinition } from "./types";
import SVM from "ml-svm";

export const getSVMSteps2: SVMDefinition["getSteps"] = async (
  config,
  initialStep,
) => {
  const steps = [initialStep];
  const points = config.points;

  // Convert points to features and labels arrays
  const features = points.map((p) => [p.coords.x, p.coords.y]);
  const labels = points.map((p) => p.label);

  // Configure and train SVM
  const svm = new SVM({
    C: 1.0,
    tol: 1e-4,
    maxPasses: 10,
    maxIterations: 10000,
    kernel: "linear",
  });

  svm.train(features, labels);
  steps.push({
    type: "initial",
    title: "Initialize SVM",
    state: { alphas: [], bias: 0 },
    description: (
      <div>
        <p>Setting up SVM with:</p>
        <ul>
          <li>C (regularization parameter) = 1.0</li>
          <li>Kernel: Linear</li>
          <li>{points.length} training points</li>
        </ul>
      </div>
    ),
  });

  // Get support vectors
  const supportVectorIndices = svm.supportVectors();
  const supportVectors = supportVectorIndices.map((i) => points[i]);

  // We need at least 2 support vectors from different classes to define a line
  const positiveSV = supportVectors.find((p) => p.label === 1);
  const negativeSV = supportVectors.find((p) => p.label === -1);

  let slope = 0;
  let yIntercept = 0;

  if (positiveSV && negativeSV) {
    // Vector from negative to positive support vector
    const dx = positiveSV.coords.x - negativeSV.coords.x;
    const dy = positiveSV.coords.y - negativeSV.coords.y;

    // The separation line is perpendicular, so we use negative reciprocal slope
    slope = dx !== 0 ? -1 / (dy / dx) : Infinity;

    // Calculate midpoint - our line must pass through this point
    const midX = (positiveSV.coords.x + negativeSV.coords.x) / 2;
    const midY = (positiveSV.coords.y + negativeSV.coords.y) / 2;

    // Using point-slope form: y - y1 = m(x - x1)
    // Solve for b in y = mx + b
    yIntercept = midY - slope * midX;
  }

  const separationLine = { slope, yIntercept };

  console.log(separationLine);

  // Add the findSupportVectors step
  steps.push({
    type: "findSupportVectors",
    title: "Find Support Vectors",
    state: {
      supportVectors,
    },
    description: (
      <div>
        <p>Identifying support vectors:</p>
        <ul>
          <li>These are the points closest to the decision boundary</li>
          <li>Found {supportVectors.length} support vectors</li>
          <li>Current bias: {yIntercept.toFixed(4)}</li>
        </ul>
      </div>
    ),
  });

  steps.push({
    type: "calculateDecisionBoundary",
    title: "Final Decision Boundary",
    state: {
      supportVectors,
      separationLine,
    },
    description: (
      <div>
        <p>SVM training completed:</p>
        <ul>
          <li>Found {supportVectors.length} support vectors</li>
          <li>Final bias: {yIntercept.toFixed(4)}</li>
        </ul>
      </div>
    ),
  });

  return steps;
};
