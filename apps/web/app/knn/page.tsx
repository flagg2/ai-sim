"use client";

import { useControls } from "leva";
import { useState } from "react";
import KNNVisualization from "./algo";
import { useKNN } from "@repo/simulations/hooks/useKNN";
import SimulationUI from "@repo/ui/components/custom/SimulationUI";

export default function KNNPage() {
  const [running, setRunning] = useState(false);

  const { numberOfPoints, k } = useControls({
    numberOfPoints: {
      value: 10,
      min: 1,
      max: 20,
      step: 1,
    },
    k: {
      value: 3,
      min: 1,
      max: 10,
      step: 1,
    },
  });

  const knn = useKNN({
    numberOfPoints,
    k,
  });

  if (!running) {
    return <button onClick={() => setRunning(true)}>Start</button>;
  }

  return (
    <SimulationUI
      useSimulation={knn}
      canvasComponent={<KNNVisualization state={knn.state} />}
      configComponent={<div>Config</div>}
      running={running}
      onRun={() => setRunning(true)}
      onStop={() => setRunning(false)}
    />
  );
}
