"use client";

import { Canvas } from "@react-three/fiber";
import { UseKMeansReturn } from "@repo/simulations/hooks/useKMeans";
import KMeansVisualizationContent from "./content";
import { useRef } from "react";

export default function KMeansVisualization({
  kmeans,
}: {
  kmeans: UseKMeansReturn;
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
          gl={{ antialias: false }}
        >
          <KMeansVisualizationContent kmeans={kmeans} />
        </Canvas>
      </div>
    </>
  );
}
