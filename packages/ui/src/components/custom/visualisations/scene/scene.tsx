import { Canvas } from "@react-three/fiber";
import AxesHelper from "../axes-helper";
import Scene3D from "./scene3d";
import Scene2D from "./scene2d";
import { SceneSetup as SceneSetupType } from "@repo/algorithms/lib";
import { useTheme } from "next-themes";

export default function Scene({
  children,
  sceneSetup,
}: {
  children: React.ReactNode;
  sceneSetup: SceneSetupType;
}) {
  const { dimension } = sceneSetup;
  const is3d = dimension === "3D";
  const { theme } = useTheme();

  return (
    <div className="h-full w-screen">
      <Canvas
        className="h-full w-screen p-0 m-0"
        flat
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        {is3d ? <Scene3D /> : <Scene2D />}
        {sceneSetup.renderAxes !== false && <AxesHelper is3D={is3d} />}
        <color
          attach="background"
          args={[theme === "dark" ? "#050505" : "#f5f5f5"]}
        />
        <ambientLight intensity={is3d ? (theme === "dark" ? 0.5 : 0.8) : 1} />
        <group
          position={[0, is3d ? -0.01 : 0, 0]}
          rotation={[is3d ? 0 : -Math.PI / 2, 0, 0]}
        >
          {sceneSetup.renderGrid !== false && (
            <>
              <gridHelper
                args={[1000, 32, "#2f2f2f", "#2f2f2f"]}
                renderOrder={0}
              />
              <gridHelper
                args={[1000, 4, "#3a3a3a", "#3a3a3a"]}
                renderOrder={0}
              />
            </>
          )}
        </group>
        {children}
      </Canvas>
    </div>
  );
}
