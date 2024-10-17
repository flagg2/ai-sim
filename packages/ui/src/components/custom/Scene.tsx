"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { SceneSetup } from "./SceneSetup";

export default function Scene({
  children,
  is3D = true,
}: {
  children: React.ReactNode;
  is3D?: boolean;
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
          <SceneSetup is3D={is3D}>{children}</SceneSetup>
        </Canvas>
      </div>
    </>
  );
}
