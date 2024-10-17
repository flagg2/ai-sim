"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { PerspectiveCamera, OrbitControls, Grid } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";

export default function Scene({
  children,
  is2D = true,
}: {
  children: React.ReactNode;
  is2D?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const threeDimensionalSetup = useMemo(() => {
    return (
      <>
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
        <axesHelper args={[1000]} />
        {children}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            intensity={0.5}
            levels={9}
            mipmapBlur
          />
        </EffectComposer>
      </>
    );
  }, [children]);

  const twoDimensionalSetup = useMemo(() => {
    return (
      <>
        <OrthographicCamera
          makeDefault
          position={[0, 1000, 0]}
          zoom={1}
          near={0.1}
          far={2000}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={false}
          minZoom={0.5}
          maxZoom={2}
          panSpeed={0.5}
          mouseButtons={{
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }}
        />
        <color attach="background" args={["#050505"]} />
        {/* Custom grid setup */}
        <group>
          {/* Larger, more visible grid */}
          <gridHelper args={[1000, 20, "#0f0f0f", "#0f0f0f"]} />
          {/* Thicker lines for larger areas */}
          <gridHelper args={[1000, 4, "#1a1a1a", "#1a1a1a"]} />
        </group>
        <ambientLight intensity={1} />
        {children}
      </>
    );
  }, [children]);

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
          {is2D ? twoDimensionalSetup : threeDimensionalSetup}
        </Canvas>
      </div>
    </>
  );
}
