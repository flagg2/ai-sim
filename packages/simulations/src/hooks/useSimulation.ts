import { useAlgorithmState } from "./useAlgorithmState";
import { useRunner } from "./useRunner";
import { useTooltip } from "./useTooltip";
import type { AlgorithmDefinition, Params } from "../algos/common/types";
import { useMemo } from "react";

export function useSimulation<TDefinition extends AlgorithmDefinition>(
  definition: TDefinition,
  params: Params,
) {
  const config = useMemo(
    () => definition.getConfig(params),
    [definition, params],
  );

  const initialStep = useMemo(
    () => definition.getInitialStep(config),
    [definition, config],
  );

  const interactiveRunnerState = useAlgorithmState({
    initialConfig: config,
    initialStep,
  });

  const interactiveRunner = useRunner({
    state: interactiveRunnerState as any,
    getSteps: definition.getSteps,
  });

  const { tooltip, tooltipHandlers } = useTooltip();

  return {
    runner: interactiveRunner,
    tooltip,
    tooltipHandlers,
  };
}

export type UseSimulationReturn<
  TDefinition extends AlgorithmDefinition = AlgorithmDefinition,
> = ReturnType<typeof useSimulation<TDefinition>>;
