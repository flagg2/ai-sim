import Text from "../../lib/descriptions/text";
import Expression from "../../lib/descriptions/math";
import Paragraph from "../../lib/descriptions/paragraph";
import type { KMeansDefinition } from "./types";

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
          K-means algorithm.
        </Paragraph>
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
