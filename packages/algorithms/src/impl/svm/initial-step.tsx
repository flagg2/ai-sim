import type { SVMDefinition } from "./types";

export const getSVMInitialStep: SVMDefinition["getInitialStep"] = () => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <div>
        <p>
          We want to classify the data points into two classes using Support
          Vector Machine (SVM).
        </p>
        <p>The data points are linearly separable in 2D space.</p>
      </div>
    ),
    state: {},
  };
};
