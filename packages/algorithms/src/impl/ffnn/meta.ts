import { FFNNDefinition } from "./types";

export const ffnnMeta: FFNNDefinition["meta"] = {
  slug: "ffnn",
  image: {
    paths: {
      light: "/algos/light/ffnn.png",
      dark: "/algos/dark/ffnn.png",
    },
    alt: "Feedforward Neural Network",
  },
  title: "Feedforward Neural Network",
  description:
    "A feedforward neural network is a type of artificial neural network where the connections between the nodes do not form any cycles.",
  shortDescription: "Basic neural network for pattern recognition.",
  keywords: ["neural network", "neural networks", "ffnn"],
};
