import {
  Euler,
  PlaneGeometry,
  Vector3,
  MeshStandardMaterial,
  DoubleSide,
  Quaternion,
} from "three";
import type { Coords3D } from "../types";
import { RenderableObject, type Renderable } from "./renderable";

type PlaneProps = {
  normal: Coords3D;
  bias: number;
  width?: number;
  height?: number;
  material?: MeshStandardMaterial;
  tooltip?: React.ReactNode;
  name?: string;
};

export class Plane implements Renderable {
  public object: RenderableObject;
  private static defaultMaterial = new MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    side: DoubleSide,
  });

  constructor(props: PlaneProps) {
    const {
      normal,
      bias,
      width = 300,
      height = 300,
      material = Plane.defaultMaterial,
      tooltip,
      name,
    } = props;

    // Normalize the normal vector
    const normalLength = Math.sqrt(
      normal.x * normal.x + normal.y * normal.y + normal.z * normal.z,
    );
    const planeNormal = new Vector3(
      normal.x / normalLength,
      normal.y / normalLength,
      normal.z / normalLength,
    );

    // Simpler rotation calculation
    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 0, 1), // default plane normal
      planeNormal,
    );

    // Adjust bias by the normal length to maintain the correct distance
    const adjustedBias = bias / normalLength;
    const position = planeNormal.clone().multiplyScalar(adjustedBias);

    const rotation = new Euler().setFromQuaternion(quaternion);

    this.object = new RenderableObject({
      three: {
        geometry: new PlaneGeometry(width, height),
        material,
        position: position,
        rotation: rotation,
      },
      getTooltip: () => tooltip,
      name: name ?? "Plane",
    });
  }

  getRenderProps() {
    return this.object.getRenderProps();
  }

  getKey() {
    return this.object.getKey();
  }

  getTooltip() {
    return this.object.getTooltip(this.object);
  }
}
