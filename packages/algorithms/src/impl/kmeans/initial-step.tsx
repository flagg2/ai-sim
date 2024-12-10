import Expression from "../../lib/descriptions/math";
import type { KMeansDefinition } from "./types";
import Note from "../../lib/descriptions/note";

export const getKMeansInitialStep: KMeansDefinition["getInitialStep"] = (
  config,
) => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <div>
        <p>
          We will cluster <Expression>{config.points.length}</Expression> points
          into <Expression>k={config.k.toString()}</Expression> groups using the
          K-means algorithm. This algorithm helps us find natural groupings in
          our data by organizing similar points together.
        </p>
        <Note>
          <p>K-means is an iterative process that will:</p>
          <ul>
            <li>Place initial center points (centroids)</li>
            <li>Group nearby points together</li>
            <li>Adjust the centroids' positions</li>
            <li>Repeat until the groups stabilize</li>
          </ul>
        </Note>
      </div>
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
