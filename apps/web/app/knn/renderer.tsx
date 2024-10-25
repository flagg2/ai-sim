import { ParamConfigurator } from "@repo/simulations/algos/paramConfigurators/param";
import { RenderFunction, Step } from "@repo/simulations/algos/types";
import { UseSimulationReturn } from "@repo/simulations/hooks/useSimulation";
import { useMemo } from "react";

type Props<
  TStep extends Step<any, any>,
  TConfig extends object,
  TParamConfigurators extends Record<string, ParamConfigurator<any>>,
> = {
  simulation: UseSimulationReturn<TStep, TConfig, TParamConfigurators>;
  renderFn: RenderFunction<TStep, TConfig>;
};

export default function Renderer<
  TStep extends Step<any, any>,
  TConfig extends object,
  TParamConfigurators extends Record<string, ParamConfigurator<any>>,
>({ simulation, renderFn }: Props<TStep, TConfig, TParamConfigurators>) {
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
