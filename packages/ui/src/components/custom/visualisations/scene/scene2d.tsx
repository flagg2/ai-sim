import { OrthographicCamera } from "@react-three/drei";
import { MapControls } from "@react-three/drei";
import { Vector3 } from "three";

export default function Scene2D() {
  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[100, 100, 200]}
        zoom={3}
        near={0.1}
        far={2000}
        rotation={[0, 0, 0]}
        lookAt={() => new Vector3(100, 100, 0)}
      />
      <MapControls
        enableRotate={false}
        screenSpacePanning={true}
        minZoom={3}
        maxZoom={5}
      />
    </>
  );
}
