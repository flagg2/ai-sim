import { SliderParamConfigurator } from "../common/paramConfigurators/slider";
import { SwitchParamConfigurator } from "../common/paramConfigurators/switch";
import type { SVMDefinition } from "./types";

export const paramConfigurators: SVMDefinition["paramConfigurators"] = {
  points: new SliderParamConfigurator({
    label: "Number of Points",
    description: "The number of data points to generate for each class.",
    defaultValue: 15,
    min: 5,
    max: 50,
  }),
  useRadialData: new SwitchParamConfigurator({
    label: "Showcase Kernel Trick",
    description:
      "Generate data that demonstrates the power of the kernel trick.",
    defaultValue: true,
  }),
};
