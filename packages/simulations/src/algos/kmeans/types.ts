import type { SliderParamConfigurator } from "../paramConfigurators/slider";
import type { ParamConfiguratorDict } from "../paramConfigurators/param";
import type { AlgorithmDefinition, Coords3D, Group, Step } from "../types";

export type Point = {
  id: string;
  coords: Coords3D;
  group: Group;
};

export type KMeansStepType =
  | "initializeCentroids"
  | "assignPointsToClusters"
  | "updateCentroids"
  | "checkConvergence";

export type KMeansStepState = {
  points: Point[];
  centroids: Point[];
  iteration: number;
};

export type KMeansStep = Step<KMeansStepState, KMeansStepType>;

export type KMeansParamConfiguratorDict = ParamConfiguratorDict<{
  points: SliderParamConfigurator;
  k: SliderParamConfigurator;
  maxIterations: SliderParamConfigurator;
}>;

export type KMeansConfig = {
  points: Point[];
  k: number;
  maxIterations: number;
};

export type KMeansDefinition = AlgorithmDefinition<
  KMeansStep,
  KMeansConfig,
  KMeansParamConfiguratorDict
>;
