import { useCallback, useMemo, useState, useTransition } from "react";
import type { AlgorithmDefinition, Step } from "../algos/types";
import { useInterval } from "usehooks-ts";
import type { UseAlgorithmReturn } from "./useAlgorithmState";

export function useRunner<TStep extends Step, TConfig extends object>({
  state: { config, algorithmState, setSteps, initialStep },
  getSteps,
}: {
  state: UseAlgorithmReturn<TStep, TConfig>;
  getSteps: AlgorithmDefinition<TStep, TConfig>["getSteps"];
}):
  | {
      currentStep: TStep;
      currentStepIndex: number;
      config: TConfig;
      start: () => void;
      status: "configuring";
    }
  | {
      status: "loading";
      currentStep: TStep;
      currentStepIndex: number;
      config: TConfig;
    }
  | {
      totalStepCount: number;
      currentStep: TStep;
      currentStepIndex: number;
      config: TConfig;
      isPlaying: boolean;
      play: () => void;
      pause: () => void;
      forward: () => void;
      backward: () => void;
      reset: () => void;
      start: () => void;
      stop: () => void;
      goto: (index: number) => void;
      canGoForward: boolean;
      canGoBackward: boolean;
      status: "running";
    } {
  const [isLoading, startTransition] = useTransition();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, [setIsPlaying]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, [setIsPlaying]);

  const currentStep = useMemo(() => {
    return algorithmState.steps[currentStepIndex] ?? initialStep;
  }, [algorithmState.steps, currentStepIndex, initialStep]);

  useInterval(
    () => {
      if (currentStepIndex >= algorithmState.steps.length - 1) {
        setIsPlaying(false);
        return;
      }

      setCurrentStepIndex((prevIndex) => prevIndex + 1);
    },
    isPlaying ? 500 : null,
  );

  const forward = useCallback(() => {
    setCurrentStepIndex((prevIndex) =>
      Math.min(prevIndex + 1, algorithmState.steps.length - 1),
    );
  }, [setCurrentStepIndex, algorithmState.steps]);

  const backward = useCallback(() => {
    setCurrentStepIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, [setCurrentStepIndex]);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
  }, [setCurrentStepIndex]);

  const goto = useCallback(
    (index: number) => {
      setCurrentStepIndex(index);
    },
    [setCurrentStepIndex],
  );

  const start = useCallback(() => {
    setIsStarted(true);
    startTransition(() => {
      const steps = getSteps(config, initialStep);
      console.log(steps);
      setSteps(steps);
    });
  }, [algorithmState.steps, getSteps, setSteps, startTransition]);

  const stop = useCallback(() => {
    setIsStarted(false);
    setSteps([initialStep]);
  }, [setIsStarted, setSteps, initialStep]);

  const canGoForward = currentStepIndex < algorithmState.steps.length - 1;

  if (!isStarted) {
    return {
      currentStep: algorithmState.steps[0]!,
      currentStepIndex: 0,
      config,
      start,
      status: "configuring",
    };
  }

  if (isLoading) {
    return {
      status: "loading",
      currentStep: algorithmState.steps[0]!,
      currentStepIndex: 0,
      config,
    };
  }

  return {
    totalStepCount: algorithmState.steps.length,
    currentStep,
    currentStepIndex,
    config,
    isPlaying,
    play,
    pause,
    forward,
    backward,
    reset,
    start,
    stop,
    goto,
    canGoForward,
    canGoBackward: currentStepIndex > 0,
    status: "running",
  };
}

export type UseRunnerReturn<
  TStep extends Step,
  TConfig extends object,
> = ReturnType<typeof useRunner<TStep, TConfig>>;
