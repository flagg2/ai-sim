"use client";

import { useMemo } from "react";
import {
  SphereGeometry,
  Vector3,
  PlaneGeometry,
  DoubleSide,
  Euler,
} from "three";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { MeshBasicMaterial } from "three";
import { UseSVMReturn } from "@repo/simulations/hooks/useSvm";

export default function SVMVisualizationContent({
  svm,
}: {
  svm: UseSVMReturn;
}) {
  const sphereGeometry = useMemo(() => new SphereGeometry(0.5, 32, 32), []);
  const planeGeometry = useMemo(() => new PlaneGeometry(200, 200), []);

  const { tooltipHandlers } = svm;
  const { currentStep } = svm.runner;

  const hyperplaneMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        side: DoubleSide,
      }),
    [],
  );

  // Calculate the rotation of the hyperplane
  const hyperplaneRotation = useMemo(() => {
    console.log({ hyperplane: currentStep.state.hyperplane });
    const { weights } = currentStep.state.hyperplane;
    const normalVector = new Vector3(weights.x, weights.y, weights.z);
    return normalVector.applyAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
  }, [currentStep.state.hyperplane]);

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

      {/* Render training points */}
      {svm.runner.config.trainingPoints.map((point, index) => (
        <mesh
          key={index}
          {...tooltipHandlers(
            <div>
              Training Point {point.id} <br />
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
          material={point.group.material}
          geometry={sphereGeometry}
          position={new Vector3(point.coords.x, point.coords.y, point.coords.z)}
          scale={5}
        />
      ))}

      {/* Render query point */}
      <mesh
        {...tooltipHandlers(
          <div>
            Query Point <br />
            Coords: {currentStep.state.queryPoint.coords.x}{" "}
            {currentStep.state.queryPoint.coords.y}{" "}
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
        material={currentStep.state.queryPoint.group.material}
        geometry={sphereGeometry}
        position={
          new Vector3(
            currentStep.state.queryPoint.coords.x,
            currentStep.state.queryPoint.coords.y,
            currentStep.state.queryPoint.coords.z,
          )
        }
        scale={10}
      />

      {/* Render support vectors */}
      {currentStep.state.supportVectors.map((point, index) => (
        <mesh
          key={`sv-${index}`}
          {...tooltipHandlers(
            <div>
              Support Vector {point.id} <br />
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
          material={point.group.material}
          geometry={sphereGeometry}
          position={new Vector3(point.coords.x, point.coords.y, point.coords.z)}
          scale={7}
        />
      ))}

      {/* Render hyperplane */}
      <mesh
        geometry={planeGeometry}
        material={hyperplaneMaterial}
        position={new Vector3(0, 0, -currentStep.state.hyperplane.bias)}
        rotation={
          new Euler(
            hyperplaneRotation.x,
            hyperplaneRotation.y,
            hyperplaneRotation.z,
          )
        }
        {...tooltipHandlers(
          <div>
            Hyperplane <br />
            Normal: {currentStep.state.hyperplane.weights.x.toFixed(2)},{" "}
            {currentStep.state.hyperplane.weights.y.toFixed(2)},{" "}
            {currentStep.state.hyperplane.weights.z.toFixed(2)} <br />
            Intercept: {currentStep.state.hyperplane.bias.toFixed(2)}
          </div>,
        )}
      />
    </>
  );
}
