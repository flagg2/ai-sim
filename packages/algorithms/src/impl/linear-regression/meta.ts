import { LinearRegressionDefinition } from "./types";

export const linearRegressionMeta: LinearRegressionDefinition["meta"] = {
  slug: "linear-regression",
  image: {
    paths: {
      light: "/algos/light/linear-regression.png",
      dark: "/algos/dark/linear-regression.png",
    },
    alt: "Linear Regression",
  },
  title: "Linear Regression",
  description:
    "Linear regression is a statistical method used to model the relationship between a dependent variable and one or more independent variables.",
  shortDescription: "Find the best-fitting line through data points.",
  synonyms: ["linear regression", "regression"],
};
