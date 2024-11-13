import type { ParamConfiguratorDict } from "@repo/simulations/lib/param-configurators/param";
import type { NNConfig } from "../types";
import type { NNStep } from "../types";
import type { SliderParamConfigurator } from "@repo/simulations/lib/param-configurators/slider";
import type { AlgorithmDefinition } from "@repo/simulations/lib/types";

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
