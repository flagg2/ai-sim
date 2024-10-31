import type { SliderParamConfigurator } from "../common/paramConfigurators/slider";
import type { ParamConfiguratorDict } from "../common/paramConfigurators/param";
import type { AlgorithmDefinition, Coords3D, Step } from "../common/types";

export type DataPoint = {
  id: string;
  coords: Coords3D;
};

type LinearRegressionStepType =
  | "calculateMeans"
  | "calculateCoefficients"
  | "updateLine";

type LinearRegressionStepState = {
  means?: { x: number; y: number; z: number };
  coefficients?: {
    slopeXY: number;
    slopeXZ: number;
    interceptY: number;
    interceptZ: number;
  };
  predictionLine?: { start: Coords3D; end: Coords3D };
};

export type LinearRegressionStep = Step<
  LinearRegressionStepState,
  LinearRegressionStepType
>;

export type LinearRegressionParamConfiguratorDict = ParamConfiguratorDict<{
  points: SliderParamConfigurator;
  noise: SliderParamConfigurator;
  heightScale: SliderParamConfigurator;
}>;

export type LinearRegressionConfig = {
  points: DataPoint[];
  noise: number;
};

export type LinearRegressionDefinition = AlgorithmDefinition<
  LinearRegressionStep,
  LinearRegressionConfig,
  LinearRegressionParamConfiguratorDict
>;
