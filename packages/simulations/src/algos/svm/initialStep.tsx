import type { SVMDefinition } from "./types";

export const getSVMInitialStep: SVMDefinition["getInitialStep"] = (config) => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <div>
        <p>
          We want to classify the data points into two classes using Support
          Vector Machine (SVM).
        </p>
        <p>
          {config.points.some((p) => p.transformedCoords)
            ? "The data points are not linearly separable in 2D space, so we'll need to use the kernel trick."
            : "The data points are linearly separable in 2D space."}
        </p>
      </div>
    ),
    state: {
      transformedPoints: undefined,
      supportVectors: undefined,
      hyperplane: undefined,
      margin: undefined,
    },
  };
};
