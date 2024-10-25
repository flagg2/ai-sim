import { SliderParamConfigurator } from "../paramConfigurators/slider";
import type { KNNDefinition } from "./types";

export const paramConfigurators: KNNDefinition["paramConfigurators"] = {
  points: new SliderParamConfigurator({
    label: "Number of Points",
    description: "The number of points in the dataset.",
    defaultValue: 10,
    min: 3,
    max: 50,
  }),
  groups: new SliderParamConfigurator({
    label: "Number of Groups",
    description: "The number of groups in the dataset.",
    defaultValue: 3,
    min: 3,
    max: 10,
  }),
  k: new SliderParamConfigurator({
    label: "K",
    description: "The number of nearest neighbors to consider.",
    defaultValue: 3,
    min: 1,
    max: 10,
  }),
};
