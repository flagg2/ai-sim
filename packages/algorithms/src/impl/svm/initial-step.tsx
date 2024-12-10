import type { SVMDefinition } from "./types";

export const getSVMInitialStep: SVMDefinition["getInitialStep"] = () => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <div>
        <p>
          We will classify data points into two groups using{" "}
          <strong>Support Vector Machine (SVM)</strong>. SVM works by finding a
          boundary that creates the widest possible gap, called a{" "}
          <strong>margin</strong> between different classes of data points.
        </p>
      </div>
    ),
    state: {},
  };
};
