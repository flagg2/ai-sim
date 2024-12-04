import {
  SelectParamConfigurator,
  SliderParamConfigurator,
  SwitchParamConfigurator,
} from "../../lib";
import type { SVMDefinition } from "./types";

export const paramConfigurators: SVMDefinition["paramConfigurators"] = {
  points: new SliderParamConfigurator({
    label: "Number of Points",
    description: "The number of data points to generate for each class.",
    defaultValue: 20,
    min: 5,
    max: 100,
  }),
  generateRadialData: new SwitchParamConfigurator({
    label: "Generate Radial Data",
    description:
      "Whether to generate radial data. If true, you most likely want to use a non linear kernel",
    defaultValue: false,
  }),
  kernelType: new SelectParamConfigurator({
    label: "Kernel Type",
    description: "The kernel type to use for the SVM.",
    defaultValue: "rbf",
    options: ["rbf", "linear"],
  }),
};
