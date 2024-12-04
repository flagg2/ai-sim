import { SphereGeometry, Vector3, type MeshStandardMaterial } from "three";
import type { Coords3D } from "../types";
import { RenderableObject, type Renderable } from "./renderable";

type PointProps = {
  coords: Coords3D;
  material: MeshStandardMaterial;
  tooltip?: React.ReactNode;
  name?: string;
  scale?: number;
};

/**
 * Renders a point in 3D space.
 */
export class Point3D implements Renderable {
  public object: RenderableObject;

  constructor(props: PointProps) {
    const { coords, material, tooltip, name, scale } = props;
    this.object = new RenderableObject({
      three: {
        geometry: new SphereGeometry(1, 32, 32),
        material,
        position: new Vector3(coords.x, coords.y, coords.z),
        scale: scale ?? 3,
      },
      getTooltip: () => tooltip,
      name: name ?? "Point",
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
