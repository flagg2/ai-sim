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
          boundary that creates the widest possible gap (called a{" "}
          <strong>margin</strong>) between different classes of data points.
        </p>
        <p>The algorithm will:</p>
        <ul>
          <li>
            <strong>Analyze</strong> the training data points
          </li>
          <li>
            <strong>Find</strong> the best boundary to separate the classes
          </li>
          <li>
            Identify the key points called <strong>support vectors</strong> that
            define this boundary
          </li>
          <li>
            Create the widest possible <strong>margin</strong> around the
            boundary
          </li>
        </ul>
      </div>
    ),
    state: {},
  };
};
