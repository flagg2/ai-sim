import { useAlgorithmState } from "./use-algorithm-state";
import { useRunner } from "./use-runner";
import { useMemo } from "react";
import { useTooltip } from "./use-tooltip";
import { AlgorithmDefinition, Params } from "@repo/simulations/lib/types";

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
    state: interactiveRunnerState,
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
