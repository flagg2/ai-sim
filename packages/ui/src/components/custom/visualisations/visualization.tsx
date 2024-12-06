"use client";

import { AlgorithmDefinition } from "@repo/algorithms/lib";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "../../shadcn/drawer";
import { SimpleControls } from "./controls/simple";
import { BaseControls } from "./controls/base";
import { useVisualisation } from "../../../lib/hooks/use-visualisation";
import Scene from "./scene/scene";

export type VisualisationProps = {
  algorithm: AlgorithmDefinition<any, any, any>;
};

export function Visualization({ algorithm }: VisualisationProps) {
  const {
    params,
    simulation,
    sceneSetup,
    isDrawerOpen,
    setIsDrawerOpen,
    Renderer,
    ParamsConfigurator,
  } = useVisualisation(algorithm);

  return (
    <div className="flex flex-col w-full  h-[calc(100vh-68px)]">
      {/* mobile layout */}
      <div className="xl:hidden flex-1 relative">
        <div className="w-full h-full flex items-center justify-center">
          <Scene sceneSetup={sceneSetup}>{Renderer}</Scene>
        </div>
        {simulation.tooltip && (
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg border p-4 max-w-[300px] z-10">
            {simulation.tooltip}
          </div>
        )}
        <Drawer onOpenChange={setIsDrawerOpen} open={isDrawerOpen}>
          <SimpleControls
            simulation={simulation}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />

          <DrawerContent className="h-full max-h-[80vh]">
            <DrawerTitle hidden>Configuration</DrawerTitle>
            <DrawerDescription hidden>
              Configure the algorithm parameters and start the simulation.
            </DrawerDescription>
            <div className="p-4 flex flex-col h-full">
              <BaseControls
                title={algorithm.meta.title}
                simulation={simulation}
                configComponent={ParamsConfigurator}
                algorithmDescription={algorithm.meta.description}
                showConfig={Object.keys(params).length > 0}
                setIsDrawerOpen={setIsDrawerOpen}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* desktop layout */}
      <div className="hidden xl:flex flex-col w-full h-[65vh] xl:h-[calc(100vh-68px)]">
        <main className="flex-1 grid grid-cols-[1fr_600px] gap-6 p-6 md:p-10">
          <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center relative">
            <div className="w-full h-full flex items-center justify-center">
              <Scene sceneSetup={sceneSetup}>{Renderer}</Scene>
            </div>
            {simulation.tooltip && (
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg border p-4 max-w-[300px]">
                {simulation.tooltip}
              </div>
            )}
          </div>
          <div className="bg-background rounded-lg border p-6 flex flex-col gap-6">
            <BaseControls
              title={algorithm.meta.title}
              simulation={simulation}
              configComponent={ParamsConfigurator}
              algorithmDescription={algorithm.meta.description}
              showConfig={Object.keys(params).length > 0}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export function VisualizationSkeleton() {
  return (
    <div className="flex flex-col w-full h-[calc(100vh-68px)]">
      {/* mobile layout */}
      <div className="xl:hidden flex-1 relative">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-full bg-muted animate-pulse rounded-lg" />
        </div>
      </div>

      {/* desktop layout */}
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
