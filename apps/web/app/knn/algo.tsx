"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { MeshBasicMaterial, SphereGeometry, Vector3 } from "three";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import { UseKNNReturn } from "@repo/simulations/hooks/useKNN";
import { getWhiteMaterial } from "@repo/simulations/utils/materials";
import { TubeGeometry, CatmullRomCurve3 } from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

export default function KNNVisualization({ knn }: { knn: UseKNNReturn }) {
  const sphereGeometry = useMemo(() => new SphereGeometry(0.5, 32, 32), []);

  const { tooltipHandlers } = knn;
  const { currentStep, config } = knn.runner;

  console.log(currentStep.state);

  return (
    <>
      <div className="h-full w-screen">
        <Canvas
          className="h-full w-screen"
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
            minPolarAngle={Math.PI / 3} // 60 degrees from top
            maxPolarAngle={Math.PI / 2} // 90 degrees (horizontal)
          />
          <color attach="background" args={["#050505"]} />
          <fog attach="fog" args={["#070710", 100, 700]} />
          <Grid
            position={[0, -0.01, 0]}
            args={[1000, 1000]} // Increased size
            cellSize={10}
            cellThickness={0.5}
            cellColor="#1a1a1a"
            sectionSize={30}
            sectionThickness={1}
            sectionColor="#2a2a2a"
            fadeDistance={1000} // Increased fade distance
            fadeStrength={1}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <axesHelper args={[1000]} /> // Increased size of axes
          <mesh
            position={
              new Vector3(
                currentStep.state.queryPoint.coords.x,
                currentStep.state.queryPoint.coords.y,
                currentStep.state.queryPoint.coords.z,
              )
            }
            {...tooltipHandlers(
              <div>
                Query Point
                <br />
                Coords: {currentStep.state.queryPoint.coords.x}&nbsp;
                {currentStep.state.queryPoint.coords.y}&nbsp;
                {currentStep.state.queryPoint.coords.z}
                <br />
                <span
                  style={{
                    color: `#${currentStep.state.queryPoint.group.material.color.getHexString()}`,
                  }}
                >
                  {currentStep.state.queryPoint.group.label}
                </span>
              </div>,
            )}
            geometry={sphereGeometry}
            material={
              currentStep.state.queryPoint.group.material ?? getWhiteMaterial()
            }
            scale={10}
          />
          {config.points.map((point, index) => (
            <mesh
              key={index}
              material={point.group.material}
              geometry={sphereGeometry}
              {...tooltipHandlers(
                <div>
                  Point {point.id} <br />
                  Coords: {point.coords.x} {point.coords.y} {point.coords.z}
                  <br />
                  <span
                    style={{
                      color: `#${point.group.material.color.getHexString()}`,
                    }}
                  >
                    {point.group.label}
                  </span>
                </div>,
              )}
              position={
                new Vector3(point.coords.x, point.coords.y, point.coords.z)
              }
              scale={10}
            />
          ))}
          {/* Static lines for established nearest neighbors */}
          {currentStep.state.nearestNeighbors?.map((point, index) => {
            const curve = new CatmullRomCurve3([
              new Vector3(point.coords.x, point.coords.y, point.coords.z),
              new Vector3(
                currentStep.state.queryPoint.coords.x,
                currentStep.state.queryPoint.coords.y,
                currentStep.state.queryPoint.coords.z,
              ),
            ]);
            const geometry = new TubeGeometry(curve, 20, 0.2, 8, false);
            const material = new MeshBasicMaterial({
              color: "white",
              transparent: true,
              opacity: 0.6,
            });
            return <mesh key={index} geometry={geometry} material={material} />;
          })}
          {currentStep.type === "calculateDistance" && (
            <mesh
              geometry={
                new TubeGeometry(
                  new CatmullRomCurve3([
                    new Vector3(
                      currentStep.state.distances.at(-1)!.point.coords.x,
                      currentStep.state.distances.at(-1)!.point.coords.y,
                      currentStep.state.distances.at(-1)!.point.coords.z,
                    ),
                    new Vector3(
                      currentStep.state.queryPoint.coords.x,
                      currentStep.state.queryPoint.coords.y,
                      currentStep.state.queryPoint.coords.z,
                    ),
                  ]),
                  20, // tubular segments
                  0.5, // radius
                  8, // radial segments
                  false, // closed
                )
              }
              material={new MeshBasicMaterial({ color: "pink" })}
            />
          )}
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
