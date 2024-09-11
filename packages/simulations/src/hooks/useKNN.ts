import { useEffect, useState } from "react";
import {
  generateKGroups,
  generateRandomPoint,
  generateRandomPoints,
  KNN,
  type KNNState,
} from "../algos/knn";
import { getWhiteMaterial } from "../utils/materials";

type AlgoProps = {
  numberOfPoints: number;
  k: number;
};

export function useKNN({ numberOfPoints, k }: AlgoProps) {
  const groups = generateKGroups(k);

  const [state, setState] = useState<KNNState>({
    config: {
      points: generateRandomPoints({ k, groups, points: [] }, numberOfPoints),
      groups,
      k,
      queryPoint: {
        id: "query",
        coords: { x: 50, y: 50, z: 50 },
        group: {
          label: "Current",
          material: getWhiteMaterial(),
        },
      },
    },
    steps: [],
  });

  useEffect(() => {
    const newPoints = state.config.points.slice(0, numberOfPoints);
    while (newPoints.length !== numberOfPoints) {
      newPoints.push(generateRandomPoint({ k, groups, points: newPoints }));
    }

    setState({
      ...state,
      config: {
        ...state.config,
        points: newPoints,
      },
    });
  }, [numberOfPoints]);

  useEffect(() => {
    setState({
      ...state,
      config: {
        ...state.config,
        points: generateRandomPoints(state.config, numberOfPoints),
        k,
      },
    });
  }, [k]);

  const forward = () => {
    const nextState = KNN.fastForward(state);
    setState(nextState);
  };

  const fastForward = () => {
    const nextState = KNN.forward(state);
    setState(nextState);
  };

  const backward = () => {
    const nextState = KNN.backward(state);
    setState(nextState);
  };

  const fastBackward = () => {
    const nextState = KNN.fastBackward(state);
    setState(nextState);
  };

  const stepDescription = state.steps.at(-1)?.description;

  return {
    state,
    forward,
    fastForward,
    backward,
    fastBackward,
    stepDescription,
  };
}

export type UseKNNReturn = ReturnType<typeof useKNN>;
