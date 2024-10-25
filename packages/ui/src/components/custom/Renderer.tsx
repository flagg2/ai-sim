import { RenderFunction } from "@repo/simulations/algos/types";
import { UseSimulationReturn } from "@repo/simulations/hooks/useSimulation";
import { useMemo } from "react";

type Props = {
  simulation: UseSimulationReturn;
  renderFn: RenderFunction;
};

export default function Renderer({ simulation, renderFn }: Props) {
  const renderables = useMemo(
    () =>
      renderFn(simulation.runner.currentStep.state, simulation.runner.config),
    [simulation.runner.currentStep.state, simulation.runner.config],
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
