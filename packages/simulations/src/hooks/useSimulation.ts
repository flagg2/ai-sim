import { useCallback, useState, useEffect, useRef } from "react";
import type { Algorithm, Step } from "../algos/common";
import { useAlgorithmState } from "./useAlgorithmState";
import { useRunner } from "./useRunner";
import type { ThreeEvent } from "@react-three/fiber";

export function useSimulation<
  TStep extends Step<any, any>,
  TConfig extends object,
>({
  initial,
  stepFunction,
}: {
  initial: {
    step: TStep;
    config: TConfig;
  };
  stepFunction: (
    algo: Algorithm<TStep, TConfig>,
  ) => Algorithm<TStep, TConfig>["steps"][number];
}) {
  const interactiveRunnerState = useAlgorithmState({
    initialConfig: initial.config,
    initialStep: initial.step,
  });

  const interactiveRunner = useRunner({
    state: interactiveRunnerState as any,
    stepFunction,
  });
  const [tooltip, setTooltip] = useState<React.ReactNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const tooltipTimeoutRef = useRef<Timer | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust this breakpoint as needed
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const tooltipHandlers = useCallback(
    (tooltip: React.ReactNode) => {
      if (isMobile) {
        return {
          onPointerDown: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            if (tooltipTimeoutRef.current) {
              clearTimeout(tooltipTimeoutRef.current);
            }
            setTooltip((prevTooltip) => {
              if (prevTooltip === tooltip) {
                return null;
              } else {
                tooltipTimeoutRef.current = setTimeout(() => {
                  setTooltip(null);
                }, 3000);
                return tooltip;
              }
            });
          },
        };
      } else {
        return {
          onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setTooltip(tooltip);
          },
          onPointerOut: () => setTooltip(null),
        };
      }
    },
    [isMobile],
  );

  return {
    runner: interactiveRunner,
    tooltip,
    tooltipHandlers,
  };
}

export type UseSimulationReturn<
  TStep extends Step<any, any>,
  TConfig extends object,
> = ReturnType<typeof useSimulation<TStep, TConfig>>;
