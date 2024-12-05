import { SliderParamConfigurator } from "../../lib";
import type { KMeansDefinition } from "./types";

export const paramConfigurators: KMeansDefinition["paramConfigurators"] = {
  points: new SliderParamConfigurator({
    label: "Number of Points",
    description: "The number of points to cluster.",
    defaultValue: 30,
    min: 3,
    max: 100,
  }),
  k: new SliderParamConfigurator({
    label: "K",
    description: "The number of clusters to create.",
    defaultValue: 3,
    min: 2,
    max: 10,
  }),
  maxIterations: new SliderParamConfigurator({
    label: "Max Iterations",
    description: "Maximum number of iterations.",
    defaultValue: 10,
    min: 1,
    max: 50,
  }),
};
