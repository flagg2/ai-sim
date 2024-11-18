import { getKMeansConfig } from "./config";
import { getKMeansInitialStep } from "./initial-step";
import { paramConfigurators } from "./param-configurators";
import { renderKMeans } from "./render";
import type { KMeansDefinition } from "./types";
import { getKMeansSteps } from "./steps";
import { kmeansMeta } from "./meta";

const kmeans: KMeansDefinition = {
  meta: kmeansMeta,
  paramConfigurators: paramConfigurators,
  getSceneSetup: () => ({
    dimension: "3D",
  }),
  getConfig: getKMeansConfig,
  getInitialStep: getKMeansInitialStep,
  getSteps: getKMeansSteps,
  render: renderKMeans,
};

export default kmeans;
