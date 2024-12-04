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
          The Support Vector Machine (SVM) begins by analyzing the training
          data, looking for the best way to separate the two classes with a
          clear boundary.
        </Paragraph>
        <Note>
          We'll use a linear approach, which means our boundary will be a
          straight line that maximizes the gap between the two classes.
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
          The algorithm now identifies the most important points - called
          support vectors. These are the points closest to where we'll draw our
          boundary, and they're crucial because they alone determine where the
          final boundary will be.
        </Paragraph>
        <Note>
          Think of support vectors as the "goal posts" that define where to draw
          the boundary line. All other points could be moved or removed without
          affecting our decision.
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
          With our support vectors identified, we can now draw the optimal
          boundary. This line sits exactly halfway between the closest points of
          each class, creating the widest possible gap between them.
        </Paragraph>
        <Note>
          Any new points can now be classified simply by checking which side of
          this boundary they fall on.
        </Note>
      </Text>
    ),
  });

  return steps;
};
