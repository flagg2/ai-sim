import type { SVMDefinition } from "./types";
import Text from "../../lib/descriptions/text";
import Paragraph from "../../lib/descriptions/paragraph";
import Note from "../../lib/descriptions/note";
import { ListItem } from "../../lib/descriptions/list";
import List from "../../lib/descriptions/list";

export const getSVMInitialStep: SVMDefinition["getInitialStep"] = () => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <Text>
        <Paragraph>
          We will classify data points into two groups using Support Vector
          Machine (SVM). SVM works by finding a boundary that creates the widest
          possible gap (called a margin) between different classes of data
          points.
        </Paragraph>
        <List>
          <Paragraph>The algorithm will:</Paragraph>
          <ListItem>Analyze the training data points</ListItem>
          <ListItem>Find the best boundary to separate the classes</ListItem>
          <ListItem>
            Identify the key points (support vectors) that define this boundary
          </ListItem>
          <ListItem>
            Create the widest possible margin around the boundary
          </ListItem>
        </List>
      </Text>
    ),
    state: {},
  };
};
