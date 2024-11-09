import type { ParamConfiguratorDict } from "../common/paramConfigurators/param";
import type { AlgorithmDefinition, Step } from "../common/types";

// Define a neuron structure
export type Neuron = {
  id: string;
  layer: number;
  index: number;
  value: number;
  activation: number;
};

// Define a connection between neurons
export type Connection = {
  id: string;
  fromNeuron: Neuron;
  toNeuron: Neuron;
  weight: number;
};

// Define possible step types in the feed-forward process
type FFNNStepType = "initial" | "weightedSum" | "activation" | "layerComplete";

// State maintained during the visualization
type FFNNStepState = {
  currentLayer: number;
  currentNeuron: number;
  neurons: Neuron[];
  connections: Connection[];
  highlightedConnectionIds?: string[]; // IDs of connections being highlighted
  activeNeuronIds?: string[]; // IDs of neurons being processed
};

export type FFNNStep = Step<FFNNStepState, FFNNStepType>;

// Parameter configurators for the network
export type FFNNParamConfiguratorDict = ParamConfiguratorDict<{}>;

// Configuration for the network
export type FFNNConfig = {
  layers: number;
  neuronsPerLayer: number;
  inputSize: number;
  outputSize: number;
  neurons: Neuron[];
  connections: Connection[];
};

// Complete algorithm definition type
export type FFNNDefinition = AlgorithmDefinition<
  FFNNStep,
  FFNNConfig,
  FFNNParamConfiguratorDict
>;
