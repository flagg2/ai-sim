import type { MeshStandardMaterial } from "three";
import type { ParamConfigurator } from "./param-configurators/param";
import type { Renderable } from "./objects/renderable";

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

export type SceneSetup = {
  dimension?: "2D" | "3D";
  renderGrid?: boolean;
  renderAxes?: boolean;
};

export type Step<
  TState extends object = object,
  TStepType extends string = string,
> = {
  type: TStepType | "initial";
  title: string;
  description: React.ReactNode;
  state: TState;
};

export type Params<
  TParamConfigurators extends {
    [key: string]: ParamConfigurator<unknown>;
  } = {
    [key: string]: ParamConfigurator<unknown>;
  },
> = {
  [key in keyof TParamConfigurators]: TParamConfigurators[key]["defaultValue"];
};

export type ParamConfiguratorDict<T = Record<string, ParamConfigurator>> = {
  [K in keyof T]: T[K] extends ParamConfigurator ? T[K] : never;
};

export type RenderFunction<
  TStep extends Step = Step<object, string>,
  TConfig extends object = object,
> = (state: TStep["state"], config: TConfig) => Renderable[];

export type AlgorithmMeta = {
  slug: string;
  image: {
    path: string;
    alt: string;
  };
  title: string;
  description: string;
  shortDescription: string;
  synonyms: string[];
};

export type AlgorithmDefinition<
  TStep extends Step = Step,
  TConfig extends object = object,
  TParamConfigurators extends ParamConfiguratorDict = ParamConfiguratorDict,
> = {
  meta: AlgorithmMeta;
  paramConfigurators: TParamConfigurators;
  getConfig: (params: Params<TParamConfigurators>) => TConfig;
  getInitialStep: (config: TConfig) => TStep;
  getSteps: (config: TConfig, initialStep: TStep) => Promise<TStep[]>;
  getSceneSetup: (currentStep?: TStep, config?: TConfig) => SceneSetup;
  render: RenderFunction<TStep, TConfig>;
};
