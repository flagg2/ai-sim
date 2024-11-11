import type { SliderParamConfigurator } from "../common/paramConfigurators/slider";
import type { SwitchParamConfigurator } from "../common/paramConfigurators/switch";
import type { ParamConfiguratorDict } from "../common/paramConfigurators/param";
import type {
  AlgorithmDefinition,
  Coords2D,
  Coords3D,
  Step,
} from "../common/types";

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
  separationLine?: {
    slope: number;
    yIntercept: number;
  };
};

export type SVMStep = Step<SVMStepState, SVMStepType>;

export type SVMParamConfiguratorDict = ParamConfiguratorDict<{
  points: SliderParamConfigurator;
  useRadialData: SwitchParamConfigurator;
}>;

export type SVMConfig = {
  points: DataPoint[];
};

export type SVMDefinition = AlgorithmDefinition<
  SVMStep,
  SVMConfig,
  SVMParamConfiguratorDict
>;
