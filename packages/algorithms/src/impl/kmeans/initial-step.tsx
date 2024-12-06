import Text from "../../lib/descriptions/text";
import Expression from "../../lib/descriptions/math";
import Paragraph from "../../lib/descriptions/paragraph";
import type { KMeansDefinition } from "./types";
import List, { ListItem } from "../../lib/descriptions/list";

export const getKMeansInitialStep: KMeansDefinition["getInitialStep"] = (
  config,
) => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <Text>
        <Paragraph>
          We will cluster <Expression>{config.points.length}</Expression> points
          into <Expression>k={config.k.toString()}</Expression> groups using the
          K-means algorithm. This algorithm helps us find natural groupings in
          our data by organizing similar points together.
        </Paragraph>
        <Paragraph>K-means is an iterative process that will:</Paragraph>
        <List>
          <ListItem>Place initial center points (centroids)</ListItem>
          <ListItem>Group nearby points together</ListItem>
          <ListItem>Adjust the centroids' positions</ListItem>
          <ListItem>Repeat until the groups stabilize</ListItem>
        </List>
      </Text>
    ),
    index: 1,
    state: {
      points: config.points,
      centroids: [],
      iteration: 0,
    },
    nextStep: "initializeCentroids",
  };
};
