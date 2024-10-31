import { getKMeansConfig } from "./config";
import { getKMeansInitialStep } from "./initialStep";
import { paramConfigurators } from "./paramConfigurators";
import { renderKMeans } from "./render";
import type { KMeansDefinition } from "./types";
import { getKMeansSteps } from "./steps";
import { getKMeansSceneSetup } from "./scene";

export const kmeans: KMeansDefinition = {
  title: "K-Means Clustering",
  description:
    "K-means is an unsupervised learning algorithm that partitions a dataset into K clusters. It works by iteratively assigning points to the nearest centroid and then updating the centroids based on the mean of the assigned points.",
  paramConfigurators: paramConfigurators,
  getSceneSetup: getKMeansSceneSetup,
  getConfig: getKMeansConfig,
  getInitialStep: getKMeansInitialStep,
  getSteps: getKMeansSteps,
  render: renderKMeans,
};
