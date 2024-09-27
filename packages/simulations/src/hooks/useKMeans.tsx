import { useMemo } from "react";
import {
  generateKGroups,
  generateRandomPoints,
  stepKMeans,
  type KMeansConfig,
  type KMeansStep,
} from "../algos/kmeans";
import { useSimulation } from "./useSimulation";
import { MeshStandardMaterial } from "three";

type AlgoProps = {
  numberOfPoints: number;
  k: number;
  maxIterations: number;
};

export function useKMeans({ numberOfPoints, k, maxIterations }: AlgoProps) {
  const config = useMemo(() => {
    //  const groups = generateKGroups(k);
    const points = generateRandomPoints(
      {
        groups: [
          {
            label: "No Group",
            material: new MeshStandardMaterial({ color: "white" }),
          },
        ],
        points: [],
      },
      numberOfPoints,
    );

    return {
      initialPoints: points,
      // groups,
      k,
      maxIterations,
    } as KMeansConfig;
  }, [numberOfPoints, k, maxIterations]);

  const initialStep = useMemo(
    () =>
      ({
        index: 1,
        type: "initial",
        title: "Initial State",
        description: (
          <div>We will cluster the points into {k} groups using K-means.</div>
        ),
        state: {
          // TODO:
          points: config.initialPoints,
          centroids: [],
          iteration: 0,
        },
        nextStep: "initializeCentroids",
      }) as KMeansStep,
    [config],
  );

  return useSimulation<KMeansStep, KMeansConfig>({
    initial: {
      step: initialStep,
      config,
    },
    stepFunction: stepKMeans,
  });
}

export type UseKMeansReturn = ReturnType<typeof useKMeans>;
