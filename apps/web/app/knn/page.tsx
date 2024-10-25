"use client";

import SimulationUI from "@repo/ui/components/custom/SimulationUI";
import Header from "@repo/ui/components/custom/Header";

import { knn } from "@repo/simulations/algos/knn/knn";

// TODO: KNN Ignores one point, most evident when few points are present

export default function KNNPage() {
  return (
    <>
      <Header title={knn.title} />
      {/* TODO: fix type error (even though it doesnt make much sense to me) */}
      <SimulationUI algorithm={knn} />
    </>
  );
}
