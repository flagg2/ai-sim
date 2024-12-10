import type { XGBoostDefinition } from "./types";
import Note from "../../lib/descriptions/note";

export const getXGBoostInitialStep: XGBoostDefinition["getInitialStep"] =
  () => {
    return {
      type: "initial",
      title: "Initial State",
      description: (
        <div>
          <p>
            We'll use XGBoost to classify our data points into two classes. The
            algorithm builds an ensemble of decision trees, where each tree
            tries to correct the mistakes made by previous trees.
          </p>
          <Note>
            We'll start by calculating the mean prediction as our base
            prediction, then iteratively add trees to improve our predictions.
          </Note>
        </div>
      ),
      state: {},
    };
  };
