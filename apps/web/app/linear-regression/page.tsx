"use client";

import SimulationUI from "@repo/ui/components/custom/SimulationUI";
import Header from "@repo/ui/components/custom/Header";

import { linearRegression } from "@repo/simulations/algos/linear-regression/linear-regression";

export default function LinearRegressionPage() {
  return (
    <>
      <Header title={linearRegression.title} />
      <SimulationUI algorithm={linearRegression} />
    </>
  );
}
