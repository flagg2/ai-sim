import { SphereGeometry, Vector3, type MeshStandardMaterial } from "three";
import type { Coords2D, Coords3D } from "../types";
import { RenderableObject, type Renderable } from "./renderable";

type Point2DProps = {
  coords: Coords2D;
  material: MeshStandardMaterial;
  tooltip?: React.ReactNode;
  name?: string;
};

export class Point2D implements Renderable {
  public object: RenderableObject;

  constructor(props: Point2DProps) {
    const { coords, material, tooltip, name } = props;
    this.object = new RenderableObject({
      three: {
        geometry: new SphereGeometry(1, 32, 32),
        material,
        position: new Vector3(coords.x, 0, coords.y), // Y-axis locked to 0
        scale: 3,
      },
      getTooltip: () => tooltip,
      name: name ?? "Point2D",
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
