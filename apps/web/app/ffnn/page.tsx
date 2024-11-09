"use client";

import SimulationUI from "@repo/ui/components/custom/SimulationUI";
import Header from "@repo/ui/components/custom/Header";

import { ffnn } from "@repo/simulations/algos/ffnn/ffnn";

export default function FFNNPage() {
  return (
    <>
      <Header title={ffnn.title} />
      <SimulationUI algorithm={ffnn} />
    </>
  );
}
