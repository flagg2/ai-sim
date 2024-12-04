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

/**
 * Basic scene setup for an algorithm.
 */
export type SceneSetup = {
  dimension?: "2D" | "3D";
  renderGrid?: boolean;
  renderAxes?: boolean;
};

/**
 * A single step of an algorithm, contains state that changes as the algorithm progresses.
 */
export type Step<
  TState extends object = object,
  TStepType extends string = string,
> = {
  type: TStepType | "initial";
  title: string;
  description: React.ReactNode;
  state: TState;
};

/**
 * A dictionary of parameters of an algorithm.
 */
export type Params<
  TParamConfigurators extends {
    [key: string]: ParamConfigurator<unknown>;
  } = {
    [key: string]: ParamConfigurator<unknown>;
  },
> = {
  [key in keyof TParamConfigurators]: TParamConfigurators[key]["defaultValue"];
};

/**
 * A dictionary of parameter configurators of an algorithm.
 */
export type ParamConfiguratorDict<T = Record<string, ParamConfigurator>> = {
  [K in keyof T]: T[K] extends ParamConfigurator ? T[K] : never;
};

/**
 * A function that renders the current step and config into renderable objects.
 */
export type RenderFunction<
  TStep extends Step = Step<object, string>,
  TConfig extends object = object,
> = (step: TStep, config: TConfig) => Renderable[];

/**
 * Basic information about an algorithm.
 */
export type AlgorithmMeta = {
  slug: string;
  image: {
    paths: {
      light: string;
      dark: string;
    };
    alt: string;
  };
  title: string;
  description: string;
  shortDescription: string;
  synonyms: string[];
};

/**
 * Represents the core interface for defining visualizable algorithms in MLens.
 * Each algorithm must implement this interface to be properly rendered and controlled.
 *
 * @template TStep - Represents a single step in the algorithm's execution, containing state and metadata
 * @template TConfig - Configuration object storing immutable algorithm parameters
 * @template TParamConfigurators - Defines the available user-configurable parameters
 *
 * @property meta - Basic information about the algorithm (title, description, etc.)
 * @property paramConfigurators - Defines the interactive controls for configuring algorithm parameters
 * @property getConfig - Generates the configuration object based on user-defined parameters
 * @property getInitialStep - Creates the first step of the visualization, which serves as a preview
 * @property getSteps - Generates all subsequent steps containing the core algorithm logic
 * @property getSceneSetup - Controls fundamental scene properties (2D/3D, grid, axes)
 * @property render - Converts the current step and config into renderable objects
 */
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
