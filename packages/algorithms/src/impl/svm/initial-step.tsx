import type { SVMDefinition } from "./types";
import Description from "../../lib/descriptions/description";
import Paragraph from "../../lib/descriptions/paragraph";
import Note from "../../lib/descriptions/note";

export const getSVMInitialStep: SVMDefinition["getInitialStep"] = () => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <Description>
        <Paragraph>
          We want to classify the data points into two classes using Support
          Vector Machine (SVM).
        </Paragraph>
        <Paragraph>
          The data points are linearly separable in 2D space.
        </Paragraph>
        <Note>
          SVM will find the optimal hyperplane that maximizes the margin between
          classes.
        </Note>
      </Description>
    ),
    state: {},
  };
};
