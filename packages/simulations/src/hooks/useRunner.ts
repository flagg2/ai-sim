import { useCallback, useState } from "react";
import type { Algorithm, Step } from "../algos/common";
import { useInterval } from "usehooks-ts";
import type { UseAlgorithmReturn } from "./useAlgorithm";

export function useRunner<
  TAlgorithm extends Algorithm<Step<any, any>, object>,
>({
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
      if (steps.at(-1)?.nextStep === null) {
        setIsPlaying(false);
        return;
      }

      forward();
    },
    isPlaying ? 500 : null,
  );

  const forward = useCallback(() => {
    setSteps((prevSteps) => [...prevSteps, stepFunction(algorithm)]);
  }, [algorithm, stepFunction, setSteps]);

  const backward = useCallback(() => {
    if (steps.length > 1) {
      setSteps((prevSteps) => prevSteps.slice(0, -1));
    }
  }, [steps, setSteps]);

  const reset = useCallback(() => {
    setSteps(steps.slice(0, 1));
  }, [steps]);

  const lastStep = steps.at(-1) as TAlgorithm["steps"][number];
  const canGoForward = lastStep.nextStep !== null;

  return {
    steps,
    config,
    lastStep,
    backward,
    forward,
    reset,
    play,
    pause,
    canGoForward,
    canGoBackward: steps.length > 1,
    isPlaying,
  };
}

export type UseRunnerReturn<TAlgorithm extends Algorithm<any, any>> =
  ReturnType<typeof useRunner<TAlgorithm>>;
