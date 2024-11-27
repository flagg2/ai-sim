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
    "K-means is an unsupervised learning algorithm that separates a dataset into K clusters. It works by iteratively assigning points to the nearest centroid and then updating the centroids based on the mean of the assigned points.",
  shortDescription: "Partition data into clusters based on similarity.",
  synonyms: ["kmeans", "clustering"],
};
