"use client";

import dynamic from "next/dynamic";
import {
  Header,
  Visualization,
  VisualizationSkeleton,
} from "@repo/ui/components";

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
          <>
            <Header title={algorithm.default.meta.title} />
            <Visualization algorithm={algorithm.default} />
          </>
        );
      }),
    {
      ssr: true,
      loading: () => <VisualizationSkeleton />,
    },
  );

  return <DynamicVisualisation />;
}
