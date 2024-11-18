import { AutoEncoderDefinition } from "./types";

export const autoencoderMeta: AutoEncoderDefinition["meta"] = {
  slug: "autoencoder",
  image: {
    path: "/algos/autoencoder.png",
    alt: "Autoencoder",
  },
  title: "Autoencoder",
  description:
    "An autoencoder is a type of artificial neural network used to learn efficient codings of unlabeled data.",
  shortDescription: "Neural network for efficient data compression.",
  synonyms: ["autoencoder", "neural networks"],
};
