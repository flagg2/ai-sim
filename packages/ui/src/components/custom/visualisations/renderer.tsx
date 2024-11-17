import { RenderFunction } from "@repo/algorithms/lib";
import { useMemo } from "react";
import { UseSimulationReturn } from "../../../lib/hooks/use-simulation";

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
      {renderables.map((renderable) => {
        const primitiveType = renderable.getPrimitiveType?.() ?? "mesh";
        const Component = primitiveType === "points" ? "points" : "mesh";

        const props = renderable.getRenderProps();

        if (Array.isArray(props)) {
          return props.map((prop) => (
            <Component
              key={renderable.getKey()}
              {...prop}
              {...simulation.tooltipHandlers(renderable.getTooltip())}
            />
          ));
        }

        return (
          <Component
            key={renderable.getKey()}
            {...props}
            {...simulation.tooltipHandlers(renderable.getTooltip())}
          />
        );
      })}
    </>
  );
}
