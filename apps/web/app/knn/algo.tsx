"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { SphereGeometry, Vector3, BufferGeometry } from "three";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { UseKNNReturn } from "@repo/simulations/hooks/useKNN";
import {
  getPinkMaterial,
  getWhiteMaterial,
} from "@repo/simulations/utils/materials";
import { KNNState } from "@repo/simulations/algos/knn";

// Custom findLast implementation
function findLast<T>(
  array: T[],
  predicate: (value: T) => boolean,
): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i]!)) {
      return array[i];
    }
  }
  return undefined;
}

// TODO: does not yet work quite correct but is close

export default function KNNVisualization({ state }: { state: KNNState }) {
  const sphereGeometry = useMemo(() => new SphereGeometry(0.5, 32, 32), []);

  const lastCalculateDistanceStep = findLast(
    state.steps,
    (step) => step.type === "calculateDistance",
  );

  const lastUpdateNearestNeighborsStep = findLast(
    state.steps,
    (step) => step.type === "updateNearestNeighbors",
  );

  return (
    <>
      <div className="h-screen w-screen">
        <Canvas
          className="h-screen w-screen"
          flat
          dpr={[1, 1.5]}
          gl={{ antialias: false }}
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
            maxDistance={1000}
            minPolarAngle={Math.PI / 3} // 60 degrees from top
            maxPolarAngle={Math.PI / 2} // 90 degrees (horizontal)
          />
          <color attach="background" args={["#000"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <axesHelper scale={200} />
          <mesh
            position={
              new Vector3(
                state.config.queryPoint.coords.x,
                state.config.queryPoint.coords.y,
                state.config.queryPoint.coords.z,
              )
            }
            geometry={sphereGeometry}
            material={getWhiteMaterial()}
            scale={10}
          />
          {state.config.points.map((point, index) => (
            <mesh
              key={index}
              material={point.group.material}
              geometry={sphereGeometry}
              position={
                new Vector3(point.coords.x, point.coords.y, point.coords.z)
              }
              scale={10}
            />
          ))}
          {lastUpdateNearestNeighborsStep?.nearestNeighbors?.map(
            (point, index) => (
              <lineSegments
                key={index}
                geometry={new BufferGeometry().setFromPoints([
                  new Vector3(point.coords.x, point.coords.y, point.coords.z),
                  new Vector3(
                    state.config.queryPoint.coords.x,
                    state.config.queryPoint.coords.y,
                    state.config.queryPoint.coords.z,
                  ),
                ])}
              />
            ),
          )}
          {lastCalculateDistanceStep?.distances?.at(-1) && (
            <lineSegments
              material={getPinkMaterial()}
              geometry={new BufferGeometry().setFromPoints([
                new Vector3(
                  lastCalculateDistanceStep.distances.at(-1)!.point.coords.x,
                  lastCalculateDistanceStep.distances.at(-1)!.point.coords.y,
                  lastCalculateDistanceStep.distances.at(-1)!.point.coords.z,
                ),
                new Vector3(
                  state.config.queryPoint.coords.x,
                  state.config.queryPoint.coords.y,
                  state.config.queryPoint.coords.z,
                ),
              ])}
            />
          )}
        </Canvas>
      </div>
    </>
  );
}
