import {
  AlgorithmDefinition,
  Coords2D,
  ParamConfiguratorDict,
  SelectParamConfigurator,
  SliderParamConfigurator,
} from "../../lib";

export type DataPoint = {
  id: string;
  coords: Coords2D;
  label: 1 | -1;
};

export type XGBoostConfig = {
  trainingPoints: DataPoint[];
  learningRate: number;
  maxDepth: number;
  numTrees: number;
};

export type XGBoostState = {
  predictions?: Array<{ x: number; y: number; prediction: number }>;
  boundaryPredictions?: Array<{ x: number; y: number; prediction: number }>;
};

export type XGBoostStepType =
  | "initial"
  | "calculateResiduals"
  | "buildTree"
  | "afterOneIteration"
  | "showFinalResult";

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

export type XGBoostDefinition = AlgorithmDefinition<
  XGBoostStep,
  XGBoostConfig,
  XGBoostParamConfiguratorDict
>;
