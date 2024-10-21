"use client";

import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { PerspectiveCamera, OrbitControls, Grid } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

export default function Scene({ children }: { children: React.ReactNode }) {
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
          <PerspectiveCamera
            makeDefault
            position={[250, 250, 250]}
            fov={60}
            near={0.1}
            far={2000}
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={100}
            maxDistance={400}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
          />
          <color attach="background" args={["#050505"]} />
          <fog attach="fog" args={["#070710", 100, 700]} />
          <Grid
            position={[0, -0.01, 0]}
            args={[1000, 1000]}
            cellSize={10}
            cellThickness={0.5}
            cellColor="#1a1a1a"
            sectionSize={30}
            sectionThickness={1}
            sectionColor="#2a2a2a"
            fadeDistance={1000}
            fadeStrength={1}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          {children}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              intensity={0.5}
              levels={9}
              mipmapBlur
            />
          </EffectComposer>
        </Canvas>
      </div>
    </>
  );
}
