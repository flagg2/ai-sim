import { XGBoostDefinition } from "./types";

export const xgboostMeta: XGBoostDefinition["meta"] = {
  slug: "xgboost",
  image: {
    paths: {
      light: "/algos/light/xgboost.png",
      dark: "/algos/dark/xgboost.png",
    },
    alt: "XGBoost",
  },
  title: "XGBoost",
  description:
    "XGBoost (eXtreme Gradient Boosting) is an optimized gradient boosting algorithm. " +
    "It builds an ensemble of decision trees sequentially, where each tree tries to " +
    "correct the errors made by the previous trees.",
  shortDescription: "Powerful tree ensemble learning algorithm.",
  synonyms: ["xgboost", "gradient boosting", "tree ensemble"],
};
