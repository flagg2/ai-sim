import type { Neuron, Connection } from "../types";
import type { FFNNDefinition } from "./types";

export const getFFNNConfig: FFNNDefinition["getConfig"] = (params) => {
  const { firstInputValue, learningRate, secondInputValue } = params;
  const { layers, neuronsPerLayer, inputSize, outputSize, targetValues } = {
    layers: 1,
    neuronsPerLayer: 5,
    inputSize: 2,
    outputSize: 1,
    targetValues: [0.8],
  };

  const activations = [firstInputValue, secondInputValue];

  const neurons = generateNeurons(
    layers,
    neuronsPerLayer,
    inputSize,
    outputSize,
    activations,
  );
  const connections = generateConnections(neurons);

  return {
    layers,
    neuronsPerLayer,
    inputSize,
    outputSize,
    neurons,
    connections,
    learningRate,
    targetValues,
  };
};

let id = 0;
function getNextId() {
  return (id++).toString();
}

function generateNeurons(
  layers: number,
  neuronsPerLayer: number,
  inputSize: number,
  outputSize: number,
  activations: number[],
): Neuron[] {
  const neurons: Neuron[] = [];
  // Input layer
  for (let i = 0; i < inputSize; i++) {
    const activation = activations[i];
    neurons.push({
      id: getNextId(),
      layer: 0,
      index: i,
      value: activation, // Random initial input
      activation: activation, // For input layer, value = activation
      bias: 0,
    });
  }

  // Hidden layers
  for (let layer = 1; layer <= layers; layer++) {
    for (let i = 0; i < neuronsPerLayer; i++) {
      neurons.push({
        id: getNextId(),
        layer,
        index: i,
        value: 0,
        activation: 0,
        bias: 0,
      });
    }
  }

  // Output layer
  for (let i = 0; i < outputSize; i++) {
    neurons.push({
      id: getNextId(),
      layer: layers + 1,
      index: i,
      value: 0,
      activation: 0,
      bias: 0,
    });
  }

  return neurons;
}

function generateConnections(neurons: Neuron[]): Connection[] {
  const connections: Connection[] = [];
  const layerMap = new Map<number, Neuron[]>();

  // Group neurons by layer
  neurons.forEach((neuron) => {
    if (!layerMap.has(neuron.layer)) {
      layerMap.set(neuron.layer, []);
    }
    layerMap.get(neuron.layer)!.push(neuron);
  });

  // Create connections between consecutive layers
  for (let layer = 0; layer < Math.max(...layerMap.keys()); layer++) {
    const currentLayerNeurons = layerMap.get(layer)!;
    const nextLayerNeurons = layerMap.get(layer + 1)!;

    currentLayerNeurons.forEach((fromNeuron) => {
      nextLayerNeurons.forEach((toNeuron) => {
        connections.push({
          id: getNextId(),
          fromNeuron,
          toNeuron,
          weight: Math.random() * 2 - 1, // Random weight between -1 and 1
        });
      });
    });
  }

  return connections;
}