import type { NNConfig, NNStep } from "./types";
import Note from "../../lib/descriptions/note";
import Expression from "../../lib/descriptions/math";

type NetworkType = "autoencoder" | "ffnn";

export const getNNSteps: (
  config: NNConfig,
  initialStep: NNStep,
  type: NetworkType,
) => Promise<NNStep[]> = async (config, initialStep, type) => {
  const steps = [initialStep];
  let currentNeurons = [...initialStep.state.neurons];

  // process each layer (skipping input layer)
  for (let layer = 1; layer <= config.layers + 1; layer++) {
    const neuronsInCurrentLayer = currentNeurons.filter(
      (n) => n.layer === layer,
    );

    for (
      let neuronIndex = 0;
      neuronIndex < neuronsInCurrentLayer.length;
      neuronIndex++
    ) {
      const currentNeuron = neuronsInCurrentLayer[neuronIndex];

      // fetch incoming connections for this neuron
      const incomingConnections = config.connections.filter(
        (c) => c.toNeuron.id === currentNeuron.id,
      );

      const highlightedConnectionIds = incomingConnections.map((c) => c.id);

      // calculate weighted sum from incoming connections
      const weightedSum = incomingConnections.reduce((sum, conn) => {
        const fromNeuron = currentNeurons.find(
          (n) => n.id === conn.fromNeuron.id,
        );
        return sum + (fromNeuron ? fromNeuron.activation * conn.weight : 0);
      }, currentNeuron.bias || 0);

      steps.push({
        type: "weightedSum",
        title: `Calculate Weighted Sum (Layer ${layer}, Neuron ${
          neuronIndex + 1
        })`,
        description: (
          <div>
            <p>
              For each neuron, we first calculate the weighted sum of its
              inputs:
            </p>
            <ul>
              <li>Multiply each input by its connection weight</li>
              <li>Add all these products together</li>
              <li>Add the neuron's bias term</li>
            </ul>
            <Note>
              This weighted sum determines how strongly the neuron will activate
              based on its inputs.
            </Note>
          </div>
        ),
        state: {
          currentLayer: layer,
          currentNeuron: neuronIndex,
          neurons: currentNeurons.map((n) =>
            n.id === currentNeuron.id ? { ...n, value: weightedSum } : n,
          ),
          connections: config.connections,
          highlightedConnectionIds,
          highlightedNeuronIds: [currentNeuron.id],
        },
      });

      const activation = sigmoid(weightedSum);

      // update the neuron activation state
      currentNeurons = currentNeurons.map((n) =>
        n.id === currentNeuron.id
          ? { ...n, value: weightedSum, activation }
          : n,
      );

      steps.push({
        type: "activation",
        title: `Apply Activation Function (Layer ${layer}, Neuron ${
          neuronIndex + 1
        })`,
        description: (
          <div>
            <p>
              We apply the sigmoid activation function to transform the weighted
              sum into an activation value:{" "}
              <Expression>{"\\sigma(x) = \\frac{1}{1 + e^{-x}}"}</Expression>
            </p>
            <Note>
              The sigmoid function squashes any input into a value between 0 and
              1, creating a non-linear activation pattern.
            </Note>
          </div>
        ),
        state: {
          currentLayer: layer,
          currentNeuron: neuronIndex,
          neurons: currentNeurons,
          connections: config.connections,
          highlightedConnectionIds,
          highlightedNeuronIds: [currentNeuron.id],
        },
      });
    }

    steps.push({
      type: "layerComplete",
      title: `${getLayerTitle(layer, type, config.layers)} Complete`,
      description: (
        <div>
          <p>
            {type === "autoencoder"
              ? `Completed processing all neurons in ${getLayerDescription(layer, config.layers)}.`
              : `Completed processing all neurons in layer ${layer}.`}
          </p>
          {layer === config.layers + 1 && (
            <Note>
              {type === "autoencoder"
                ? "Autoencoder processing complete! The network has attempted to reconstruct the input."
                : "Forward propagation complete! The network has produced its final outputs."}
            </Note>
          )}
        </div>
      ),
      state: {
        currentLayer: layer,
        currentNeuron: 0,
        neurons: currentNeurons,
        connections: config.connections,
        highlightedConnectionIds: [],
        highlightedNeuronIds: currentNeurons
          .filter((n) => n.layer === layer)
          .map((n) => n.id),
      },
    });
  }

  // after processing all layers, calculate loss
  if (config.targetValues && config.targetValues.length > 0) {
    const outputNeurons = currentNeurons.filter(
      (n) => n.layer === config.layers + 1,
    );

    // mse loss
    const loss =
      outputNeurons.reduce((sum, neuron, idx) => {
        const error = neuron.activation - (config.targetValues?.[idx] ?? 0);
        return sum + (error * error) / 2;
      }, 0) / outputNeurons.length;

    steps.push({
      type: "lossCalculation",
      title: "Calculate Loss",
      description: (
        <div>
          <p>
            Calculate the Mean Squared Error (MSE) loss to measure prediction
            accuracy:
          </p>
          <Expression block>
            {"MSE = \\frac{1}{n}\\sum_{i=1}^{n}\\frac{(y_i - \\hat{y}_i)^2}{2}"}
          </Expression>
          <Note>
            The MSE tells us how far our predictions are from the target values,
            with smaller values indicating better performance.
          </Note>
        </div>
      ),
      state: {
        currentLayer: config.layers + 1,
        currentNeuron: 0,
        neurons: currentNeurons,
        connections: config.connections,
        highlightedConnectionIds: [],
        highlightedNeuronIds: outputNeurons.map((n) => n.id),
        loss,
        targetValues: config.targetValues,
      },
    });

    steps.push({
      type: "backpropStart",
      title: "Start Backpropagation",
      description: (
        <div>
          <p>
            Now that we've calculated the error, we'll use backpropagation to
            improve our network's performance:
          </p>
          <ul>
            <li>Start from the output layer and work backwards</li>
            <li>Calculate how much each neuron contributed to the error</li>
            <li>Adjust the network's parameters to reduce future errors</li>
          </ul>
          <Note>
            Think of backpropagation like giving feedback to each part of the
            network about how it can do better next time.
          </Note>
        </div>
      ),
      state: {
        currentLayer: config.layers + 1,
        currentNeuron: 0,
        neurons: currentNeurons,
        connections: config.connections,
        loss,
        targetValues: config.targetValues,
        gradients: {},
        weightGradients: {},
      },
    });

    const neuronGradients: { [neuronId: string]: number } = {};
    const weightGradients: { [connectionId: string]: number } = {};
    const learningRate = config.learningRate;
    let currentConnections = [...config.connections];

    // backpropagate from output layer to input layer
    for (let layer = config.layers + 1; layer >= 1; layer--) {
      const neuronsInCurrentLayer = currentNeurons.filter(
        (n) => n.layer === layer,
      );

      for (
        let neuronIndex = 0;
        neuronIndex < neuronsInCurrentLayer.length;
        neuronIndex++
      ) {
        const neuron = neuronsInCurrentLayer[neuronIndex];
        let delta = 0;

        if (layer === config.layers + 1) {
          const targetValue = config.targetValues?.[neuronIndex] ?? 0;
          const activation = neuron.activation;
          const activationDerivative = activation * (1 - activation);

          delta = (activation - targetValue) * activationDerivative;

          const biasGradient = delta;
          const newBias = (neuron.bias || 0) - learningRate * biasGradient;

          currentNeurons = currentNeurons.map((n) =>
            n.id === neuron.id ? { ...n, bias: newBias } : n,
          );

          steps.push({
            type: "biasUpdate",
            title: `Calculated gradient and update Bias (Output Neuron ${neuron.id})`,
            description: (
              <div>
                <p>
                  For output neurons, we can directly calculate their
                  responsibility for the prediction error:
                </p>
                <ul>
                  <li>Compare the prediction with the target value</li>
                  <li>
                    Consider how sensitive the neuron's output is to changes
                  </li>
                  <li>Update the bias to help reduce this error next time</li>
                </ul>
              </div>
            ),
            state: {
              currentLayer: layer,
              currentNeuron: neuronIndex,
              neurons: currentNeurons,
              connections: currentConnections,
              gradients: {
                ...neuronGradients,
                [neuron.id]: delta,
              },
              highlightedNeuronIds: [neuron.id],
            },
          });
        } else {
          // hidden layer
          const outgoingConnections = currentConnections.filter(
            (c) => c.fromNeuron.id === neuron.id,
          );

          const sumDeltaWeights = outgoingConnections.reduce((sum, conn) => {
            const delta_j = neuronGradients[conn.toNeuron.id] ?? 0;
            const weight_j = conn.weight;
            return sum + delta_j * weight_j;
          }, 0);

          const activation = neuron.activation;
          const activationDerivative = activation * (1 - activation);

          delta = sumDeltaWeights * activationDerivative;

          const biasGradient = delta;
          const newBias = (neuron.bias || 0) - learningRate * biasGradient;

          currentNeurons = currentNeurons.map((n) =>
            n.id === neuron.id ? { ...n, bias: newBias } : n,
          );

          steps.push({
            type: "biasUpdate",
            title: `Calculate Gradient and Update Bias (Hidden Neuron ${neuron.id})`,
            description: (
              <div>
                <p>
                  Hidden neurons receive feedback about their contribution to
                  the error from later layers:
                </p>
                <ul>
                  <li>
                    Collect error signals from all connected neurons in the next
                    layer
                  </li>
                  <li>
                    Consider how this neuron's activation affects those errors
                  </li>
                  <li>Adjust the bias based on this neuron's responsibility</li>
                </ul>
                <Note>
                  This process allows deep layers to learn despite not being
                  directly connected to the output.
                </Note>
              </div>
            ),
            state: {
              currentLayer: layer,
              currentNeuron: neuronIndex,
              neurons: currentNeurons,
              connections: currentConnections,
              gradients: {
                ...neuronGradients,
                [neuron.id]: delta,
              },
              highlightedNeuronIds: [neuron.id],
            },
          });
        }

        neuronGradients[neuron.id] = delta;
      }
    }

    // update the weights layer by layer
    for (let layer = config.layers + 1; layer >= 1; layer--) {
      const connectionsInLayer = currentConnections.filter(
        (conn) => conn.toNeuron.layer === layer,
      );

      for (
        let connIndex = 0;
        connIndex < connectionsInLayer.length;
        connIndex++
      ) {
        const conn = connectionsInLayer[connIndex];

        const delta_j = neuronGradients[conn.toNeuron.id] ?? 0;
        const activation_i =
          currentNeurons.find((n) => n.id === conn.fromNeuron.id)?.activation ??
          0;

        const weightGradient = delta_j * activation_i;

        const oldWeight = conn.weight;
        const newWeight = oldWeight - learningRate * weightGradient;

        currentConnections = currentConnections.map((c) =>
          c.id === conn.id ? { ...c, weight: newWeight } : c,
        );

        weightGradients[conn.id] = weightGradient;

        steps.push({
          type: "weightUpdate",
          title: `Update Weight (Layer ${layer}, Connection ${conn.id})`,
          description: (
            <div>
              <p>Updating the connection weights between neurons:</p>
              <ul>
                <li>
                  Consider both the sending and receiving neurons' contributions
                </li>
                <li>
                  Strengthen or weaken connections based on their impact on the
                  error
                </li>
                <li>Make smaller adjustments for more stable learning</li>
              </ul>
              <Note>
                Each connection learns to either amplify or dampen signals that
                help reduce the network's error.
              </Note>
            </div>
          ),
          state: {
            currentLayer: layer,
            currentNeuron: conn.toNeuron.index,
            neurons: currentNeurons,
            connections: currentConnections,
            weightGradients: {
              ...weightGradients,
              [conn.id]: weightGradient,
            },
            highlightedConnectionIds: [conn.id],
            highlightedNeuronIds: [conn.fromNeuron.id, conn.toNeuron.id],
          },
        });
      }
    }

    steps.push({
      type: "backpropComplete",
      title: "Backpropagation Complete",
      description: (
        <div>
          <p>The network has completed one full round of learning:</p>
          <ul>
            <li>All neurons have received their feedback</li>
            <li>Connection weights have been fine-tuned</li>
            <li>The network is ready for its next prediction</li>
          </ul>
          <Note>
            With each training cycle, the network gets incrementally better at
            its task.
          </Note>
        </div>
      ),
      state: {
        currentLayer: 0,
        currentNeuron: 0,
        neurons: currentNeurons,
        connections: currentConnections,
        gradients: neuronGradients,
        weightGradients: weightGradients,
        highlightedConnectionIds: [],
        highlightedNeuronIds: [],
      },
    });
  }

  return steps;
};

function getLayerTitle(
  layer: number,
  type: NetworkType,
  totalLayers: number,
): string {
  if (type !== "autoencoder") return `Layer ${layer}`;

  if (layer === 0) return "Input Layer";
  if (layer === totalLayers + 1) return "Reconstruction Layer";

  const middleLayer = Math.floor(totalLayers / 2);
  if (layer === middleLayer) return "Bottleneck Layer";
  if (layer < middleLayer) return `Encoder Layer ${layer}`;
  return `Decoder Layer ${layer}`;
}

function getLayerDescription(layer: number, totalLayers: number): string {
  if (layer === 0) return "input layer";
  if (layer === totalLayers + 1) return "reconstruction layer";

  const middleLayer = Math.floor(totalLayers / 2);
  if (layer === middleLayer) return "bottleneck layer";
  if (layer < middleLayer) return `encoder layer ${layer}`;
  return `decoder layer ${layer}`;
}

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
