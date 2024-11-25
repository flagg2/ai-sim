import type { NNConfig, NNStep } from "./types";
import Description from "../../lib/descriptions/description";
import Paragraph from "../../lib/descriptions/paragraph";
import List, { ListItem } from "../../lib/descriptions/list";
import Note from "../../lib/descriptions/note";
import Expression from "../../lib/descriptions/math";

// Sigmoid activation function
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

type NetworkType = "autoencoder" | "ffnn";

export const getNNSteps: (
  config: NNConfig,
  initialStep: NNStep,
  type: NetworkType,
) => Promise<NNStep[]> = async (config, initialStep, type) => {
  const steps = [initialStep];
  let currentNeurons = [...initialStep.state.neurons];

  // Process each layer (skipping input layer)
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

      // Fetch incoming connections for this neuron
      const incomingConnections = config.connections.filter(
        (c) => c.toNeuron.id === currentNeuron.id,
      );

      const highlightedConnectionIds = incomingConnections.map((c) => c.id);

      // Calculate weighted sum from incoming connections
      const weightedSum = incomingConnections.reduce((sum, conn) => {
        const fromNeuron = currentNeurons.find(
          (n) => n.id === conn.fromNeuron.id,
        );
        return sum + (fromNeuron ? fromNeuron.activation * conn.weight : 0);
      }, currentNeuron.bias || 0);

      // Step for calculating weighted sum
      steps.push({
        type: "weightedSum",
        title: `Calculate Weighted Sum (Layer ${layer}, Neuron ${
          neuronIndex + 1
        })`,
        description: (
          <Description>
            <Paragraph>
              For each neuron, we first calculate the weighted sum of its
              inputs:
            </Paragraph>
            <List>
              <ListItem>Multiply each input by its connection weight</ListItem>
              <ListItem>Add all these products together</ListItem>
              <ListItem>Add the neuron's bias term</ListItem>
            </List>
            <Note>
              This weighted sum determines how strongly the neuron will activate
              based on its inputs.
            </Note>
          </Description>
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

      // Calculate activation
      const activation = sigmoid(weightedSum);

      // Update the neuron activation state
      currentNeurons = currentNeurons.map((n) =>
        n.id === currentNeuron.id
          ? { ...n, value: weightedSum, activation }
          : n,
      );

      // Step for applying activation
      steps.push({
        type: "activation",
        title: `Apply Activation Function (Layer ${layer}, Neuron ${
          neuronIndex + 1
        })`,
        description: (
          <Description>
            <Paragraph>
              We apply the sigmoid activation function to transform the weighted
              sum into an activation value:
            </Paragraph>
            <Expression>{"\\sigma(x) = \\frac{1}{1 + e^{-x}}"}</Expression>
            <Note>
              The sigmoid function squashes any input into a value between 0 and
              1, creating a non-linear activation pattern.
            </Note>
          </Description>
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

    // Step for completing the layer
    steps.push({
      type: "layerComplete",
      title: `${getLayerTitle(layer, type, config.layers)} Complete`,
      description: (
        <Description>
          <Paragraph>
            {type === "autoencoder"
              ? `Completed processing all neurons in ${getLayerDescription(layer, config.layers)}.`
              : `Completed processing all neurons in layer ${layer}.`}
          </Paragraph>
          {layer === config.layers + 1 && (
            <Note>
              {type === "autoencoder"
                ? "Autoencoder processing complete! The network has attempted to reconstruct the input."
                : "Forward propagation complete! The network has produced its final outputs."}
            </Note>
          )}
        </Description>
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

  // After processing all layers, add loss calculation if target values exist
  if (config.targetValues && config.targetValues.length > 0) {
    const outputNeurons = currentNeurons.filter(
      (n) => n.layer === config.layers + 1,
    );

    // Calculate MSE loss
    const loss =
      outputNeurons.reduce((sum, neuron, idx) => {
        const error = neuron.activation - (config.targetValues?.[idx] ?? 0);
        return sum + (error * error) / 2;
      }, 0) / outputNeurons.length;

    console.log({ loss });

    // Add loss calculation step
    steps.push({
      type: "lossCalculation",
      title: "Calculate Loss",
      description: (
        <Description>
          <Paragraph>
            Calculate the Mean Squared Error (MSE) loss to measure prediction
            accuracy:
          </Paragraph>
          <Expression block>
            {"MSE = \\frac{1}{n}\\sum_{i=1}^{n}\\frac{(y_i - \\hat{y}_i)^2}{2}"}
          </Expression>
          <Note>
            The MSE tells us how far our predictions are from the target values,
            with smaller values indicating better performance.
          </Note>
        </Description>
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

    // Initialize backpropagation
    steps.push({
      type: "backpropStart",
      title: "Start Backpropagation",
      description: (
        <Description>
          <Paragraph>
            Now that we've calculated the error, we'll use backpropagation to
            improve our network's performance:
          </Paragraph>
          <List>
            <ListItem>Start from the output layer and work backwards</ListItem>
            <ListItem>
              Calculate how much each neuron contributed to the error
            </ListItem>
            <ListItem>
              Adjust the network's parameters to reduce future errors
            </ListItem>
          </List>
          <Note>
            Think of backpropagation like giving feedback to each part of the
            network about how it can do better next time.
          </Note>
        </Description>
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

    // Begin backpropagation steps
    const neuronGradients: { [neuronId: string]: number } = {};
    const weightGradients: { [connectionId: string]: number } = {};
    const learningRate = config.learningRate;
    let currentConnections = [...config.connections];

    // Backpropagate from output layer to input layer
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
          // Output layer
          const targetValue = config.targetValues?.[neuronIndex] ?? 0;
          const activation = neuron.activation;
          const activationDerivative = activation * (1 - activation);

          delta = (activation - targetValue) * activationDerivative;

          // Update bias
          const biasGradient = delta;
          const newBias = (neuron.bias || 0) - learningRate * biasGradient;

          currentNeurons = currentNeurons.map((n) =>
            n.id === neuron.id ? { ...n, bias: newBias } : n,
          );

          // Add bias update step
          steps.push({
            type: "biasUpdate",
            title: `Calculated gradient and update Bias (Output Neuron ${neuron.id})`,
            description: (
              <Description>
                <Paragraph>
                  For output neurons, we can directly calculate their
                  responsibility for the prediction error:
                </Paragraph>
                <List>
                  <ListItem>
                    Compare the prediction with the target value
                  </ListItem>
                  <ListItem>
                    Consider how sensitive the neuron's output is to changes
                  </ListItem>
                  <ListItem>
                    Update the bias to help reduce this error next time
                  </ListItem>
                </List>
              </Description>
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
          // Hidden layer
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

          // Update bias for hidden neuron
          const biasGradient = delta;
          const newBias = (neuron.bias || 0) - learningRate * biasGradient;

          currentNeurons = currentNeurons.map((n) =>
            n.id === neuron.id ? { ...n, bias: newBias } : n,
          );

          // Add gradient calculation and bias update step for hidden neuron
          steps.push({
            type: "biasUpdate",
            title: `Calculate Gradient and Update Bias (Hidden Neuron ${neuron.id})`,
            description: (
              <Description>
                <Paragraph>
                  Hidden neurons receive feedback about their contribution to
                  the error from later layers:
                </Paragraph>
                <List>
                  <ListItem>
                    Collect error signals from all connected neurons in the next
                    layer
                  </ListItem>
                  <ListItem>
                    Consider how this neuron's activation affects those errors
                  </ListItem>
                  <ListItem>
                    Adjust the bias based on this neuron's responsibility
                  </ListItem>
                </List>
                <Note>
                  This process allows deep layers to learn despite not being
                  directly connected to the output.
                </Note>
              </Description>
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

        // Save the gradient
        neuronGradients[neuron.id] = delta;
      }
    }

    // Now, update the weights layer by layer
    for (let layer = config.layers + 1; layer >= 1; layer--) {
      const connectionsInLayer = currentConnections.filter(
        (conn) => conn.toNeuron.layer === layer,
      );

      // Process each connection for the current layer
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

        // Update just this connection's weight
        currentConnections = currentConnections.map((c) =>
          c.id === conn.id ? { ...c, weight: newWeight } : c,
        );

        // Save the weight gradient
        weightGradients[conn.id] = weightGradient;

        // Add weight update step
        steps.push({
          type: "weightUpdate",
          title: `Update Weight (Layer ${layer}, Connection ${conn.id})`,
          description: (
            <Description>
              <Paragraph>
                Updating the connection weights between neurons:
              </Paragraph>
              <List>
                <ListItem>
                  Consider both the sending and receiving neurons' contributions
                </ListItem>
                <ListItem>
                  Strengthen or weaken connections based on their impact on the
                  error
                </ListItem>
                <ListItem>
                  Make smaller adjustments for more stable learning
                </ListItem>
              </List>
              <Note>
                Each connection learns to either amplify or dampen signals that
                help reduce the network's error.
              </Note>
            </Description>
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

    // After weight updates, add a backpropComplete step
    steps.push({
      type: "backpropComplete",
      title: "Backpropagation Complete",
      description: (
        <Description>
          <Paragraph>
            The network has completed one full round of learning:
          </Paragraph>
          <List>
            <ListItem>All neurons have received their feedback</ListItem>
            <ListItem>Connection weights have been fine-tuned</ListItem>
            <ListItem>The network is ready for its next prediction</ListItem>
          </List>
          <Note>
            With each training cycle, the network gets incrementally better at
            its task.
          </Note>
        </Description>
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

// Helper functions
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
