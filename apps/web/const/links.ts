import kmeans from "~/assets/kmeans.png";
import linearRegression from "~/assets/linear-regression.png";
import autoencoder from "~/assets/autoencoder.png";
import ffnn from "~/assets/ffnn.png";
import svm from "~/assets/svm.png";

export const links = [
  {
    href: "/xgboost",
    src: svm,
    alt: "XGBoost",
    title: "XGBoost",
    description: "Powerful tree-based ensemble learning algorithm.",
    synonyms: ["xgboost", "gradient boosting", "decision trees"],
  },
  {
    href: "/kmeans",
    src: kmeans,
    alt: "K-Means",
    title: "K-Means",
    description: "Partition data into clusters based on similarity.",
    synonyms: ["kmeans", "clustering"],
  },
  {
    href: "/linear-regression",
    src: linearRegression,
    alt: "Linear Regression",
    title: "Linear Regression",
    description: "Find the best-fitting line through data points.",
    synonyms: ["linear regression", "regression"],
  },
  {
    href: "/autoencoder",
    src: autoencoder,
    alt: "Autoencoder",
    title: "Autoencoder",
    description: "Neural network for efficient data compression.",
    synonyms: ["autoencoder", "neural networks"],
  },
  {
    href: "/ffnn",
    src: ffnn,
    alt: "Feedforward Neural Network",
    title: "Feedforward Neural Network",
    description: "Basic neural network for pattern recognition.",
    synonyms: ["neural network", "neural networks", "ffnn"],
  },
  {
    href: "/svm",
    src: svm,
    alt: "Support Vector Machine",
    title: "Support Vector Machine",
    description: "Optimal boundary classifier for datasets.",
    synonyms: ["svm"],
  },
];
