import { useMemo, useState } from "react";
import { AlgorithmDefinition } from "@repo/algorithms/lib";
import { useParamsConfigurator } from "./use-params-configurator";
import { useSimulation } from "./use-simulation";
import Renderer from "../../components/custom/visualisations/renderer";

export function useVisualisation<TDefinition extends AlgorithmDefinition>(
  algorithm: TDefinition,
) {
  const { params, ParamsConfigurator } = useParamsConfigurator(
    algorithm.paramConfigurators,
  );
  const simulation = useSimulation(algorithm, params);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const MemoizedRenderer = useMemo(
    () => <Renderer simulation={simulation} renderFn={algorithm.render} />,
    [simulation, algorithm.render],
  );

  const sceneSetup = useMemo(
    () =>
      algorithm.getSceneSetup(
        simulation.runner.currentStep,
        simulation.runner.config,
      ),
    [
      simulation.runner.currentStep,
      simulation.runner.config,
      algorithm.getSceneSetup,
    ],
  );

  return {
    params,
    simulation,
    isDrawerOpen,
    setIsDrawerOpen,
    sceneSetup,
    Renderer: MemoizedRenderer,
    ParamsConfigurator,
  };
}
