import type { NNDefinition } from "./types";

export const getNNInitialStep: NNDefinition["getInitialStep"] = (config) => {
  return {
    type: "initial",
    title: "Initial State",
    description: (
      <div>
        We will follow how a signal propagates through the neural network,
        starting from the input layer.
      </div>
    ),
    state: {
      currentLayer: 0,
      currentNeuron: 0,
      neurons: config.neurons,
      connections: config.connections,
      highlightedConnectionIds: [],
      highlightedNeuronIds: config.neurons
        .filter((n) => n.layer === 0)
        .map((n) => n.id),
    },
  };
};
