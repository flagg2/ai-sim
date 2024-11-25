import { autoencoderMeta } from "./autoencoder/meta";
import { ffnnMeta } from "./ffnn/meta";
import { kmeansMeta } from "./kmeans/meta";
import { linearRegressionMeta } from "./linear-regression/meta";
import { svmMeta } from "./svm/meta";
import { xgboostMeta } from "./xgboost/meta";

// These are the algorithms, which will be rendered on the landing page.
// It is assumed that there is a folder for each algorithm with called {slug}
// which contains a {slug}.tsx file. The file should export a default constant
// which implements the AlgorithmDefinition interface.

export const meta = [
  kmeansMeta,
  linearRegressionMeta,
  svmMeta,
  ffnnMeta,
  autoencoderMeta,
  xgboostMeta,
];
