"use client";

import { useState, useMemo } from "react";
import { AlgorithmDefinition } from "@repo/algorithms/lib";
import Scene from "./scene";
import Renderer from "./renderer";
import { useParamConfigurator } from "./use-params-configurator";
import { Drawer, DrawerContent } from "../../shadcn/drawer";
import { SimpleControls } from "./controls/simple";
import { DetailedControls } from "./controls/detailed";
import { useSimulation } from "../../../lib/hooks/use-simulation";

type VisualisationUIProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  algorithm: AlgorithmDefinition<any, any, any>;
};

export function VisualisationUI({ ...props }: VisualisationUIProps) {
  const { algorithm } = props;
  const { params, Configurator } = useParamConfigurator(
    algorithm.paramConfigurators,
  );
  const simulation = useSimulation(algorithm, params);

  const [isOpen, setIsOpen] = useState(false);

  const memoizedRenderer = useMemo(
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

  console.log({ params });

  return (
    <div className="flex flex-col w-full  h-[calc(100vh-68px)]">
      {/* Mobile layout */}
      <div className="xl:hidden flex-1 relative">
        <div className="w-full h-full flex items-center justify-center">
          <Scene sceneSetup={sceneSetup}>{memoizedRenderer}</Scene>
        </div>
        {simulation.tooltip && (
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg border p-4 max-w-[300px] z-10">
            {simulation.tooltip}
          </div>
        )}
        <Drawer onOpenChange={setIsOpen}>
          <SimpleControls simulation={simulation} isDrawerOpen={isOpen} />

          <DrawerContent className="h-full max-h-[80vh]">
            <div className="p-4 flex flex-col h-full">
              <DetailedControls
                simulation={simulation}
                configComponent={Configurator}
                algorithmDescription={algorithm.meta.description}
                showConfig={Object.keys(params).length > 0}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop layout */}
      <div className="hidden xl:flex flex-col w-full h-[65vh] xl:h-[calc(100vh-68px)]">
        <main className="flex-1 grid grid-cols-[1fr_600px] gap-6 p-6 md:p-10">
          <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
            <div className="w-full h-full flex items-center justify-center">
              <Scene sceneSetup={sceneSetup}>{memoizedRenderer}</Scene>
            </div>
            {simulation.tooltip && (
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg border p-4 max-w-[300px]">
                {simulation.tooltip}
              </div>
            )}
          </div>
          <div className="bg-background rounded-lg border p-6 flex flex-col gap-6">
            <DetailedControls
              simulation={simulation}
              configComponent={Configurator}
              algorithmDescription={algorithm.meta.description}
              showConfig={Object.keys(params).length > 0}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export function VisualisationUISkeleton() {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-68px)]">
      {/* Mobile layout */}
      <div className="xl:hidden flex-1 relative">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden xl:flex flex-col w-full h-[65vh] xl:h-[calc(100vh-68px)]">
        <main className="flex-1 grid grid-cols-[1fr_600px] gap-6 p-6 md:p-10">
          <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
            <div className="w-full h-full bg-muted/50 animate-pulse" />
          </div>
          <div className="bg-background rounded-lg border p-6 flex flex-col gap-6">
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              <div className="h-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
