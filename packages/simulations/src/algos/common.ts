import type { MeshStandardMaterial } from "three";

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
  type: TStepType | "initial";
  title: string;
  description: React.ReactNode;
  nextStep: TStepType | null;
  state: TState;
};

export type Algorithm<TStep extends Step<any, any>, TConfig extends object> = {
  config: TConfig;
  steps: TStep[];
};
