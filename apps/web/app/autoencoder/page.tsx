"use client";

import SimulationUI from "@repo/ui/components/custom/SimulationUI";
import Header from "@repo/ui/components/custom/Header";

import { autoencoder } from "@repo/simulations/algos/neural-networks/autoencoder/autoencoder";

export default function AutoencoderPage() {
  return (
    <>
      <Header title={autoencoder.title} />
      <SimulationUI algorithm={autoencoder} />
    </>
  );
}
