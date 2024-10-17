import { Step } from "@repo/simulations/algos/common";
import { Renderable } from "@repo/simulations/algos/objects/renderable";
import { UseSimulationReturn } from "@repo/simulations/hooks/useSimulation";
import { useMemo } from "react";

type Props<TStep extends Step<any, any>, TConfig extends object> = {
  simulation: UseSimulationReturn<TStep, TConfig>;
  renderFn: (state: TStep["state"], config: TConfig) => Renderable[];
};

export default function Renderer<
  TStep extends Step<any, any>,
  TConfig extends object,
>({ simulation, renderFn }: Props<TStep, TConfig>) {
  const renderables = useMemo(
    () =>
      renderFn(
        simulation.runner.currentStep.state,
        simulation.runner.config as TConfig,
      ),
    [simulation.runner.currentStep.state, simulation.runner.config, renderFn],
  );

  return (
    <>
      {renderables.map((renderable) => (
        <mesh
          key={renderable.getKey()}
          {...renderable.getRenderProps()}
          {...simulation.tooltipHandlers(renderable.getTooltip())}
        />
      ))}
    </>
  );
}
