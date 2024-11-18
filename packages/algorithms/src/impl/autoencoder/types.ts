import {
  AlgorithmDefinition,
  ParamConfiguratorDict,
  SliderParamConfigurator,
} from "../../lib";
import type { NNConfig } from "../neural-networks/types";
import type { NNStep } from "../neural-networks/types";

type AutoEncoderParamConfiguratorDict = ParamConfiguratorDict<{
  learningRate: SliderParamConfigurator;
}>;

export type AutoEncoderDefinition = AlgorithmDefinition<
  NNStep,
  NNConfig,
  AutoEncoderParamConfiguratorDict
>;
