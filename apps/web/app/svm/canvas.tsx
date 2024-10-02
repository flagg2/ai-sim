// TODO: make this generic (maybe even with controls)

"use client";

import { Canvas } from "@react-three/fiber";
import { UseSVMReturn } from "@repo/simulations/hooks/useSVM";
import SVMVisualizationContent from "./content";
import { useRef } from "react";

export default function SVMVisualization({ svm }: { svm: UseSVMReturn }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <>
      <div className="h-full w-screen">
        <Canvas
          ref={canvasRef}
          className="h-full w-screen p-0 m-0"
          flat
          dpr={[1, 1.5]}
          gl={{ antialias: false }}
        >
          <SVMVisualizationContent svm={svm} />
        </Canvas>
      </div>
    </>
  );
}
