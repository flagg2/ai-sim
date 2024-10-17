import type { Material } from "three";
import type { BufferGeometry } from "three";
import type { Euler } from "three";
import type { Vector3 } from "three";

export type ThreeProps = {
  material: Material;
  geometry: BufferGeometry;
  rotation?: Euler;
  position?: Vector3;
  scale?: number;
};

export interface Renderable {
  getKey: () => string;
  getRenderProps: () => ThreeProps;
  getTooltip: () => React.ReactNode;
}

export class RenderableObject {
  getTooltip: (object: RenderableObject) => React.ReactNode;
  three: ThreeProps;
  name: string;

  static keyCounter = 0;

  constructor(props: {
    three: ThreeProps;
    getTooltip?: (object: RenderableObject) => React.ReactNode;
    name?: string;
  }) {
    const { three, getTooltip = () => null, name = "Object" } = props;
    this.three = three;
    this.getTooltip = getTooltip;
    this.name = name;
  }

  getRenderProps() {
    return this.three;
  }

  getKey() {
    return `${this.name}-${RenderableObject.keyCounter++}`;
  }
}
