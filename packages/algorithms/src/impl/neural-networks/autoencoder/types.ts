import {
  AlgorithmDefinition,
  ParamConfiguratorDict,
  SliderParamConfigurator,
} from "../../../lib";
import type { NNConfig } from "../types";
import type { NNStep } from "../types";

type AutoEncoderParamConfiguratorDict = ParamConfiguratorDict<{
  learningRate: SliderParamConfigurator;
}>;

export type AutoEncoderDefinition = AlgorithmDefinition<
  NNStep,
  NNConfig,
  AutoEncoderParamConfiguratorDict
>;
