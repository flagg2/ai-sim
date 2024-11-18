import { AlgorithmDefinition, SliderParamConfigurator } from "../../lib";
import { ParamConfiguratorDict } from "../../lib";
import type { NNConfig } from "../neural-networks/types";
import type { NNStep } from "../neural-networks/types";

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
