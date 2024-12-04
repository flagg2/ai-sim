import React from "react";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";

interface AxesHelperProps {
  size?: number;
  is3D?: boolean;
}

const AxesHelper: React.FC<AxesHelperProps> = ({ size = 500, is3D = true }) => {
  const axisEnd = size;

  return (
    <group>
      <Line
        points={[
          new Vector3(!is3D ? -axisEnd : 0, 0, 0),
          new Vector3(axisEnd, 0, 0),
        ]}
        color="red"
      />

      <Line
        points={[
          new Vector3(0, !is3D ? -axisEnd : 0, 0),
          new Vector3(0, axisEnd, 0),
        ]}
        color="green"
      />

      {is3D && (
        <Line
          points={[
            new Vector3(0, 0, !is3D ? -axisEnd : 0),
            new Vector3(0, 0, axisEnd),
          ]}
          color="blue"
        />
      )}
    </group>
  );
};

export default AxesHelper;
