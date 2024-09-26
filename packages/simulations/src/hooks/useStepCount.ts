import { useState, useEffect, useTransition, useCallback } from "react";
import type { Algorithm, Step } from "../algos/common";
import { useRunner } from "./useRunner";
import type { UseAlgorithmReturn } from "./useAlgorithm";

export function useStepCount<
  TAlgorithm extends Algorithm<Step<any, any>, object>,
>(
  algorithm: UseAlgorithmReturn<TAlgorithm>,
  stepFunction: (algo: TAlgorithm) => TAlgorithm["steps"][number],
) {
  const [stepCount, setStepCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const stepCountRunner = useRunner({
    algorithm,
    stepFunction,
  });

  const runSimulation = useCallback(() => {
    startTransition(() => {
      let count = 0;
      while (stepCountRunner.canGoForward) {
        stepCountRunner.forward();
        count++;
        if (!stepCountRunner.canGoForward || count > 1000) {
          break;
        }
      }
      setStepCount(count);
    });
  }, [stepCountRunner]);

  useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  return {
    stepCount,
    isPending,
    rerunSimulation: runSimulation,
  };
}
