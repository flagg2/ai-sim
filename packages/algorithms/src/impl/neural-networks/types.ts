import { AlgorithmDefinition, ParamConfiguratorDict, Step } from "../../lib";

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
type NNStepType =
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
type NNStepState = {
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

export type NNStep = Step<NNStepState, NNStepType>;

type NNParamConfiguratorDict = ParamConfiguratorDict<unknown>;

// Configuration for the network
export type NNConfig = {
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
export type NNDefinition = AlgorithmDefinition<
  NNStep,
  NNConfig,
  NNParamConfiguratorDict
>;
