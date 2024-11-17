import React, { useMemo } from "react";
import {
  PerspectiveCamera,
  OrbitControls,
  OrthographicCamera,
  MapControls,
} from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import AxesHelper from "./axes-helper";
import { SceneSetup } from "@repo/algorithms/lib";

interface SceneSetupProps {
  children: React.ReactNode;
  sceneSetup: SceneSetup;
}

export const SceneSetupComponent: React.FC<SceneSetupProps> = ({
  children,
  sceneSetup,
}) => {
  const { dimension } = sceneSetup;
  const is3d = dimension === "3D";

  const only3d = useMemo(() => {
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
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            intensity={0.5}
            levels={9}
            mipmapBlur
          />
        </EffectComposer>
        <fog attach="fog" args={["#070710", 100, 700]} />
      </>
    );
  }, []);

  const only2d = useMemo(() => {
    return (
      <>
        <OrthographicCamera
          makeDefault
          position={[100, 100, 200]}
          zoom={3}
          near={0.1}
          far={2000}
          rotation={[0, 0, 0]}
          lookAt={() => new THREE.Vector3(100, 100, 0)}
        />
        <MapControls
          enableRotate={false}
          screenSpacePanning={true}
          minZoom={3}
          maxZoom={5}
        />
      </>
    );
  }, []);

  return (
    <>
      {is3d ? only3d : only2d}
      {sceneSetup.renderAxes !== false && <AxesHelper is3D={is3d} />}
      <color attach="background" args={["#050505"]} />
      <ambientLight intensity={is3d ? 0.5 : 1} />
      <group
        position={[0, is3d ? -0.01 : 0, 0]}
        rotation={[is3d ? 0 : -Math.PI / 2, 0, 0]}
      >
        {sceneSetup.renderGrid !== false && (
          <>
            {/* Larger, more visible grid */}
            <gridHelper
              args={[1000, 32, "#2f2f2f", "#2f2f2f"]}
              renderOrder={0}
            />
            {/* Thicker lines for larger areas */}
            <gridHelper
              args={[1000, 4, "#3a3a3a", "#3a3a3a"]}
              renderOrder={0}
            />
          </>
        )}
      </group>
      {children}
    </>
  );
};
