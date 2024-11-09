import type { AlgorithmDefinition, Coords2D, Step } from "../common/types";

export type DataPoint = {
  id: string;
  coords: Coords2D;
  actualValue: number;
  predictedValue: number;
};

type XGBoostStepType =
  | "initial"
  | "firstPrediction"
  | "calculateResiduals"
  | "buildTree"
  | "updatePredictions";

type XGBoostStepState = {
  currentTree: number;
  points: DataPoint[];
  residuals: number[];
  treeRegions?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    prediction: number;
  }[];
};

export type XGBoostStep = Step<XGBoostStepState, XGBoostStepType>;

export type XGBoostConfig = {
  points: DataPoint[];
  numberOfTrees: number;
};

export type XGBoostDefinition = AlgorithmDefinition<XGBoostStep, XGBoostConfig>;
