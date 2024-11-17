import { SliderParamConfigurator } from "../../lib";
import { Step } from "../../lib";
import {
  AlgorithmDefinition,
  Coords3D,
  ParamConfiguratorDict,
} from "../../lib";

export type DataPoint = {
  id: string;
  coords: Coords3D;
};

type LinearRegressionStepType =
  | "calculateMeans"
  | "calculateCoefficients"
  | "updateLine"
  | "calculateSumOfSquaredErrors";

type LinearRegressionStepState = {
  means?: { x: number; y: number; z: number };
  coefficients?: {
    slopeXY: number;
    slopeXZ: number;
    interceptY: number;
    interceptZ: number;
  };
  predictionLine?: { start: Coords3D; end: Coords3D };
  sumOfSquaredErrors?: number;
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
