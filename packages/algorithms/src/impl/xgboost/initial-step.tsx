import type { XGBoostDefinition } from "./types";
import Description from "../../lib/descriptions/description";
import Paragraph from "../../lib/descriptions/paragraph";
import Note from "../../lib/descriptions/note";

export const getXGBoostInitialStep: XGBoostDefinition["getInitialStep"] = (
  config,
) => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <Description>
        <Paragraph>
          We'll use XGBoost to classify our data points into two classes. The
          algorithm builds an ensemble of decision trees, where each tree tries
          to correct the mistakes made by previous trees.
        </Paragraph>
        <Note>
          We'll start by calculating the mean prediction as our base prediction,
          then iteratively add trees to improve our predictions.
        </Note>
      </Description>
    ),
    state: {},
  };
};
