"use client";

import { kmeans } from "@repo/algorithms/impl";
import { Header, VisualisationUI } from "@repo/ui/components";

export default function KMeansPage() {
  return (
    <>
      <Header title={kmeans.title} />
      <VisualisationUI algorithm={kmeans} />
    </>
  );
}
