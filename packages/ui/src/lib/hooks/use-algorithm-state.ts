import { useEffect, useState } from "react";
import { Step } from "@repo/simulations/lib/types";

export function useAlgorithmState<TStep extends Step, TConfig>({
  initialConfig,
  initialStep,
}: {
  initialConfig: TConfig;
  initialStep: TStep;
}) {
  const [steps, setSteps] = useState<TStep[]>([initialStep]);
  const [config, setConfig] = useState<TConfig>(initialConfig);
  const [algorithmState, setAlgorithm] = useState<{
    steps: TStep[];
    config: TConfig;
  }>(
    () =>
      ({
        steps,
        config,
      }) as { steps: TStep[]; config: TConfig },
  );

  useEffect(() => {
    setAlgorithm((prev) => ({
      ...prev,
      steps,
      config,
    }));
  }, [steps, config]);

  useEffect(() => {
    setSteps([initialStep]);
    setConfig(initialConfig);
  }, [initialStep, initialConfig]);

  return {
    config,
    steps,
    algorithmState,
    initialStep,
    setConfig,
    setSteps,
  };
}

export type UseAlgorithmReturn<
  TStep extends Step,
  TConfig extends object,
> = ReturnType<typeof useAlgorithmState<TStep, TConfig>>;
