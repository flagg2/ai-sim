import { CatmullRomCurve3, Material, TubeGeometry, Vector3 } from "three";
import type { Coords3D } from "../types";
import { RenderableObject, type Renderable } from "./renderable";

type TubeProps = {
  from: Coords3D;
  to: Coords3D;
  material: Material;
  name?: string;
  radius?: number;
};

/**
 * Renders a tube between two points in 3D space.
 */
export class Tube implements Renderable {
  public object: RenderableObject;

  constructor(props: TubeProps) {
    const { from, to, material, name, radius = 0.5 } = props;
    this.object = new RenderableObject({
      three: {
        geometry: new TubeGeometry(
          new CatmullRomCurve3([
            new Vector3(from.x, from.y, from.z),
            new Vector3(to.x, to.y, to.z),
          ]),
          20, // tubular segments
          radius,
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
