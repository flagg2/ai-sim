"use client";

import dynamic from "next/dynamic";
import {
  Header,
  VisualisationUI,
  VisualisationUISkeleton,
} from "@repo/ui/components";
import { Suspense } from "react";

interface AlgorithmClientProps {
  params: { algorithm: string };
}

export default function AlgorithmClient({ params }: AlgorithmClientProps) {
  const DynamicVisualisationUI = dynamic(
    () =>
      import(
        `../../../../packages/algorithms/src/impl/${params.algorithm}/${params.algorithm}`
      ).then(async (algorithm) => {
        return (props: any) => (
          <VisualisationUI {...props} algorithm={algorithm.default} />
        );
      }),
    {
      ssr: true,
      loading: () => <VisualisationUISkeleton />,
    },
  );

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Header title="Algorithm Visualisation" />
        <DynamicVisualisationUI params={params} />
      </Suspense>
    </>
  );
}
