"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { SceneSetup } from "./SceneSetup";
import { UseSimulationReturn } from "@repo/simulations/hooks/useSimulation";

export default function Scene({
  children,
  simulation,
}: {
  children: React.ReactNode;
  simulation: UseSimulationReturn<any, any>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <div className="h-full w-screen">
        <Canvas
          ref={canvasRef}
          className="h-full w-screen p-0 m-0"
          flat
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
        >
          <SceneSetup simulation={simulation}>{children}</SceneSetup>
        </Canvas>
      </div>
    </>
  );
}
