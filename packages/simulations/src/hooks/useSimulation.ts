import { useCallback, useState } from "react";
import type { Algorithm, Step } from "../algos/common";
import type { UseAlgorithmReturn } from "./useAlgorithm";
import { useRunner } from "./useRunner";
import { useStepCount } from "./useStepCount";
import type { ThreeEvent } from "@react-three/fiber";

export function useSimulation<
  TAlgorithm extends Algorithm<Step<any, any>, object>,
>({
  algorithm,
  stepFunction,
}: {
  algorithm: UseAlgorithmReturn<TAlgorithm>;
  stepFunction: (algo: TAlgorithm) => TAlgorithm["steps"][number];
}) {
  const interactiveRunner = useRunner({
    algorithm,
    stepFunction,
  });
  const [tooltip, setTooltip] = useState<React.ReactNode | null>(null);

  const totalSteps = useStepCount(algorithm, stepFunction);

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
    totalSteps,
    tooltip,
    tooltipHandlers,
  };
}

export type UseSimulationReturn<TAlgorithm extends Algorithm<any, any>> =
  ReturnType<typeof useSimulation<TAlgorithm>>;
