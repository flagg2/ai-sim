import type { NNConfig } from "../types";
import type { NNStep } from "../types";
import type { ParamConfiguratorDict } from "@repo/simulations/lib/param-configurators/param";
import type { SliderParamConfigurator } from "@repo/simulations/lib/param-configurators/slider";
import type { AlgorithmDefinition } from "@repo/simulations/lib/types";

type AutoEncoderParamConfiguratorDict = ParamConfiguratorDict<{
  learningRate: SliderParamConfigurator;
}>;

export type AutoEncoderDefinition = AlgorithmDefinition<
  NNStep,
  NNConfig,
  AutoEncoderParamConfiguratorDict
>;
