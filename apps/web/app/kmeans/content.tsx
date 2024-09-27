"use client";

import { useMemo } from "react";
import { SphereGeometry, Vector3 } from "three";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { TubeGeometry, CatmullRomCurve3, MeshBasicMaterial } from "three";
import { UseKMeansReturn } from "@repo/simulations/hooks/useKMeans";
import { getWhiteMaterial } from "@repo/simulations/utils/materials";

export default function KMeansVisualizationContent({
  kmeans,
}: {
  kmeans: UseKMeansReturn;
}) {
  console.log(kmeans);
  const sphereGeometry = useMemo(() => new SphereGeometry(0.5, 32, 32), []);

  const { lastStep, steps, tooltipHandlers } = kmeans;

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
        maxDistance={1000}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
      />
      <color attach="background" args={["#000"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <axesHelper scale={200} />

      {/* Render points */}
      {lastStep.state.points.map((point, index) => (
        <mesh
          key={index}
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
          material={
            steps.length <= 2 ? getWhiteMaterial() : point.group.material
          }
          geometry={sphereGeometry}
          position={new Vector3(point.coords.x, point.coords.y, point.coords.z)}
          scale={5}
        />
      ))}

      {/* Render centroids */}
      {lastStep.state.centroids.map((centroid, index) => (
        <mesh
          key={`centroid-${index}`}
          {...tooltipHandlers(
            <div>
              Centroid {centroid.id} <br />
              Coords:{centroid.coords.x} {centroid.coords.y} {centroid.coords.z}
              <br />
              <span
                style={{
                  color: `#${centroid.group.material.color.getHexString()}`,
                }}
              >
                {centroid.group.label}
              </span>
            </div>,
          )}
          material={centroid.group.material}
          geometry={sphereGeometry}
          position={
            new Vector3(centroid.coords.x, centroid.coords.y, centroid.coords.z)
          }
          scale={10}
        />
      ))}

      {/* Render lines between centroids and their cluster points */}
      {steps.length > 2 &&
        lastStep.state.centroids.map((centroid, centroidIndex) =>
          lastStep.state.points
            .filter((point) => point.group.label === centroid.group.label)
            .map((point, pointIndex) => {
              const curve = new CatmullRomCurve3([
                new Vector3(
                  centroid.coords.x,
                  centroid.coords.y,
                  centroid.coords.z,
                ),
                new Vector3(point.coords.x, point.coords.y, point.coords.z),
              ]);
              const geometry = new TubeGeometry(curve, 20, 0.5, 8, false);
              const material = new MeshBasicMaterial({
                color: centroid.group.material.color,
              });
              return (
                <mesh
                  key={`line-${centroidIndex}-${pointIndex}`}
                  geometry={geometry}
                  material={material}
                  {...tooltipHandlers(
                    <div>
                      Line from centroid {centroid.id} to point {point.id}
                      <br />
                      Distance: {Math.round(curve.getLength() * 100) / 100}
                    </div>,
                  )}
                />
              );
            }),
        )}
    </>
  );
}