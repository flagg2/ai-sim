import { KMeansDefinition } from "./types";

export const kmeansMeta: KMeansDefinition["meta"] = {
  slug: "kmeans",
  image: {
    paths: {
      light: "/algos/light/kmeans.png",
      dark: "/algos/dark/kmeans.png",
    },
    alt: "K-Means",
  },
  title: "K-Means",
  description:
    "K-means is a machine learning algorithm that separates a dataset into K clusters.",
  shortDescription: "Partition data into clusters based on similarity.",
  keywords: ["kmeans", "clustering"],
};
