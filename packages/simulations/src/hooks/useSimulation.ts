import { useCallback, useState } from "react";
import type { Algorithm } from "../algos/common";
import { useInterval } from "usehooks-ts";
import type { UseAlgorithmReturn } from "./useAlgorithm";

export function useSimulation<TAlgorithm extends Algorithm<any, any>>({
  algorithm: { steps, config, algorithm, setSteps },
  stepFunction,
}: {
  algorithm: UseAlgorithmReturn<TAlgorithm>;
  stepFunction: (algo: TAlgorithm) => TAlgorithm["steps"][number];
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useInterval(
    () => {
      forward();
    },
    isPlaying ? 500 : null,
  );

  const forward = useCallback(() => {
    setSteps((prevSteps) => [...prevSteps, stepFunction(algorithm)]);
  }, [algorithm, stepFunction, setSteps]);

  const backward = useCallback(() => {
    setSteps((prevSteps) => prevSteps.slice(0, -1));
  }, [algorithm, setSteps]);

  const reset = useCallback(() => {
    setSteps([]);
  }, []);

  return {
    steps,
    config,
    lastStep: steps.at(-1) as TAlgorithm["steps"][number] | undefined,
    backward,
    forward,
    reset,
    play,
    pause,
    //TODO: implement me
    canGoForward: true,
    canGoBackward: steps.length > 0,
    isPlaying,
  };
}

export type UseSimulationReturn<TAlgorithm extends Algorithm<any, any>> =
  ReturnType<typeof useSimulation<TAlgorithm>>;
