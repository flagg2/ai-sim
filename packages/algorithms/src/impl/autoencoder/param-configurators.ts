import { SliderParamConfigurator } from "@repo/algorithms/lib";
import type { AutoEncoderDefinition } from "./types";

export const autoEncoderParamConfigurators: AutoEncoderDefinition["paramConfigurators"] =
  {
    learningRate: new SliderParamConfigurator({
      label: "Learning rate",
      description:
        "The learning rate for the network. This number is usually relatively low, but is by default set very high for a more visible change during backpropagation",
      min: 0,
      max: 20,
      step: 0.1,
      defaultValue: 10,
    }),
  };
