import { useCallback, useMemo, useState, useTransition } from "react";
import { useInterval } from "usehooks-ts";
import { useDebounce } from "./use-debounce";
import { useIsTouchDevice } from "./use-is-touch-device";
import type { UseAlgorithmReturn } from "./use-algorithm-state";
import { AlgorithmDefinition, Step } from "@repo/algorithms/lib";

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
      sliderStepIndex: number;
      config: TConfig;
      start: () => void;
      status: "configuring";
    }
  | {
      status: "loading";
      currentStep: TStep;
      currentStepIndex: number;
      sliderStepIndex: number;
      config: TConfig;
    }
  | {
      totalStepCount: number;
      currentStep: TStep;
      currentStepIndex: number;
      sliderStepIndex: number;
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
      gotoWithSlider: (index: number) => void;
      canGoForward: boolean;
      canGoBackward: boolean;
      status: "running";
    } {
  const [isLoading, startTransition] = useTransition();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [sliderStepIndex, setSliderStepIndex] = useState(0);
  const { isTouchDevice } = useIsTouchDevice();

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
      setSliderStepIndex((prevIndex) => prevIndex + 1);
    },
    isPlaying ? 500 : null,
  );

  const forward = useCallback(() => {
    setCurrentStepIndex((prevIndex) =>
      Math.min(prevIndex + 1, algorithmState.steps.length - 1),
    );
    setSliderStepIndex((prevIndex) =>
      Math.min(prevIndex + 1, algorithmState.steps.length - 1),
    );
  }, [setCurrentStepIndex, setSliderStepIndex, algorithmState.steps]);

  const backward = useCallback(() => {
    setCurrentStepIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setSliderStepIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, [setCurrentStepIndex, setSliderStepIndex]);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setSliderStepIndex(0);
  }, [setCurrentStepIndex, setSliderStepIndex]);

  const debouncedGoto = useDebounce(
    (index: number) => {
      if (isStarted && !isLoading) {
        setCurrentStepIndex(index);
      }
    },
    isTouchDevice ? 300 : 0,
  );

  const gotoWithSlider = useCallback(
    (index: number) => {
      setSliderStepIndex(index);
      debouncedGoto(index);
    },
    [debouncedGoto],
  );

  const start = useCallback(() => {
    setIsStarted(true);
    startTransition(() => {
      void getSteps(config, initialStep).then((steps) => {
        console.log(steps);
        setSteps(steps);
      });
    });
  }, [config, initialStep, getSteps, setSteps]);

  const stop = useCallback(() => {
    setIsStarted(false);
    setSteps([initialStep]);
  }, [setIsStarted, setSteps, initialStep]);

  const canGoForward = currentStepIndex < algorithmState.steps.length - 1;

  if (!isStarted) {
    return {
      currentStep: algorithmState.steps[0]!,
      currentStepIndex: 0,
      sliderStepIndex: 0,
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
      sliderStepIndex: 0,
      config,
    };
  }

  return {
    totalStepCount: algorithmState.steps.length,
    currentStep,
    currentStepIndex,
    sliderStepIndex,
    config,
    isPlaying,
    play,
    pause,
    forward,
    backward,
    reset,
    start,
    stop,
    goto: debouncedGoto,
    gotoWithSlider,
    canGoForward,
    canGoBackward: currentStepIndex > 0,
    status: "running",
  };
}

export type UseRunnerReturn<
  TStep extends Step,
  TConfig extends object,
> = ReturnType<typeof useRunner<TStep, TConfig>>;
