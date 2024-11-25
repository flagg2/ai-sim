import { SliderParamConfigurator } from "../../lib";
import type { XGBoostDefinition } from "./types";

export const paramConfigurators: XGBoostDefinition["paramConfigurators"] = {
  points: new SliderParamConfigurator({
    label: "Number of Points",
    description: "The number of data points to generate.",
    defaultValue: 20,
    min: 10,
    max: 50,
  }),
  maxDepth: new SliderParamConfigurator({
    label: "Max Tree Depth",
    description: "Maximum depth of each decision tree.",
    defaultValue: 3,
    min: 1,
    max: 5,
  }),
  numTrees: new SliderParamConfigurator({
    label: "Number of Trees",
    description: "Number of trees in the ensemble.",
    defaultValue: 3,
    min: 1,
    max: 5,
  }),
  learningRate: new SliderParamConfigurator({
    label: "Learning Rate",
    description: "Learning rate for the gradient boosting algorithm.",
    defaultValue: 0.1,
    min: 0.01,
    max: 0.5,
  }),
};
