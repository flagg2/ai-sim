import {
  AlgorithmDefinition,
  Coords2D,
  ParamConfiguratorDict,
  SliderParamConfigurator,
} from "../../lib";

// Point data structure
export type DataPoint = {
  id: number;
  coords: Coords2D;
  label: 1 | -1; // Binary classification
};

// Configuration for the algorithm
export type XGBoostConfig = {
  trainingPoints: DataPoint[];
  learningRate: number;
  maxDepth: number;
  numTrees: number;
};

// State for each step
export type XGBoostState = {
  predictions?: Array<{ x: number; y: number; prediction: number }>;
  boundaryPredictions?: Array<{ x: number; y: number; prediction: number }>;
};

// Step types
export type XGBoostStepType =
  | "initial"
  | "calculateResiduals"
  | "buildTree"
  | "afterOneIteration"
  | "showFinalResult";

// Step structure
export type XGBoostStep = {
  type: XGBoostStepType;
  title: string;
  description: React.ReactNode;
  state: XGBoostState;
};

export type XGBoostParamConfiguratorDict = ParamConfiguratorDict<{
  points: SliderParamConfigurator;
  learningRate: SliderParamConfigurator;
  maxDepth: SliderParamConfigurator;
  numTrees: SliderParamConfigurator;
}>;

// Main algorithm definition
export type XGBoostDefinition = AlgorithmDefinition<
  XGBoostStep,
  XGBoostConfig,
  XGBoostParamConfiguratorDict
>;
