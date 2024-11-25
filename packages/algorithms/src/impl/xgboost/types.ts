import {
  AlgorithmDefinition,
  Coords2D,
  ParamConfiguratorDict,
  SliderParamConfigurator,
  Step,
} from "../../lib";

export type TreeNode = {
  id: string;
  splitFeature?: number;
  splitValue?: number;
  prediction?: number;
  left?: TreeNode;
  right?: TreeNode;
  coords?: Coords2D;
};

export type DataPoint = {
  id: string;
  coords: Coords2D;
  label: number;
  currentPrediction?: number;
};

type XGBoostStepType =
  | "initial"
  | "buildTree"
  | "calculatePredictions"
  | "updateResiduals"
  | "finalPredictions";

type XGBoostStepState = {
  points: DataPoint[];
  currentTree?: TreeNode;
  trees?: TreeNode[];
  iteration?: number;
  predictions?: number[];
};

export type XGBoostStep = Step<XGBoostStepState, XGBoostStepType>;

export type XGBoostParamConfiguratorDict = ParamConfiguratorDict<{
  points: SliderParamConfigurator;
  maxDepth: SliderParamConfigurator;
  learningRate: SliderParamConfigurator;
  numTrees: SliderParamConfigurator;
}>;

export type XGBoostConfig = {
  points: DataPoint[];
  maxDepth: number;
  learningRate: number;
  numTrees: number;
};

export type XGBoostDefinition = AlgorithmDefinition<
  XGBoostStep,
  XGBoostConfig,
  XGBoostParamConfiguratorDict
>;
