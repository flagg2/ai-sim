import type { ParamConfiguratorDict } from "../common/paramConfigurators/param";
import type { SliderParamConfigurator } from "../common/paramConfigurators/slider";
import type { AlgorithmDefinition, Step } from "../common/types";

// Define a neuron structure
export type Neuron = {
  id: string;
  layer: number;
  index: number;
  value: number;
  activation: number;
  bias?: number;
};

// Define a connection between neurons
export type Connection = {
  id: string;
  fromNeuron: Neuron;
  toNeuron: Neuron;
  weight: number;
};

// Define possible step types in the feed-forward process
type FFNNStepType =
  | "initial"
  | "weightedSum"
  | "activation"
  | "layerComplete"
  | "lossCalculation"
  | "backpropStart"
  | "biasUpdate"
  | "weightUpdate"
  | "backpropComplete";

// State maintained during the visualization
type FFNNStepState = {
  currentLayer: number;
  currentNeuron: number;
  neurons: Neuron[];
  connections: Connection[];
  highlightedConnectionIds?: string[];
  highlightedNeuronIds?: string[];
  loss?: number;
  targetValues?: number[];
  gradients?: {
    [neuronId: string]: number;
  };
  weightGradients?: {
    [connectionId: string]: number;
  };
};

export type FFNNStep = Step<FFNNStepState, FFNNStepType>;

// Parameter configurators for the network
export type FFNNParamConfiguratorDict = ParamConfiguratorDict<{
  firstInputValue: SliderParamConfigurator;
  secondInputValue: SliderParamConfigurator;
  learningRate: SliderParamConfigurator;
}>;

// Configuration for the network
export type FFNNConfig = {
  layers: number;
  neuronsPerLayer: number;
  inputSize: number;
  outputSize: number;
  neurons: Neuron[];
  connections: Connection[];
  learningRate: number;
  targetValues?: number[];
};

// Complete algorithm definition type
export type FFNNDefinition = AlgorithmDefinition<
  FFNNStep,
  FFNNConfig,
  FFNNParamConfiguratorDict
>;
