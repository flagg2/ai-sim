import { useEffect, useState } from "react";
import type { Algorithm } from "../algos/common";

export function useAlgorithm<TAlgorithm extends Algorithm<any, any>>({
  initialConfig,
}: {
  initialConfig: TAlgorithm["config"];
}) {
  const [steps, setSteps] = useState<TAlgorithm["steps"]>([]);
  const [config, setConfig] = useState<TAlgorithm["config"]>(initialConfig);
  const [algorithm, setAlgorithm] = useState<TAlgorithm>(
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

  return {
    config,
    steps,
    algorithm,
    setConfig,
    setSteps,
  };
}

export type UseAlgorithmReturn<TAlgorithm extends Algorithm<any, any>> =
  ReturnType<typeof useAlgorithm<TAlgorithm>>;
