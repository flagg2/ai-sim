// packages/algorithms/src/impl/svm/decision-region.ts
import { BoxGeometry, Vector3, type MeshStandardMaterial } from "three";
import type { Coords2D } from "../../lib/types";
import {
  RenderableObject,
  type Renderable,
} from "../../lib/objects/renderable";

type RegionProps = {
  position: Coords2D;
  size: number;
  material: MeshStandardMaterial;
  name?: string;
};

export class Region implements Renderable {
  public object: RenderableObject;

  constructor(props: RegionProps) {
    const { position, size, material, name } = props;
    this.object = new RenderableObject({
      three: {
        geometry: new BoxGeometry(size, size, 0.1),
        material,
        position: new Vector3(position.x, position.y, -1), // Place slightly behind points
      },
      name: name ?? "DecisionRegion",
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
