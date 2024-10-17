import { SphereGeometry, Vector3, type MeshStandardMaterial } from "three";
import type { Coords } from "../common";
import { RenderableObject, type Renderable } from "./renderable";

type PointProps = {
  coords: Coords;
  material: MeshStandardMaterial;
  tooltip?: React.ReactNode;
  name?: string;
};

export class Point implements Renderable {
  public object: RenderableObject;

  constructor(props: PointProps) {
    const { coords, material, tooltip, name } = props;
    this.object = new RenderableObject({
      three: {
        geometry: new SphereGeometry(1, 32, 32),
        material,
        position: new Vector3(coords.x, coords.y, coords.z),
        scale: 3,
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
