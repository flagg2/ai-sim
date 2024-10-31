// TODO: one point gets skipped - evident with few points

import type { SliderParamConfigurator } from "../common/paramConfigurators/slider";
import type { ParamConfiguratorDict } from "../common/paramConfigurators/param";
import type {
  AlgorithmDefinition,
  Coords3D,
  Group,
  Step,
} from "../common/types";

export type DataPoint = {
  id: string;
  coords: Coords3D;
  group: Group;
};

type KNNStepType =
  | "calculateDistance"
  | "updateNearestNeighbors"
  | "updateQueryPoint";

type KNNStepState = {
  currentIndex: number;
  distances: { point: DataPoint; distance: number }[];
  nearestNeighbors?: DataPoint[];
  queryPoint: DataPoint;
};

export type KNNStep = Step<KNNStepState, KNNStepType>;

export type KNNParamConfiguratorDict = ParamConfiguratorDict<{
  points: SliderParamConfigurator;
  k: SliderParamConfigurator;
  groups: SliderParamConfigurator;
}>;

export type KNNConfig = {
  points: DataPoint[];
  k: number;
  groups: Group[];
};

export type KNNDefinition = AlgorithmDefinition<
  KNNStep,
  KNNConfig,
  KNNParamConfiguratorDict
>;
