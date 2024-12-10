import type { SVMDefinition } from "./types";
import SVM from "ml-svm";
import Note from "../../lib/descriptions/note";
import { BOUNDARY_SCALE, GRID_SIZE } from "./const";

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
          <strong>separate the data points</strong> into two groups, using the{" "}
          <strong>kernel type</strong> you've selected.
        </p>
        <Note>
          Different <strong>kernel types</strong> allow the SVM to create
          different types of boundaries. A <strong>linear kernel</strong>{" "}
          creates straight lines, while other kernels like <strong>RBF</strong>{" "}
          can create curved boundaries to better separate complex patterns.
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
          <strong>shape and position</strong>.
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
          boundary they fall on. The <strong>kernel</strong> helps transform the
          space so that even complex patterns can be effectively separated.
        </Note>
      </div>
    ),
  });

  return steps;
};
