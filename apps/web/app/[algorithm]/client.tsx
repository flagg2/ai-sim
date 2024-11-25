"use client";

import dynamic from "next/dynamic";
import {
  Header,
  Visualization,
  VisualizationSkeleton,
} from "@repo/ui/components";
import { Suspense } from "react";

interface AlgorithmClientProps {
  params: { algorithm: string };
}

export default function AlgorithmClient({ params }: AlgorithmClientProps) {
  const DynamicVisualisation = dynamic(
    () =>
      import(
        `../../../../packages/algorithms/src/impl/${params.algorithm}/${params.algorithm}`
      ).then(async (algorithm) => {
        return () => <Visualization algorithm={algorithm.default} />;
      }),
    {
      ssr: true,
      loading: () => <VisualizationSkeleton />,
    },
  );

  return (
    <>
      <Header title="Algorithm Visualisation" />
      <DynamicVisualisation />
    </>
  );
}
