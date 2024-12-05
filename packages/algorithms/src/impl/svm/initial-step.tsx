import type { SVMDefinition } from "./types";
import Text from "../../lib/descriptions/text";
import Paragraph from "../../lib/descriptions/paragraph";
import Note from "../../lib/descriptions/note";

export const getSVMInitialStep: SVMDefinition["getInitialStep"] = () => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <Text>
        <Paragraph>
          We want to classify the data points into two classes using Support
          Vector Machine (SVM).
        </Paragraph>
        <Note>
          SVM will find the optimal hyperplane that maximizes the margin between
          classes.
        </Note>
      </Text>
    ),
    state: {},
  };
};
