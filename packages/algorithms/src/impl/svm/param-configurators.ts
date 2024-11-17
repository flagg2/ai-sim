import { SliderParamConfigurator } from "../../lib";
import type { SVMDefinition } from "./types";

export const paramConfigurators: SVMDefinition["paramConfigurators"] = {
  points: new SliderParamConfigurator({
    label: "Number of Points",
    description: "The number of data points to generate for each class.",
    defaultValue: 15,
    min: 5,
    max: 50,
  }),
};
