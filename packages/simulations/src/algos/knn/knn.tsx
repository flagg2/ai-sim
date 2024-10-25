import { getKNNConfig } from "./config";
import { getKNNInitialStep } from "./initialStep";
import { paramConfigurators } from "./paramConfigurators";
import { renderKNN } from "./render";
import type { KNNDefinition } from "./types";
import { getKNNSteps } from "./steps";
import { getKnnSceneSetup } from "./scene";

export const knn: KNNDefinition = {
  title: "K-Nearest Neighbors",
  description:
    "KNN is a simple algorithm that is used to classify data points into different categories. It works by finding the k nearest neighbors of a data point and then classifying the data point into the category of the majority of its neighbors.",
  paramConfigurators: paramConfigurators,
  getSceneSetup: getKnnSceneSetup,
  getConfig: getKNNConfig,
  getInitialStep: getKNNInitialStep,
  getSteps: getKNNSteps,
  render: renderKNN,
};
