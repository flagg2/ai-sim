import { SliderParamConfigurator } from "@repo/simulations/lib/param-configurators/slider";
import type { FFNNDefinition } from "./types";

export const ffnnParamConfigurators: FFNNDefinition["paramConfigurators"] = {
  firstInputValue: new SliderParamConfigurator({
    label: "First input value",
    description: "The first input value for the network",
    defaultValue: 0.8,
    min: 0,
    max: 1,
    step: 0.1,
  }),
  secondInputValue: new SliderParamConfigurator({
    label: "Second input value",
    description: "The second input value for the network",
    defaultValue: 0.4,
    min: 0,
    max: 1,
    step: 0.1,
  }),
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
