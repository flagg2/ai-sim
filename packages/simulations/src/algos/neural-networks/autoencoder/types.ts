import type { ParamConfiguratorDict } from "../../common/paramConfigurators/param";
import type { SliderParamConfigurator } from "../../common/paramConfigurators/slider";
import type { AlgorithmDefinition, Step } from "../../common/types";
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
