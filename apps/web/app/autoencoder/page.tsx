"use client";

import { autoencoder } from "@repo/algorithms/impl";
import { Header, VisualisationUI } from "@repo/ui/components";

export default function AutoencoderPage() {
  return (
    <>
      <Header title={autoencoder.title} />
      <VisualisationUI algorithm={autoencoder} />
    </>
  );
}
