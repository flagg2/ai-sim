import { useCallback, useState } from "react";
import type { Algorithm, Step } from "../algos/common";
import { useAlgorithmState } from "./useAlgorithmState";
import { useRunner } from "./useRunner";
import type { ThreeEvent } from "@react-three/fiber";

export function useSimulation<
  TStep extends Step<any, any>,
  TConfig extends object,
>({
  initial,
  stepFunction,
}: {
  initial: {
    step: TStep;
    config: TConfig;
  };
  stepFunction: (
    algo: Algorithm<TStep, TConfig>,
  ) => Algorithm<TStep, TConfig>["steps"][number];
}) {
  const interactiveRunnerState = useAlgorithmState({
    initialConfig: initial.config,
    initialStep: initial.step,
  });

  const interactiveRunner = useRunner({
    state: interactiveRunnerState as any,
    stepFunction,
  });
  const [tooltip, setTooltip] = useState<React.ReactNode | null>(null);

  const tooltipHandlers = useCallback((tooltip: React.ReactNode) => {
    return {
      onPointerOver: (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setTooltip(tooltip);
      },
      onPointerOut: () => setTooltip(null),
    };
  }, []);

  return {
    runner: interactiveRunner,
    tooltip,
    tooltipHandlers,
  };
}

export type UseSimulationReturn<
  TStep extends Step<any, any>,
  TConfig extends object,
> = ReturnType<typeof useSimulation<TStep, TConfig>>;
