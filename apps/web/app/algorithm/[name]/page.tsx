"use client";

import SimulationUI from "@repo/ui/components/custom/SimulationUI";
import Header from "@repo/ui/components/custom/Header";
import { notFound } from "next/navigation";
import { loadAlgorithm } from "~/lib/utils/loadAlgorithm";

export async function getStaticPaths() {}

export default async function AlgorithmPage({
  params,
}: {
  params: { name: string };
}) {
  const algorithm = await loadAlgorithm(params.name);

  if (!algorithm) {
    notFound();
  }

  return (
    <>
      <Header title={algorithm.title} />
      <SimulationUI algorithmKey={algorithm} />
    </>
  );
}
