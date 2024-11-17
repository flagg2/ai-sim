import { SphereGeometry, Vector3, type MeshStandardMaterial } from "three";
import type { Coords2D } from "../types";
import { RenderableObject, type Renderable } from "./renderable";

type Point2DProps = {
  coords: Coords2D;
  material: MeshStandardMaterial;
  tooltip?: React.ReactNode;
  name?: string;
  scale?: number;
};

export class Point2D implements Renderable {
  public object: RenderableObject;

  constructor(props: Point2DProps) {
    const { coords, material, tooltip, name, scale = 3 } = props;
    this.object = new RenderableObject({
      three: {
        geometry: new SphereGeometry(1, 32, 32),
        material,
        position: new Vector3(coords.x, coords.y, 0),
        scale,
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
