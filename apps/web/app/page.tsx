"use client";

import { useControls } from "leva";
import { useState } from "react";
import Algo from "./algo";

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

  if (!running) {
    return <button onClick={() => setRunning(true)}>Start</button>;
  }

  return (
    <>
      <button onClick={() => setRunning(false)}>Stop</button>
      <Algo numberOfPoints={numberOfPoints} k={k} />
    </>
  );
}
