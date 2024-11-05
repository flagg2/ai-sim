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
    const planeNormal = new Vector3(normal.x, normal.y, normal.z).normalize();
    const defaultNormal = new Vector3(0, 0, 1);

    // Create a quaternion to rotate the plane's default normal to the given normal
    const quaternion = new Quaternion().setFromUnitVectors(
      defaultNormal,
      planeNormal,
    );

    // Calculate the position based on the bias (distance along the normal)
    const position = planeNormal.clone().multiplyScalar(-bias);

    // Convert quaternion to Euler angles for the rotation property
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
