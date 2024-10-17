import { useAlgorithmState } from "./useAlgorithmState";
import { useRunner } from "./useRunner";
import { useTooltip } from "./useTooltip";
import type { Step } from "../algos/common";

export function useSimulation<
  TStep extends Step<any, any>,
  TConfig extends object,
>({
  initial,
  simulateSteps,
}: {
  initial: {
    step: TStep;
    config: TConfig;
  };
  simulateSteps: (config: TConfig, initialStep: TStep) => TStep[];
}) {
  const interactiveRunnerState = useAlgorithmState({
    initialConfig: initial.config,
    initialStep: initial.step,
  });

  const interactiveRunner = useRunner({
    state: interactiveRunnerState as any,
    simulateSteps: simulateSteps as any,
  });

  const { tooltip, tooltipHandlers } = useTooltip();

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
