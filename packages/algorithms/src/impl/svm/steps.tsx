import type { SVMDefinition } from "./types";
import SVM from "ml-svm";
import Description from "../../lib/descriptions/description";
import Paragraph from "../../lib/descriptions/paragraph";
import List, { ListItem } from "../../lib/descriptions/list";
import Note from "../../lib/descriptions/note";

export const getSVMSteps: SVMDefinition["getSteps"] = async (
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
      <Description>
        <Paragraph>
          The Support Vector Machine (SVM) begins by analyzing the training
          data, looking for the best way to separate the two classes with a
          clear boundary.
        </Paragraph>
        <Note>
          We'll use a linear approach, which means our boundary will be a
          straight line that maximizes the gap between the two classes.
        </Note>
      </Description>
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
      <Description>
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
      </Description>
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
      <Description>
        <Paragraph>
          With our support vectors identified, we can now draw the optimal
          boundary. This line sits exactly halfway between the closest points of
          each class, creating the widest possible gap between them.
        </Paragraph>
        <Note>
          Any new points can now be classified simply by checking which side of
          this boundary they fall on.
        </Note>
      </Description>
    ),
  });

  return steps;
};
