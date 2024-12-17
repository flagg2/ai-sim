"use client";

import dynamic from "next/dynamic";
import {
  Header,
  Visualization,
  VisualizationSkeleton,
} from "@repo/ui/components";
import { HeaderSkeleton } from "../../../../packages/ui/src/components/custom/general/header";

interface AlgorithmClientProps {
  params: { algorithm: string };
}

export default function AlgorithmClient({ params }: AlgorithmClientProps) {
  const DynamicVisualisation = dynamic(
    () =>
      import(
        `../../../../packages/algorithms/src/impl/${params.algorithm}/${params.algorithm}`
      ).then(async (algorithm) => {
        return () => (
          <div className="h-screen">
            <Header title={algorithm.default.meta.title} />
            <Visualization algorithm={algorithm.default} />
          </div>
        );
      }),
    {
      ssr: true,
      loading: () => (
        <>
          <HeaderSkeleton />
          <VisualizationSkeleton />
        </>
      ),
    },
  );

  return <DynamicVisualisation />;
}
