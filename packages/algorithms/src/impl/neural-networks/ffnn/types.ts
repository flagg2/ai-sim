import type { NNConfig } from "../types";
import type { NNStep } from "../types";
import type { SliderParamConfigurator } from "@repo/algorithms/lib/param-configurators/slider";
import type {
  AlgorithmDefinition,
  ParamConfiguratorDict,
} from "@repo/algorithms/lib/types";

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
