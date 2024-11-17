"use client";

import { linearRegression } from "@repo/algorithms/impl";
import { Header, VisualisationUI } from "@repo/ui/components";

export default function LinearRegressionPage() {
  return (
    <>
      <Header title={linearRegression.title} />
      <VisualisationUI algorithm={linearRegression} />
    </>
  );
}
