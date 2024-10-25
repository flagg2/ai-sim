import type { MeshStandardMaterial } from "three";
import type { Renderable } from "./objects/renderable";
import type { ParamConfigurator } from "./paramConfigurators/param";

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

export type Step<TState extends object, TStepType extends string> = {
  index: number;
  type: TStepType | "initial";
  title: string;
  description: React.ReactNode;
  state: TState;
};

export type Params<
  TParamConfigurators extends {
    [key: string]: ParamConfigurator<any>;
  },
> = {
  [key in keyof TParamConfigurators]: TParamConfigurators[key]["defaultValue"];
};

export type Algorithm<
  TStep extends Step<any, any>,
  TConfig extends object,
  TParamConfigurators extends {
    [key: string]: ParamConfigurator<any>;
  },
> = {
  config: TConfig;
  steps: TStep[];
  paramConfigurators: TParamConfigurators;
  getConfig: (params: Params<TParamConfigurators>) => TConfig;
  getInitialStep: (config: TConfig) => TStep;
  render: (state: TStep["state"]) => {
    objects: Renderable[];
    sceneSetup?: SceneSetup;
  };
};

export type AlgorithmDefinition<
  TStep extends Step<any, any>,
  TConfig extends object,
  TParamConfigurators extends {
    [key: string]: ParamConfigurator<any>;
  },
> = {
  paramConfigurators: TParamConfigurators;
  getConfig: (params: Params<TParamConfigurators>) => TConfig;
  getInitialStep: (config: TConfig) => TStep;
  getSteps: (config: TConfig, initialStep: TStep) => TStep[];
  render: (
    state: TStep["state"],
    config: TConfig,
  ) => {
    objects: Renderable[];
    sceneSetup?: SceneSetup;
  };
};
