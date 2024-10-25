// TODO: one point gets skipped - evident with few points

import type { SliderParamConfigurator } from "../paramConfigurators/slider";
import type { AlgorithmDefinition, Coords3D, Group, Step } from "../types";

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

type KNNParamConfigurators = {
  points: SliderParamConfigurator;
  k: SliderParamConfigurator;
  groups: SliderParamConfigurator;
};

type KNNConfig = {
  points: DataPoint[];
  k: number;
  groups: Group[];
};

export type KNNDefinition = AlgorithmDefinition<
  KNNStep,
  KNNConfig,
  KNNParamConfigurators
>;
