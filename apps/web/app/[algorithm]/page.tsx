import { meta } from "@repo/algorithms/impl";
import AlgorithmClient from "./client";

export async function generateStaticParams() {
  return meta.map((item) => ({ algorithm: item.slug }));
}

export default function AlgorithmPage({
  params,
}: {
  params: { algorithm: string };
}) {
  return <AlgorithmClient params={params} />;
}
