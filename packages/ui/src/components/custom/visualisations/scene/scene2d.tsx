import { OrthographicCamera } from "@react-three/drei";
import { MapControls } from "@react-three/drei";
import { Vector3 } from "three";
import { useScreenSize } from "../../../../lib/hooks/use-screen-size";

const BREAKPOINT = 768;

export default function Scene2D() {
  const screenSize = useScreenSize();
  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[100, 100, 200]}
        zoom={screenSize.width > BREAKPOINT ? 3 : 1.5}
        near={0.1}
        far={2000}
        rotation={[0, 0, 0]}
        lookAt={() => new Vector3(100, 100, 0)}
      />
      <MapControls
        enableRotate={false}
        screenSpacePanning={true}
        minZoom={screenSize.width > BREAKPOINT ? 3 : 1.5}
        maxZoom={5}
      />
    </>
  );
}
