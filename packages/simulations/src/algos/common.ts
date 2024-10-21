import type { MeshStandardMaterial } from "three";
import type { Renderable } from "./objects/renderable";

export type Simulation<T extends object> = {
  forward: (state: T) => T;
};

export type Coords3D = {
  x: number;
  y: number;
  z: number;
};

export type Coords2D = {
  x: number;
  y: number;
};

export type Group = {
  label: string;
  material: MeshStandardMaterial;
};

type SceneSetup = {
  dimension: "2D" | "3D";
};

export type Config = {
  sceneSetup?: SceneSetup;
} & Record<string, any>;

export type Step<TState extends object, TStepType extends string> = {
  index: number;
  type: TStepType | "initial";
  title: string;
  description: React.ReactNode;
  state: TState;
  sceneSetup?: SceneSetup;
};

export type Algorithm<TStep extends Step<any, any>, TConfig extends Config> = {
  config: TConfig;
  steps: TStep[];
  render: (state: TStep["state"]) => Renderable[];
};
