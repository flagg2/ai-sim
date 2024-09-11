import type { MeshStandardMaterial } from "three";

export type Simulation<T extends object> = {
  fastForward: (state: T) => T;
  forward: (state: T) => T;
  backward: (state: T) => T;
  fastBackward: (state: T) => T;
};

export type Coords = {
  x: number;
  y: number;
  z: number;
};

export type Group = {
  label: string;
  material: MeshStandardMaterial;
};
