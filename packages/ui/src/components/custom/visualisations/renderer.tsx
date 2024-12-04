import { RenderFunction } from "@repo/algorithms/lib";
import { useMemo } from "react";
import { UseSimulationReturn } from "../../../lib/hooks/use-simulation";

type Props = {
  simulation: UseSimulationReturn;
  renderFn: RenderFunction;
};

import type { Material } from "three";
import useTheme from "../../../lib/hooks/use-theme";

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
    () => renderFn(simulation.runner.currentStep, simulation.runner.config),
    [simulation.runner.currentStep.state, simulation.runner.config],
  );
  const { theme } = useTheme();

  const materialCache = useMemo(() => new Map(), [theme]);

  const getCachedMaterial = (
    material: Material | { dark: Material; light: Material },
  ) => {
    const cacheKey = JSON.stringify(material);
    if (!materialCache.has(cacheKey)) {
      materialCache.set(cacheKey, getMaterial(material, theme));
    }
    return materialCache.get(cacheKey);
  };

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
              material={getCachedMaterial(prop.material)}
              {...simulation.tooltipHandlers(renderable.getTooltip())}
            />
          ));
        }

        return (
          <Component
            key={renderable.getKey()}
            {...props}
            material={getCachedMaterial(props.material)}
            {...simulation.tooltipHandlers(renderable.getTooltip())}
          />
        );
      })}
    </>
  );
}
