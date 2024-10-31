import { CatmullRomCurve3, Material, TubeGeometry, Vector3 } from "three";
import type { Coords3D } from "../types";
import { RenderableObject, type Renderable } from "./renderable";

type LineProps = {
  from: Coords3D;
  to: Coords3D;
  material: Material;
  name?: string;
  radius?: number;
};

export class Tube implements Renderable {
  public object: RenderableObject;

  constructor(props: LineProps) {
    const { from, to, material, name, radius = 0.5 } = props;
    this.object = new RenderableObject({
      three: {
        geometry: new TubeGeometry(
          new CatmullRomCurve3([
            new Vector3(from.x, from.y, from.z),
            new Vector3(to.x, to.y, to.z),
          ]),
          20, // tubular segments
          radius, // radius
          8, // radial segments
          false, // closed
        ),
        material,
      },
      name: name ?? "Tube",
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
