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
  transformedCoords?: Coords3D; // For kernel visualization
};

type SVMStepType =
  | "initial"
  | "transformToHigherDimension"
  | "findSupportVectors"
  | "calculateHyperplane";

type SVMStepState = {
  transformedPoints?: DataPoint[];
  supportVectors?: DataPoint[];
  hyperplane?: {
    normal: Coords3D;
    bias: number;
  };
  margin?: number;
};

export type SVMStep = Step<SVMStepState, SVMStepType>;

export type SVMParamConfiguratorDict = ParamConfiguratorDict<{
  points: SliderParamConfigurator;
  showcaseKernel: SwitchParamConfigurator;
}>;

export type SVMConfig = {
  points: DataPoint[];
};

export type SVMDefinition = AlgorithmDefinition<
  SVMStep,
  SVMConfig,
  SVMParamConfiguratorDict
>;
