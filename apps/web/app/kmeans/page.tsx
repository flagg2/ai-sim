"use client";

import SimulationUI from "@repo/ui/components/custom/SimulationUI";
import Header from "@repo/ui/components/custom/Header";

import { kmeans } from "@repo/simulations/algos/kmeans/kmeans";

export default function KMeansPage() {
  return (
    <>
      <Header title={kmeans.title} />
      <SimulationUI algorithm={kmeans} />
    </>
  );
}
