import type { MeshStandardMaterial } from "three";
import type { Renderable } from "./objects/renderable";
import type {
  ParamConfigurator,
  ParamConfiguratorDict,
} from "./paramConfigurators/param";

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
    [key: string]: ParamConfigurator<any>;
  } = {
    [key: string]: ParamConfigurator<unknown>;
  },
> = {
  [key in keyof TParamConfigurators]: TParamConfigurators[key]["defaultValue"];
};

export type RenderFunction<
  TStep extends Step<any, any> = Step<object, string>,
  TConfig extends object = object,
> = (state: TStep["state"], config: TConfig) => Renderable[];

export type AlgorithmDefinition<
  TStep extends Step = Step,
  TConfig extends object = object,
  TParamConfigurators extends ParamConfiguratorDict = ParamConfiguratorDict,
> = {
  title: string;
  description: React.ReactNode;
  paramConfigurators: TParamConfigurators;
  getConfig: (params: Params<TParamConfigurators>) => TConfig;
  getInitialStep: (config: TConfig) => TStep;
  getSteps: (config: TConfig, initialStep: TStep) => TStep[];
  getSceneSetup: (config: TConfig) => SceneSetup;
  render: RenderFunction<TStep, TConfig>;
};
