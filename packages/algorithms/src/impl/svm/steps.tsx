import type { SVMConfig, SVMDefinition } from "./types";
import SVM from "ml-svm";
import Note from "../../lib/descriptions/note";
import { BOUNDARY_SCALE, GRID_SIZE } from "./const";

function getKernelDescription(config: SVMConfig) {
  if (config.kernelType === "linear") {
    if (config.hasRadialData) {
      return "Our data has a circular pattern. The linear kernel might not be sufficient to separate the data effectively.";
    } else {
      return "Our data is linear, so the linear kernel is appropriate.";
    }
  } else {
    if (config.hasRadialData) {
      return "Our data has a circular pattern. The radial kernel is appropriate for the data, allowing for effective separation with curved boundaries.";
    } else {
      return "Our data is linear, so the radial kernel might be more complex than necessary.";
    }
  }
}

export const getSVMSteps: SVMDefinition["getSteps"] = async (
  config,
  initialStep,
) => {
  const steps = [initialStep];
  const points = config.points;

  const features = points.map((p) => [p.coords.x, p.coords.y]);
  const labels = points.map((p) => p.label);

  const svm = new SVM({
    C: 10.0,
    tol: 1e-6,
    maxPasses: 100,
    maxIterations: 10000,
    kernel: config.kernelType,
  });

  svm.train(features, labels);

  steps.push({
    type: "initial",
    title: "Initialize SVM",
    state: { alphas: [], bias: 0 },
    description: (
      <div>
        <p>
          We start by setting up the{" "}
          <strong>Support Vector Machine (SVM)</strong> with the data provided.
          The SVM will try to find the best way to{" "}
          <strong>separate the data points</strong> into two groups.
        </p>
        <p>
          A <strong>kernel</strong> is a function that transforms the data into
          a higher-dimensional space, allowing the SVM to find a boundary that
          separates the data more effectively.{" "}
          {config.kernelType === "linear" ? (
            <span>
              We are using a <strong>linear kernel</strong> does not transform
              the data, creating a boundary that is a straight line.
            </span>
          ) : (
            <span>
              We are using a <strong>rbf kernel</strong> that uses a radial
              basis function to transform the data, creating a boundary that can
              be curved.
            </span>
          )}
        </p>
        <Note>
          {getKernelDescription(config)} You can change the kernel type in
          configuration to see how it affects the boundary.
        </Note>
      </div>
    ),
  });

  const supportVectorIndices = svm.supportVectors();
  const supportVectors = supportVectorIndices.map((i) => points[i]);

  steps.push({
    type: "findSupportVectors",
    title: "Find Support Vectors",
    state: {
      supportVectors,
    },
    description: (
      <div>
        <p>
          The SVM identifies the most critical data points, known as{" "}
          <strong>support vectors</strong>. These points are closest to where
          the boundary will be and are key because they determine its{" "}
          <strong>shape and position</strong>. The boundary is chosen to create
          the widest possible <strong>margin </strong>between different classes
          of data points.
        </p>
        <Note>
          Think of <strong>support vectors</strong> as the key markers that help
          decide where to draw the boundary. The <strong>kernel type</strong>{" "}
          determines how these points influence the boundary's shape - it could
          be straight or curved depending on your choice.
        </Note>
      </div>
    ),
  });

  // generate grid points for the decision boundary
  const regionData: { x: number; y: number; prediction: 1 | -1 }[] = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const x = (i / (GRID_SIZE - 1)) * BOUNDARY_SCALE;
      const y = (j / (GRID_SIZE - 1)) * BOUNDARY_SCALE;
      const prediction = svm.predict([x, y]) as 1 | -1;
      regionData.push({ x, y, prediction });
    }
  }

  steps.push({
    type: "calculateDecisionBoundary",
    title: "Final Decision Boundary",
    state: {
      supportVectors,
      regionData,
    },
    description: (
      <div>
        <p>
          Using the selected <strong>kernel</strong> and the identified{" "}
          <strong>support vectors</strong>, the SVM creates the optimal
          boundary. This boundary maximizes the{" "}
          <strong>separation between the two groups</strong>, taking into
          account the kernel's ability to create either straight or curved
          divisions.
        </p>
        <Note>
          New data points can be classified by checking which side of this
          boundary they fall on.
        </Note>
      </div>
    ),
  });

  return steps;
};
