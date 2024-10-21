// import React, { useMemo, useRef, useState, useEffect } from "react";
// import { PerspectiveCamera, OrbitControls, Grid } from "@react-three/drei";
// // @ts-ignore
// import { Bloom, EffectComposer } from "@react-three/postprocessing";
// import * as THREE from "three";
// import { useFrame } from "@react-three/fiber";
// import { easeInOut } from "framer-motion";
// import AxesHelper from "./AxesHelper";

// interface SceneSetupProps {
//   children: React.ReactNode;
//   is3D: boolean;
// }

// export const SceneSetup: React.FC<SceneSetupProps> = ({ children, is3D }) => {
//   const cameraRef = useRef<THREE.PerspectiveCamera>(null);
//   const controlsRef = useRef<typeof OrbitControls>(null);
//   const [animationProgress, setAnimationProgress] = useState(is3D ? 1 : 0);
//   const animationDuration = 1000; // ms
//   const startTime = useRef(0);
//   const isTransitioning = useRef(false);

//   useEffect(() => {
//     startTime.current = Date.now();
//     isTransitioning.current = true;
//   }, [is3D]);

//   useFrame(() => {
//     if (controlsRef.current) {
//       controlsRef.current.update();
//     }

//     const elapsedTime = Date.now() - startTime.current;
//     const progress = Math.min(elapsedTime / animationDuration, 1);
//     const easedProgress = easeInOut(progress);

//     setAnimationProgress(is3D ? easedProgress : 1 - easedProgress);

//     if (isTransitioning.current && cameraRef.current) {
//       const x = 250 * animationProgress;
//       const y = 250 + 750 * (1 - animationProgress);
//       const z = 250 * animationProgress;
//       cameraRef.current.position.set(x, y, z);
//       cameraRef.current.lookAt(0, 0, 0);
//       cameraRef.current.updateProjectionMatrix();

//       if (progress === 1) {
//         isTransitioning.current = false;
//       }
//     }
//   });

//   return (
//     <>
//       <>
//         <PerspectiveCamera
//           ref={cameraRef}
//           makeDefault
//           fov={60}
//           near={0.1}
//           far={2000}
//         />
//         <color attach="background" args={["#050505"]} />
//         {is3D && animationProgress > 0.8 && (
//           <fog attach="fog" args={["#070710", 100, 700]} />
//         )}
//         {is3D ? (
//           <Grid
//             position={[0, -0.01, 0]}
//             args={[1000, 1000]}
//             cellSize={10}
//             cellThickness={0.5}
//             cellColor="#1a1a1a"
//             sectionSize={30}
//             sectionThickness={1}
//             sectionColor="#2a2a2a"
//             fadeDistance={1000}
//             fadeStrength={1}
//           />
//         ) : (
//           <group>
//             <gridHelper args={[1000, 20, "#2a2a2a", "#2a2a2a"]} />
//             <gridHelper args={[1000, 4, "#3a3a3a", "#3a3a3a"]} />
//           </group>
//         )}
//         <ambientLight intensity={0.5} />
//         {is3D && <directionalLight position={[5, 5, 5]} intensity={1} />}
//         {children}
//         {is3D && animationProgress > 0.5 && <AxesHelper is3D={is3D} />}
//         {is3D && animationProgress > 0.8 && (
//           <EffectComposer>
//             <Bloom
//               luminanceThreshold={0.2}
//               intensity={0.5}
//               levels={9}
//               mipmapBlur
//             />
//           </EffectComposer>
//         )}
//       </>
//       <OrbitControls
//         ref={controlsRef}
//         camera={cameraRef.current}
//         enablePan={true}
//         enableZoom={true}
//         enableRotate={is3D}
//         enabled={!isTransitioning.current}
//         minDistance={is3D ? 100 : undefined}
//         maxDistance={is3D ? 400 : undefined}
//         minPolarAngle={is3D ? Math.PI / 3 : undefined}
//         maxPolarAngle={is3D ? Math.PI / 2 : undefined}
//         minZoom={is3D ? undefined : 0.5}
//         maxZoom={is3D ? undefined : 2}
//         panSpeed={is3D ? 1 : 0.5}
//         mouseButtons={{
//           LEFT: is3D ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
//           MIDDLE: THREE.MOUSE.DOLLY,
//           RIGHT: THREE.MOUSE.PAN,
//         }}
//       />
//     </>
//   );
// };
