import {
  AlgorithmDefinition,
  Coords2D,
  ParamConfiguratorDict,
  SelectParamConfigurator,
  SliderParamConfigurator,
  Step,
  SwitchParamConfigurator,
} from "../../lib";

export type DataPoint = {
  id: string;
  coords: Coords2D;
  label: 1 | -1;
};

type SVMStepType =
  | "initial"
  | "findSupportVectors"
  | "calculateDecisionBoundary";

type KernelType = "linear" | "rbf" | "polynomial";

type SVMStepState = {
  supportVectors?: DataPoint[];
  alphas?: number[];
  bias?: number;
  regionData?: {
    x: number;
    y: number;
    prediction: 1 | -1;
  }[];
};

export type SVMStep = Step<SVMStepState, SVMStepType>;

export type SVMParamConfiguratorDict = ParamConfiguratorDict<{
  points: SliderParamConfigurator;
  generateRadialData: SwitchParamConfigurator;
  kernelType: SelectParamConfigurator<KernelType>;
}>;

export type SVMConfig = {
  points: DataPoint[];
  kernelType: KernelType;
};

export type SVMDefinition = AlgorithmDefinition<
  SVMStep,
  SVMConfig,
  SVMParamConfiguratorDict
>;
