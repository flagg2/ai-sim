import { useMemo } from "react";
import {
  generateKGroups,
  generateRandomPoints,
  stepKNN,
  type KNNConfig,
  type KNNStep,
} from "../algos/knn";
import { getWhiteMaterial } from "../utils/materials";
import { useSimulation } from "./useSimulation";

type AlgoProps = {
  numberOfPoints: number;
  k: number;
  groupCount: number;
};

// TODO: maybe make even more generic, export setconfig and dont use useEffect to update points

export function useKNN({ numberOfPoints, k, groupCount }: AlgoProps) {
  const config = useMemo(() => {
    const groups = generateKGroups(groupCount);
    const points = generateRandomPoints({ groups, points: [] }, numberOfPoints);

    return {
      points,
      groups,
      k,
    } as KNNConfig;
  }, [numberOfPoints, k, groupCount]);

  const initialStep = useMemo(
    () =>
      ({
        type: "initial",
        title: "Initial State",
        description: (
          <div>
            We want to determine which group the query point belongs to.
          </div>
        ),
        index: 1,
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
        nextStep: "calculateDistance",
      }) as KNNStep,
    [config],
  );

  return useSimulation<KNNStep, KNNConfig>({
    initial: {
      step: initialStep,
      config,
    },
    stepFunction: stepKNN,
  });
}

export type UseKNNReturn = ReturnType<typeof useKNN>;
