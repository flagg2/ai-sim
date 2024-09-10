"use client";

import { useEffect, useMemo, useState } from "react";
import {
  generateKGroups,
  generateRandomPoint,
  generateRandomPoints,
  KNN,
  KNNState,
  Point,
} from "~/lib/algos/knn";
import { Canvas } from "@react-three/fiber";
import { getWhiteMaterial } from "~/lib/utils/materials";
import { SphereGeometry, Vector3, BufferGeometry } from "three";
import { Line, OrbitControls, PerspectiveCamera } from "@react-three/drei";

type AlgoProps = {
  numberOfPoints: number;
  k: number;
};

function useKNN({ numberOfPoints, k }: AlgoProps) {
  const groups = generateKGroups(k);

  const [state, setState] = useState<KNNState>({
    points: generateRandomPoints({ k, groups, points: [] }, numberOfPoints),
    groups,
    k,
    queryPoint: {
      id: "query",
      coords: { x: 50, y: 50, z: 50 },
      group: {
        label: "Current",
        material: getWhiteMaterial(),
      },
    },
    distances: [],
    currentIndex: 0,
    nearestNeighbors: [],
    isMajorStep: false,
  });

  useEffect(() => {
    const newPoints = state.points.slice(0, numberOfPoints);
    while (newPoints.length !== numberOfPoints) {
      newPoints.push(generateRandomPoint({ k, groups, points: newPoints }));
    }

    setState({
      ...state,
      points: newPoints,
    });
  }, [numberOfPoints]);

  useEffect(() => {
    setState({
      ...state,
      points: generateRandomPoints(state, numberOfPoints),
      k,
    });
  }, [k]);

  const handleNext = () => {
    const nextState = KNN.next(state);
    setState(nextState);
  };

  const handleNextMinor = () => {
    const nextState = KNN.nextMinor(state);
    setState(nextState);
  };

  const handlePrevious = () => {
    const nextState = KNN.previous(state);
    setState(nextState);
  };

  return {
    state,
    handleNext,
    handleNextMinor,
    handlePrevious,
  };
}

export default function Algo({ numberOfPoints, k }: AlgoProps) {
  const { state, handleNext, handleNextMinor, handlePrevious } = useKNN({
    numberOfPoints,
    k,
  });

  const sphereGeometry = useMemo(() => new SphereGeometry(0.5, 32, 32), []);

  return (
    <>
      <button onClick={handleNext}>Next</button>
      <button onClick={handleNextMinor}>Next Minor</button>
      <button onClick={handlePrevious}>Previous</button>
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
                state.queryPoint.coords.x,
                state.queryPoint.coords.y,
                state.queryPoint.coords.z,
              )
            }
            geometry={sphereGeometry}
            material={getWhiteMaterial()}
            scale={10}
          />
          {state.points.map((point, index) => (
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
          {state.distances
            .filter((x) => state.nearestNeighbors.includes(x.point))
            .map((distance, index) => (
              <lineSegments
                key={index}
                geometry={new BufferGeometry().setFromPoints([
                  new Vector3(
                    distance.point.coords.x,
                    distance.point.coords.y,
                    distance.point.coords.z,
                  ),
                  new Vector3(
                    state.queryPoint.coords.x,
                    state.queryPoint.coords.y,
                    state.queryPoint.coords.z,
                  ),
                ])}
              />
            ))}
        </Canvas>
      </div>
    </>
  );
}
