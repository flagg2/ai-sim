"use client";

import { useKNN } from "@repo/simulations/hooks/useKNN";
import SimulationUI from "@repo/ui/components/custom/SimulationUI";
import Header from "@repo/ui/components/custom/Header";
import Renderer from "./render";
import { renderKNN } from "@repo/simulations/algos/knn";
import { SliderParam } from "@repo/simulations/algos/params/slider";
// TODO: import doesnt work with tsx ext from hooks directory for some odd reason
import { useParamConfigurator } from "@repo/ui/components/custom/useParamConfigurator";

export default function KNNPage() {
  const { state, Configurator } = useParamConfigurator({
    numberOfPoints: new SliderParam({
      label: "Number of points",
      description: "The number of points to generate",
      defaultValue: 10,
      min: 1,
      max: 20,
      step: 1,
    }),
    k: new SliderParam({
      label: "K",
      description: "The number of nearest neighbors to consider",
      defaultValue: 3,
      min: 1,
      max: 10,
      step: 1,
    }),
    groupCount: new SliderParam({
      label: "Group count",
      description: "The number of groups to create",
      defaultValue: 2,
      min: 1,
      max: 10,
      step: 1,
    }),
  });

  const knn = useKNN(state);

  return (
    <>
      <Header title="K-Nearest Neighbors" />
      <SimulationUI
        simulation={knn}
        sceneContent={<Renderer simulation={knn} renderFn={renderKNN} />}
        configComponent={Configurator}
        algorithmDescription="
      KNN is a simple algorithm that is used to classify data points into different categories. It works by finding the k nearest neighbors of a data point and then classifying the data point into the category of the majority of its neighbors.
      "
      />
    </>
  );
}
