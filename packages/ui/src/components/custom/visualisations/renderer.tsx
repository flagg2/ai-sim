import { RenderFunction } from "@repo/algorithms/lib";
import { useMemo } from "react";
import { UseSimulationReturn } from "../../../lib/hooks/use-simulation";
import { useTheme } from "next-themes";

type Props = {
  simulation: UseSimulationReturn;
  renderFn: RenderFunction;
};

import type { Material } from "three";

export function getMaterial(
  material: Material | { dark: Material; light: Material },
  theme: string = "dark",
) {
  return "dark" in material
    ? material[theme === "dark" ? "dark" : "light"]
    : material;
}

export default function Renderer({ simulation, renderFn }: Props) {
  const renderables = useMemo(
    () =>
      renderFn(simulation.runner.currentStep.state, simulation.runner.config),
    [simulation.runner.currentStep.state, simulation.runner.config],
  );
  const { theme } = useTheme();
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
              material={getMaterial(prop.material, theme)}
              {...simulation.tooltipHandlers(renderable.getTooltip())}
            />
          ));
        }

        return (
          <Component
            key={renderable.getKey()}
            {...props}
            material={getMaterial(props.material, theme)}
            {...simulation.tooltipHandlers(renderable.getTooltip())}
          />
        );
      })}
    </>
  );
}
