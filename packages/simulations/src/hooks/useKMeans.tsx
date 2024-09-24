import { useEffect, useMemo, useState } from "react";
import {
  generateKGroups,
  generateRandomPoint,
  generateRandomPoints,
  stepKMeans,
  type KMeansAlgorithm,
  type Point,
} from "../algos/kmeans";
import { useSimulation } from "./useSimulation";
import { useAlgorithm } from "./useAlgorithm";

type AlgoProps = {
  numberOfPoints: number;
  k: number;
  maxIterations: number;
};

export function useKMeans({ numberOfPoints, k, maxIterations }: AlgoProps) {
  const groups = generateKGroups(k);

  const algorithm = useAlgorithm<KMeansAlgorithm>({
    initialConfig: {
      k,
      maxIterations,
    },
    initialStep: {
      type: "initial",
      description: (
        <div>We will cluster the points into {k} groups using K-means.</div>
      ),
      state: {
        points: [],
        centroids: [],
        iteration: 0,
      },
      nextStep: "initializeCentroids",
    },
  });

  const { config, setConfig, setSteps } = algorithm;

  useEffect(() => {
    const newPoints = generateRandomPoints(
      { groups, points: [] },
      numberOfPoints,
    );
    while (newPoints.length !== numberOfPoints) {
      newPoints.push(generateRandomPoint({ groups, points: newPoints }));
    }

    setSteps([
      {
        type: "initial",
        description: (
          <div>We will cluster the points into {k} groups using K-means.</div>
        ),
        state: {
          points: newPoints,
          centroids: [],
          iteration: 0,
        },
        nextStep: "initializeCentroids",
      },
    ]);
  }, [numberOfPoints]);

  useEffect(() => {
    const newGroups = generateKGroups(k);
    setConfig({
      ...config,
      k,
    });
  }, [k]);

  useEffect(() => {
    setConfig({
      ...config,
      maxIterations,
    });
  }, [maxIterations]);

  return useSimulation<KMeansAlgorithm>({
    algorithm,
    stepFunction: stepKMeans,
  });
}

export type UseKMeansReturn = ReturnType<typeof useKMeans>;
