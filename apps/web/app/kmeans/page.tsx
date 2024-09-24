"use client";

import { useState } from "react";
import { useKMeans } from "@repo/simulations/hooks/useKMeans";
import SimulationUI from "@repo/ui/components/custom/SimulationUI";
import { Slider } from "@repo/ui/components/shadcn/slider";
import { Label } from "@repo/ui/components/custom/Label";
import Header from "@repo/ui/components/custom/Header";
import KMeansVisualization from "./algo";

export default function KMeansPage() {
  const [running, setRunning] = useState(false);

  const [numberOfPoints, setNumberOfPoints] = useState(10);
  const [k, setK] = useState(3);
  const [maxIterations, setMaxIterations] = useState(10);

  const kmeans = useKMeans({
    numberOfPoints,
    k,
    maxIterations,
  });

  return (
    <>
      <Header title="K-Means Clustering" />
      <SimulationUI
        simulation={kmeans}
        canvasComponent={<KMeansVisualization kmeans={kmeans} />}
        configComponent={
          <KMeansConfig
            k={k}
            maxIterations={maxIterations}
            numberOfPoints={numberOfPoints}
            onNumberOfPointsChange={setNumberOfPoints}
            onMaxIterationsChange={setMaxIterations}
            onKChange={setK}
          />
        }
        started={running}
        onStart={() => setRunning(true)}
        onStop={() => setRunning(false)}
        algorithmDescription="
      K-means is an unsupervised learning algorithm that partitions a dataset into K clusters. It works by iteratively assigning points to the nearest centroid and then updating the centroids based on the mean of the assigned points.
      "
      />
    </>
  );
}

type KMeansConfigProps = {
  k: number;
  numberOfPoints: number;
  maxIterations: number;
  onNumberOfPointsChange: (numberOfPoints: number) => void;
  onKChange: (k: number) => void;
  onMaxIterationsChange: (maxIterations: number) => void;
};

function KMeansConfig({
  k,
  numberOfPoints,
  maxIterations,
  onNumberOfPointsChange,
  onKChange,
  onMaxIterationsChange,
}: KMeansConfigProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label label="Number of points" info="The number of points to generate">
        <Slider
          value={[numberOfPoints]}
          onValueChange={(value) => onNumberOfPointsChange(value[0]!)}
          min={1}
          max={100}
          step={1}
        />
        <div className="text-xs text-darkish-text">{numberOfPoints}</div>
      </Label>
      <Label label="K" info="The number of clusters to create">
        <Slider
          value={[k]}
          onValueChange={(value) => onKChange(value[0]!)}
          min={2}
          max={10}
          step={1}
        />
        <div className="text-xs text-darkish-text">{k}</div>
      </Label>
      <Label label="Max Iterations" info="Maximum number of iterations">
        <Slider
          value={[maxIterations]}
          onValueChange={(value) => onMaxIterationsChange(value[0]!)}
          min={1}
          max={50}
          step={1}
        />
        <div className="text-xs text-darkish-text">{maxIterations}</div>
      </Label>
    </div>
  );
}
