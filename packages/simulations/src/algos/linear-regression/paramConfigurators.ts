import { SliderParamConfigurator } from "../common/paramConfigurators/slider";
import type { LinearRegressionDefinition } from "./types";

export const paramConfigurators: LinearRegressionDefinition["paramConfigurators"] =
  {
    points: new SliderParamConfigurator({
      label: "Number of Points",
      description: "The number of data points to fit.",
      defaultValue: 20,
      min: 3,
      max: 100,
    }),
    noise: new SliderParamConfigurator({
      label: "Noise Level",
      description: "Amount of random variation in the data points.",
      defaultValue: 0.3,
      min: 0,
      max: 1,
      step: 0.1,
    }),
    heightScale: new SliderParamConfigurator({
      label: "Height Scale",
      description: "Controls how much the line rises vertically.",
      defaultValue: 80,
      min: 0,
      max: 200,
    }),
  };
