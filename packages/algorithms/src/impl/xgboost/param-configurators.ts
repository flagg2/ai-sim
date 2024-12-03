import { SliderParamConfigurator } from "../../lib";
import type { XGBoostDefinition } from "./types";

export const xgboostParamConfigurators: XGBoostDefinition["paramConfigurators"] =
  {
    points: new SliderParamConfigurator({
      label: "Number of Points",
      description: "The number of data points to generate for each class",
      defaultValue: 50,
      min: 10,
      max: 200,
    }),

    learningRate: new SliderParamConfigurator({
      label: "Learning Rate",
      description:
        "How much each tree contributes to the final prediction (smaller values = more conservative learning)",
      defaultValue: 0.05,
      min: 0.01,
      max: 0.3,
      step: 0.01,
    }),

    maxDepth: new SliderParamConfigurator({
      label: "Max Tree Depth",
      description:
        "Maximum depth of each decision tree (controls model complexity)",
      defaultValue: 4,
      min: 2,
      max: 10,
      step: 1,
    }),

    numTrees: new SliderParamConfigurator({
      label: "Number of Trees",
      description: "Total number of trees to build in the ensemble",
      defaultValue: 50,
      min: 10,
      max: 100,
      step: 5,
    }),
  };
