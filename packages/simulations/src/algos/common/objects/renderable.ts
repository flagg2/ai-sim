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

export type PrimitiveType = "mesh" | "points";
export interface Renderable {
  getKey: () => string;
  getRenderProps: () => ThreeProps | ThreeProps[];
  getTooltip: () => React.ReactNode | null;
  getPrimitiveType?(): PrimitiveType;
}

export type RenderFn<TState, TConfig> = (
  state: TState,
  config: TConfig,
) => {
  objects: Renderable[];
  dimension: "2D" | "3D";
};

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
