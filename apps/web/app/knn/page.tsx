"use client";

import { useState } from "react";
import { useKNN } from "@repo/simulations/hooks/useKNN";
import SimulationUI from "@repo/ui/components/custom/SimulationUI";
import { Slider } from "@repo/ui/components/shadcn/slider";
import { Label } from "@repo/ui/components/custom/Label";
import Header from "@repo/ui/components/custom/Header";
import Renderer from "./render";
import { renderKNN } from "@repo/simulations/algos/knn";

export default function KNNPage() {
  const [numberOfPoints, setNumberOfPoints] = useState(10);
  const [k, setK] = useState(3);
  const [groupCount, setGroupCount] = useState(2);

  const knn = useKNN({
    numberOfPoints,
    k,
    groupCount,
  });

  return (
    <>
      <Header title="K-Nearest Neighbors" />
      <SimulationUI
        simulation={knn}
        sceneContent={<Renderer simulation={knn} renderFn={renderKNN} />}
        configComponent={
          <KNNConfig
            k={k}
            groupCount={groupCount}
            numberOfPoints={numberOfPoints}
            onNumberOfPointsChange={setNumberOfPoints}
            onGroupCountChange={setGroupCount}
            onKChange={setK}
          />
        }
        algorithmDescription="
      KNN is a simple algorithm that is used to classify data points into different categories. It works by finding the k nearest neighbors of a data point and then classifying the data point into the category of the majority of its neighbors.
      "
      />
    </>
  );
}

type KNNConfigProps = {
  k: number;
  numberOfPoints: number;
  groupCount: number;
  onNumberOfPointsChange: (numberOfPoints: number) => void;
  onKChange: (k: number) => void;
  onGroupCountChange: (groupCount: number) => void;
};

function KNNConfig({
  k,
  numberOfPoints,
  groupCount,
  onNumberOfPointsChange,
  onKChange,
  onGroupCountChange,
}: KNNConfigProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label label="Number of points" info="The number of points to generate">
        <Slider
          value={[numberOfPoints]}
          onValueChange={(value) => onNumberOfPointsChange(value[0]!)}
          min={1}
          max={20}
          step={1}
        />
        <div className="text-xs text-darkish-text">{numberOfPoints}</div>
      </Label>
      <Label label="K" info="The number of nearest neighbors to consider">
        <Slider
          value={[k]}
          onValueChange={(value) => onKChange(value[0]!)}
          min={1}
          max={10}
          step={1}
        />
        <div className="text-xs text-darkish-text">{k}</div>
      </Label>
      <Label label="Group count" info="The number of groups to create">
        <Slider
          value={[groupCount]}
          onValueChange={(value) => onGroupCountChange(value[0]!)}
          min={1}
          max={10}
          step={1}
        />
        <div className="text-xs text-darkish-text">{groupCount}</div>
      </Label>
    </div>
  );
}
