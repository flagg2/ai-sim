import {
  AlgorithmDefinition,
  Coords2D,
  ParamConfiguratorDict,
  SliderParamConfigurator,
  Step,
} from "../../lib";

export type DataPoint = {
  id: string;
  coords: Coords2D;
  label: 1 | -1; // Binary classification
};

type SVMStepType =
  | "initial"
  | "findSupportVectors"
  | "calculateDecisionBoundary";

type SVMStepState = {
  supportVectors?: DataPoint[];
  alphas?: number[];
  bias?: number;
  regionData?: {
    x: number;
    y: number;
    prediction: 1 | -1;
  }[];
  separationLine?: {
    slope: number;
    yIntercept: number;
  };
};

export type SVMStep = Step<SVMStepState, SVMStepType>;

export type SVMParamConfiguratorDict = ParamConfiguratorDict<{
  points: SliderParamConfigurator;
}>;

export type SVMConfig = {
  points: DataPoint[];
};

export type SVMDefinition = AlgorithmDefinition<
  SVMStep,
  SVMConfig,
  SVMParamConfiguratorDict
>;
