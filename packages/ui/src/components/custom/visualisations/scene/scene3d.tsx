import { Bloom } from "@react-three/postprocessing";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";

export default function Scene3D() {
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
        <Bloom luminanceThreshold={0.2} intensity={0.5} levels={9} mipmapBlur />
      </EffectComposer>
      <fog attach="fog" args={["#070710", 100, 700]} />
    </>
  );
}
