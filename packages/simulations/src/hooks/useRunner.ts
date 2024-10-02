import { useCallback, useState, useTransition } from "react";
import type { Algorithm, Step } from "../algos/common";
import { useInterval } from "usehooks-ts";
import type { UseAlgorithmReturn } from "./useAlgorithmState";

const MAX_STEPS = 10000;

export function useRunner<
  TAlgorithm extends Algorithm<Step<any, any>, object>,
>({
  state: { config, algorithmState, setSteps, initialStep },
  stepFunction,
}: {
  state: UseAlgorithmReturn<TAlgorithm>;
  stepFunction: (algo: TAlgorithm) => TAlgorithm["steps"][number];
}):
  | {
      currentStep: TAlgorithm["steps"][number];
      currentStepIndex: number;
      config: TAlgorithm["config"];
      start: () => void;
      status: "configuring";
    }
  | {
      status: "loading";
      currentStep: TAlgorithm["steps"][number];
      currentStepIndex: number;
      config: TAlgorithm["config"];
    }
  | {
      totalStepCount: number;
      currentStep: TAlgorithm["steps"][number];
      currentStepIndex: number;
      config: TAlgorithm["config"];
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
    const steps: TAlgorithm["steps"] = algorithmState.steps;
    let currentState = algorithmState;
    startTransition(() => {
      for (let i = 0; i < MAX_STEPS; i++) {
        const step = stepFunction(currentState);
        steps.push(step);
        if (step.nextStep === null) break;
        currentState = { ...currentState, ...step.nextStep };
      }
      setSteps(steps);
    });
  }, [algorithmState.steps, stepFunction, setSteps, startTransition]);

  const stop = useCallback(() => {
    setIsStarted(false);
    setSteps([initialStep]);
  }, [setIsStarted, setSteps, initialStep]);

  const currentStep = algorithmState.steps[currentStepIndex];
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
    currentStep: currentStep as TAlgorithm["steps"][number],
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

export type UseRunnerReturn<TAlgorithm extends Algorithm<any, any>> =
  ReturnType<typeof useRunner<TAlgorithm>>;
