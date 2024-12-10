import { SVMDefinition } from "./types";

export const svmMeta: SVMDefinition["meta"] = {
  slug: "svm",
  image: {
    paths: {
      light: "/algos/light/svm.png",
      dark: "/algos/dark/svm.png",
    },
    alt: "Support Vector Machine",
  },
  title: "Support Vector Machine",
  description:
    "A support vector machine is a machine learning algorithm that helps classify data by finding the best boundary to separate different categories.",
  shortDescription: "Classify data points with decision boundaries.",
  synonyms: ["svm", "support vector machine"],
};
