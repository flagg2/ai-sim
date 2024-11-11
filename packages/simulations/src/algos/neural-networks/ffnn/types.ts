import type { ParamConfiguratorDict } from "../../common/paramConfigurators/param";
import type { SliderParamConfigurator } from "../../common/paramConfigurators/slider";
import type { AlgorithmDefinition, Step } from "../../common/types";
import type { NNConfig } from "../types";
import type { NNStep } from "../types";

type FFNNParamConfiguratorDict = ParamConfiguratorDict<{
  firstInputValue: SliderParamConfigurator;
  secondInputValue: SliderParamConfigurator;
  learningRate: SliderParamConfigurator;
}>;

export type FFNNDefinition = AlgorithmDefinition<
  NNStep,
  NNConfig,
  FFNNParamConfiguratorDict
>;
