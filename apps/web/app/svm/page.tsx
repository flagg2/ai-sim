"use client";

import { svm } from "@repo/algorithms/impl";
import { Header, VisualisationUI } from "@repo/ui/components";

export default function SVMPage() {
  return (
    <>
      <Header title={svm.title} />
      <VisualisationUI algorithm={svm} />
    </>
  );
}
