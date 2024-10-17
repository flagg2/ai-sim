import { useMemo } from "react";
import {
  generateKGroups,
  generateQueryPoint,
  generateRandomPoints,
  stepSVM,
  type SVMConfig,
  type SVMStep,
} from "../algos/svm";
import { useSimulation } from "./useSimulation";

type AlgoProps = {
  numberOfPoints: number;
  maxIterations: number;
  learningRate: number;
};

export function useSVM({
  numberOfPoints,
  maxIterations,
  learningRate,
}: AlgoProps) {
  console.log("cika");
  const config = useMemo(() => {
    const groups = generateKGroups(2); // SVM typically uses binary classification
    const trainingPoints = generateRandomPoints(groups, numberOfPoints);
    const queryPoint = generateQueryPoint();

    console.log({ queryPoint });

    return {
      trainingPoints,
      queryPoint,
      maxIterations,
      learningRate,
      groups,
    } as SVMConfig;
  }, [numberOfPoints, maxIterations, learningRate]);

  const initialStep = useMemo(
    () =>
      ({
        index: 1,
        type: "initial",
        title: "Initial State",
        description: (
          <div>
            We will classify the query point using Support Vector Machine (SVM)
            algorithm.
          </div>
        ),
        state: {
          queryPoint: config.queryPoint,
          hyperplane: {
            weights: { x: 0, y: 0, z: 0 },
            bias: 0,
          },
          supportVectors: [],
          iteration: 0,
        },
        nextStep: "initializeHyperplane",
      }) as SVMStep,
    [config],
  );

  return useSimulation<SVMStep, SVMConfig>({
    initial: {
      step: initialStep,
      config,
    },
    simulateSteps: stepSVM,
  });
}

export type UseSVMReturn = ReturnType<typeof useSVM>;
