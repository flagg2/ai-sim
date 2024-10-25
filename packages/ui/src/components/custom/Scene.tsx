"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { SceneSetupComponent } from "./SceneSetup";
import { SceneSetup } from "@repo/simulations/algos/types";

export default function Scene({
  children,
  sceneSetup,
}: {
  children: React.ReactNode;
  sceneSetup: SceneSetup;
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
          <SceneSetupComponent sceneSetup={sceneSetup}>
            {children}
          </SceneSetupComponent>
        </Canvas>
      </div>
    </>
  );
}
