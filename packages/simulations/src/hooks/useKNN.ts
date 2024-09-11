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
};

// TODO: maybe make even more generic, export setconfig and dont use useEffect to update points

export function useKNN({ numberOfPoints, k }: AlgoProps) {
  const groups = generateKGroups(k);

  const algorithm = useAlgorithm<KNNAlgorithm>({
    initialConfig: {
      points: generateRandomPoints({ k, groups, points: [] }, numberOfPoints),
      groups,
      k,
      initialQueryPoint: {
        id: "query",
        coords: { x: 50, y: 50, z: 50 },
        group: {
          label: "Current",
          material: getWhiteMaterial(),
        },
      },
    },
  });

  const { config, setConfig } = algorithm;

  useEffect(() => {
    const newPoints = config.points.slice(0, numberOfPoints);
    while (newPoints.length !== numberOfPoints) {
      newPoints.push(generateRandomPoint({ k, groups, points: newPoints }));
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

  return useSimulation<KNNAlgorithm>({
    algorithm,
    stepFunction: stepKNN,
  });
}

export type UseKNNReturn = ReturnType<typeof useKNN>;
