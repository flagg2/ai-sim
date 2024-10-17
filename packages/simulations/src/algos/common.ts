import type { MeshStandardMaterial } from "three";
import type { Renderable } from "./objects/renderable";

export type Simulation<T extends object> = {
  forward: (state: T) => T;
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

export type Step<TState extends object, TStepType extends string> = {
  index: number;
  type: TStepType | "initial";
  title: string;
  description: React.ReactNode;
  state: TState;
};

export type Algorithm<TStep extends Step<any, any>, TConfig extends object> = {
  config: TConfig;
  steps: TStep[];
  render: (state: TStep["state"]) => Renderable[];
};
