import { getWhiteMaterial } from "@repo/simulations/utils/materials";
import type { KNNDefinition } from "./types";

export const getKNNInitialStep: KNNDefinition["getInitialStep"] = (config) => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <div>We want to determine which group the query point belongs to.</div>
    ),
    state: {
      currentIndex: 0,
      queryPoint: {
        id: "query",
        coords: { x: 50, y: 50, z: 50 },
        group: {
          label: "Current",
          material: getWhiteMaterial(),
        },
      },
      nearestNeighbors: [],
      distances: [],
    },
  };
};
