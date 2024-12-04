import { AlgorithmDefinition, ParamConfiguratorDict, Step } from "../../lib";

export type Neuron = {
  id: string;
  layer: number;
  index: number;
  value: number;
  activation: number;
  bias?: number;
};

export type Connection = {
  id: string;
  fromNeuron: Neuron;
  toNeuron: Neuron;
  weight: number;
};

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

export type NNDefinition = AlgorithmDefinition<
  NNStep,
  NNConfig,
  NNParamConfiguratorDict
>;
