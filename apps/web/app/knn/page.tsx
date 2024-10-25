"use client";

import { useKNN } from "@repo/simulations/hooks/useKNN";
import SimulationUI from "@repo/ui/components/custom/SimulationUI";
import Header from "@repo/ui/components/custom/Header";
import Renderer from "./render";
import { renderKNN } from "@repo/simulations/algos/knn";
import { SliderParamConfigurator } from "@repo/simulations/algos/paramConfigurators/slider";
// TODO: import doesnt work with tsx ext from hooks directory for some odd reason
import { useParamConfigurator } from "@repo/ui/components/custom/useParamConfigurator";
import { knn } from "@repo/simulations/algos/knn/knn";

export default function KNNPage() {
  const { state, Configurator } = useParamConfigurator(knn.paramConfigurators);

  const knnSimulation = useKNN(state);

  return (
    <>
      <Header title="K-Nearest Neighbors" />
      <SimulationUI
        simulation={knnSimulation}
        sceneContent={
          <Renderer simulation={knnSimulation} renderFn={renderKNN} />
        }
        configComponent={Configurator}
        algorithmDescription="
      KNN is a simple algorithm that is used to classify data points into different categories. It works by finding the k nearest neighbors of a data point and then classifying the data point into the category of the majority of its neighbors.
      "
      />
    </>
  );
}
