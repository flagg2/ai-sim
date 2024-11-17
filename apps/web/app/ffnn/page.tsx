"use client";

import { ffnn } from "@repo/algorithms/impl";
import { Header, VisualisationUI } from "@repo/ui/components";

export default function FFNNPage() {
  return (
    <>
      <Header title={ffnn.title} />
      <VisualisationUI algorithm={ffnn} />
    </>
  );
}
