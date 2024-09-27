import { useEffect, useState } from "react";
import type { Algorithm, Step } from "../algos/common";

export function useAlgorithmState<
  TAlgorithm extends Algorithm<Step<any, any>, object>,
>({
  initialConfig,
  initialStep,
}: {
  initialConfig: TAlgorithm["config"];
  initialStep: TAlgorithm["steps"][number];
}) {
  const [steps, setSteps] = useState<TAlgorithm["steps"]>([initialStep]);
  const [config, setConfig] = useState<TAlgorithm["config"]>(initialConfig);
  const [algorithmState, setAlgorithm] = useState<TAlgorithm>(
    () =>
      ({
        steps,
        config,
      }) as TAlgorithm,
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

export type UseAlgorithmReturn<TAlgorithm extends Algorithm<any, any>> =
  ReturnType<typeof useAlgorithmState<TAlgorithm>>;
