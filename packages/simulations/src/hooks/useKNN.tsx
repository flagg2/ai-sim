import { useEffect, useState } from "react";
import {
  generateKGroups,
  generateRandomPoint,
  generateRandomPoints,
  stepKNN,
  type KNNAlgorithm,
} from "../algos/knn";
import { getWhiteMaterial } from "../utils/materials";
import { useSimulation } from "./useSimulation";
import { useAlgorithm } from "./useAlgorithm";

type AlgoProps = {
  numberOfPoints: number;
  k: number;
  groupCount: number;
};

// TODO: maybe make even more generic, export setconfig and dont use useEffect to update points

export function useKNN({ numberOfPoints, k, groupCount }: AlgoProps) {
  const groups = generateKGroups(groupCount);

  // TODO: show config even be state?
  const algorithm = useAlgorithm<KNNAlgorithm>({
    initialConfig: {
      points: generateRandomPoints({ groups, points: [] }, numberOfPoints),
      groups,
      k,
    },
    initialStep: {
      type: "initial",
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
      nextStep: "calculateDistance",
    },
  });

  const { config, setConfig } = algorithm;

  useEffect(() => {
    const newPoints = config.points.slice(0, numberOfPoints);
    while (newPoints.length !== numberOfPoints) {
      newPoints.push(generateRandomPoint({ groups, points: newPoints }));
    }

    setConfig({
      ...config,
      points: newPoints,
    });
  }, [numberOfPoints]);

  useEffect(() => {
    setConfig({
      ...config,
      points: generateRandomPoints(config, numberOfPoints),
      k,
    });
  }, [k]);

  useEffect(() => {
    setConfig({
      ...config,
      points: generateRandomPoints(config, numberOfPoints),
      groups,
    });
  }, [groupCount]);

  return useSimulation<KNNAlgorithm>({
    algorithm,
    stepFunction: stepKNN,
  });
}

export type UseKNNReturn = ReturnType<typeof useKNN>;
