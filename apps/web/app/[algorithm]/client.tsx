"use client";

import dynamic from "next/dynamic";
import {
  Header,
  Visualisation,
  VisualisationSkeleton,
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
        return () => <Visualisation algorithm={algorithm.default} />;
      }),
    {
      ssr: true,
      loading: () => <VisualisationSkeleton />,
    },
  );

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header title="Algorithm Visualisation" />
        <DynamicVisualisation />
      </Suspense>
    </>
  );
}
