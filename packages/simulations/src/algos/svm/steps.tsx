import type { DataPoint, SVMDefinition } from "./types";
import type { Coords3D } from "../common/types";

export const getSVMSteps: SVMDefinition["getSteps"] = async (
  config,
  initialStep,
) => {
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

  console.log(transformedPoints);

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
          function. In this case, we use a polynomial kernel (with added
          division).
        </p>
        <p>
          This transformation allows us to find a linear separator in 3D that
          will correspond to a nonlinear boundary in the original 2D space.
        </p>
      </div>
    ),
  });

  // Group points by label
  const pointsByLabel = transformedPoints.reduce(
    (acc, point) => {
      const label = point.label!.toString();
      console.log(label);
      if (!acc[label]) acc[label] = [];
      acc[label].push(point);
      return acc;
    },
    {} as Record<string, DataPoint[]>,
  );

  if (!pointsByLabel["-1"] || !pointsByLabel["1"]) {
    console.error("Missing one or both class labels in pointsByLabel.");
    return steps; // Return steps early if classes are missing
  }

  // Step 2: Find the two closest points between opposite classes
  let minDistance = Infinity;
  let closestPair: [DataPoint, DataPoint] | null = null;

  for (const pointA of pointsByLabel["-1"]) {
    for (const pointB of pointsByLabel["1"]) {
      const distance = Math.sqrt(
        Math.pow(pointA.transformedCoords!.x - pointB.transformedCoords!.x, 2) +
          Math.pow(
            pointA.transformedCoords!.y - pointB.transformedCoords!.y,
            2,
          ) +
          Math.pow(
            pointA.transformedCoords!.z - pointB.transformedCoords!.z,
            2,
          ),
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestPair = [pointA, pointB];
      }
    }
  }

  if (closestPair) {
    const [pointA, pointB] = closestPair;

    // Calculate the normal vector (w) as the vector from one support vector to the other
    const w = {
      x: pointB.transformedCoords!.x - pointA.transformedCoords!.x,
      y: pointB.transformedCoords!.y - pointA.transformedCoords!.y,
      z: pointB.transformedCoords!.z - pointA.transformedCoords!.z,
    };

    // Calculate the bias (b) as the midpoint of the closest pair projected onto w
    const bias = -(
      (w.x * (pointA.transformedCoords!.x + pointB.transformedCoords!.x)) / 2 +
      (w.y * (pointA.transformedCoords!.y + pointB.transformedCoords!.y)) / 2 +
      (w.z * (pointA.transformedCoords!.z + pointB.transformedCoords!.z)) / 2
    );

    steps.push({
      type: "findSupportVectors",
      title: "Identify Support Vectors",
      state: { supportVectors: closestPair, transformedPoints },
      description: (
        <p>
          Select support vectors by finding the two closest points between
          opposite classes.
        </p>
      ),
    });

    steps.push({
      type: "calculateHyperplane",
      title: "Calculate Separating Hyperplane",
      state: {
        transformedPoints,
        supportVectors: closestPair,
        hyperplane: {
          normal: w,
          bias: bias,
        },
      },
      description: (
        <div>
          <p>
            Calculate a separating hyperplane directly between the support
            vectors.
          </p>
        </div>
      ),
    });
  }

  return steps;
};
