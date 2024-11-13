import { SliderParamConfigurator } from "@repo/simulations/lib/param-configurators/slider";
import type { AutoEncoderDefinition } from "./types";

export const autoEncoderParamConfigurators: AutoEncoderDefinition["paramConfigurators"] =
  {
    learningRate: new SliderParamConfigurator({
      label: "Learning rate",
      description:
        "The learning rate for the network. This number is usually relatively low, but you might want to bump it up for a more visible change during backpropagation",
      min: 0,
      max: 10,
      step: 0.1,
      defaultValue: 0.2,
    }),
  };
