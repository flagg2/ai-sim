import type { ParamConfiguratorDict } from "@repo/simulations/lib/param-configurators/param";
import type { SliderParamConfigurator } from "@repo/simulations/lib/param-configurators/slider";
import type { AlgorithmDefinition, Step } from "@repo/simulations/lib/types";
import type { Coords2D } from "@repo/simulations/lib/types";

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
}>;

export type SVMConfig = {
  points: DataPoint[];
};

export type SVMDefinition = AlgorithmDefinition<
  SVMStep,
  SVMConfig,
  SVMParamConfiguratorDict
>;
