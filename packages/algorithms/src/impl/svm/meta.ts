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
    "A support vector machine is a type of supervised learning algorithm used for classification and regression analysis.",
  shortDescription: "Classify data points with decision boundaries.",
  synonyms: ["svm", "support vector machine"],
};
