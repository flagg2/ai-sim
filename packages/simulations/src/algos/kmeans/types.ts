import type { ParamConfiguratorDict } from "@repo/simulations/lib/param-configurators/param";
import type { SliderParamConfigurator } from "@repo/simulations/lib/param-configurators/slider";
import type { AlgorithmDefinition, Step } from "@repo/simulations/lib/types";
import type { Group } from "@repo/simulations/lib/types";
import type { Coords3D } from "@repo/simulations/lib/types";

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
