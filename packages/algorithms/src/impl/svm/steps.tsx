import type { SVMDefinition } from "./types";
import SVM from "ml-svm";
import Text from "../../lib/descriptions/text";
import Paragraph from "../../lib/descriptions/paragraph";
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
      <Text>
        <Paragraph>
          We start by setting up the Support Vector Machine (SVM) with the data
          provided. The SVM will try to find the best way to separate the data
          points into two groups, using the kernel type you've selected.
        </Paragraph>
        <Note>
          Different kernel types allow the SVM to create different types of
          boundaries. A linear kernel creates straight lines, while other
          kernels like RBF can create curved boundaries to better separate
          complex patterns.
        </Note>
      </Text>
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
      <Text>
        <Paragraph>
          The SVM identifies the most critical data points, known as support
          vectors. These points are closest to where the boundary will be and
          are key because they determine its shape and position.
        </Paragraph>
        <Note>
          Think of support vectors as the key markers that help decide where to
          draw the boundary. The kernel type determines how these points
          influence the boundary's shape - it could be straight or curved
          depending on your choice.
        </Note>
      </Text>
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
      <Text>
        <Paragraph>
          Using the selected kernel and the identified support vectors, the SVM
          creates the optimal boundary. This boundary maximizes the separation
          between the two groups, taking into account the kernel's ability to
          create either straight or curved divisions.
        </Paragraph>
        <Note>
          New data points can be classified by checking which side of this
          boundary they fall on. The kernel helps transform the space so that
          even complex patterns can be effectively separated.
        </Note>
      </Text>
    ),
  });

  return steps;
};
