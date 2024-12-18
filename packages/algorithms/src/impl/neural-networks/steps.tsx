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
        title: `Calculate Weighted Sum (Layer ${layer})`,
        description: (
          <div>
            <p>
              For current neuron, calculate <strong>neuron's output </strong>
              using the <strong>weighted sum</strong>. Multiply each input
              activation by its corresponding connection weight, summing all
              weighted inputs together, and adding the neuron's bias term as an
              offset.
            </p>
            <Note>
              The weighted sum represents the total input signal strength before
              activation
            </Note>
            <Note>
              The bias term starts at 0 and is adjusted during training to
              optimize the network's performance
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
        title: `Apply Activation Function`,
        description: (
          <div>
            <p>
              Apply sigmoid activation function:{" "}
              <Expression> {" \\sigma(x) = \\frac{1}{1 + e^{-x}}"}</Expression>
            </p>
            <Note>
              The sigmoid function normalizes the neuron's output to a
              probability-like value between 0 (completely inactive) and 1
              (fully activated)
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
              ? `Completed processing ${getLayerDescription(layer, config.layers)}.`
              : `Completed processing layer ${layer}.`}
          </p>
          {layer === config.layers + 1 && (
            <Note>
              {type === "autoencoder"
                ? "Autoencoder has attempted to reconstruct the input"
                : "Forward propagation complete - network has produced its outputs"}
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
            {type === "autoencoder" ? (
              <>
                For an autoencoder, the <strong>target values</strong> are the
                same as our initial input values. The network attempts to
                reconstruct its own input after compressing it through the
                bottleneck layer. This is good for various tasks like{" "}
                <strong>image compression</strong> or{" "}
                <strong>data denoising</strong>.
              </>
            ) : (
              <>
                Initially we had a <strong>target value</strong>, which is the
                output that we want the network to produce.
              </>
            )}
          </p>
          <p>
            We compare our newly calculated <strong>prediction</strong> with the
            target value to calculate the <strong>prediction error</strong>.
          </p>
          <p>We do this using Mean Squared Error (MSE) loss:</p>
          <Expression block>
            {"MSE = \\frac{1}{n}\\sum_{i=1}^{n}\\frac{(y_i - \\hat{y}_i)^2}{2}"}
          </Expression>
          <Note>
            {type === "autoencoder"
              ? "MSE measures how well the network can reconstruct its input after compression"
              : "MSE measures how far our predictions are from the target values"}
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
            We begin a process called <strong>backpropagation</strong> to
            optimize network performance.
          </p>
          <p>
            We calculate the <strong>error gradients</strong> starting from the
            output layer, determining each neuron's contribution to the
            prediction error.
          </p>
          <p>
            We then use these gradients to update the <strong>weights </strong>
            and <strong>biases</strong> using gradient descent.
          </p>
          <Note>
            Backpropagation distributes error responsibility throughout the
            network's parameters
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
            title: `Calculate Gradient and Update Bias`,
            description: (
              <div>
                {layer === config.layers + 1 ? (
                  <>
                    <p>
                      For output neurons, we calculate how much their bias terms
                      need to change based on their direct contribution to the
                      network's prediction error.
                    </p>
                    <p>
                      First, we compare the neuron's output with its{" "}
                      <strong>target value</strong> to determine the prediction
                      error. Then, we calculate how sensitive the neuron's
                      activation is to changes using the{" "}
                      <strong>sigmoid derivative</strong>. Finally, we combine
                      these to determine how much to{" "}
                      <strong>adjust the bias</strong>.
                    </p>
                    <Note>
                      The bias adjustment helps the neuron shift its activation
                      threshold to better match the desired output pattern
                    </Note>
                  </>
                ) : (
                  <>
                    <p>
                      For hidden neurons, we calculate bias adjustments based on
                      how much they contributed to the errors in the subsequent
                      layer. This is known as the <strong>chain rule</strong> in
                      backpropagation.
                    </p>
                    <p>
                      We collect error signals from all neurons in the next
                      layer that this neuron connects to, weight them by their
                      connection strengths, and use this information to
                      determine this neuron's <strong>responsibility</strong> in
                      the network's overall error.
                    </p>
                    <Note>
                      This backward flow of error signals allows neurons in
                      deeper layers to learn from indirect feedback, even though
                      they don't directly produce the final output
                    </Note>
                  </>
                )}
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
            title: `Calculate Gradient and Update Bias`,
            description: (
              <div>
                {layer === config.layers + 1 ? (
                  <>
                    <p>
                      For output neurons, we calculate how much their bias terms
                      need to change based on their direct contribution to the
                      network's prediction error.
                    </p>
                    <p>
                      First, we compare the neuron's output with its{" "}
                      <strong>target value</strong> to determine the prediction
                      error. Then, we calculate how sensitive the neuron's
                      activation is to changes using the{" "}
                      <strong>sigmoid derivative</strong>. Finally, we combine
                      these to determine how much to{" "}
                      <strong>adjust the bias</strong>.
                    </p>
                    <Note>
                      The bias adjustment helps the neuron shift its activation
                      threshold to better match the desired output pattern
                    </Note>
                  </>
                ) : (
                  <>
                    <p>
                      For hidden neurons, we calculate bias adjustments based on
                      how much they contributed to the errors in the subsequent
                      layer. This is known as the <strong>chain rule</strong> in
                      backpropagation.
                    </p>
                    <p>
                      We collect error signals from all neurons in the next
                      layer that this neuron connects to, weight them by their
                      connection strengths, and use this information to
                      determine this neuron's <strong>responsibility</strong> in
                      the network's overall error.
                    </p>
                    <Note>
                      This backward flow of error signals allows neurons in
                      deeper layers to learn from indirect feedback, even though
                      they don't directly produce the final output
                    </Note>
                  </>
                )}
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
          title: `Update Connection Weight`,
          description: (
            <div>
              <p>
                Now that we know each neuron's contribution to the error, we can
                <strong>update the connection weights</strong> to improve the
                network's performance. For each connection, we consider both the
                sending neuron's activation and the receiving neuron's error
                gradient.
              </p>
              <p>
                The weight update is proportional to how much a small change in
                this connection would affect the network's error. We scale this
                update by a <strong>learning rate</strong> to ensure stable
                learning - too large a change could cause the network to
                overshoot optimal values, while too small a change would make
                learning too slow.
              </p>
              <Note>
                Each weight adjustment fine-tunes the connection strength,
                gradually sculpting the network's internal representation to
                better solve the learning task
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
          <p>
            We completed a single <strong>cycle</strong> of a neural network's
            training process.
          </p>
          <ul>
            <li>All neurons have received feedback</li>
            <li>Connection weights have been updated</li>
            <li>Network is ready for next iteration</li>
          </ul>
          <Note>Each training cycle incrementally improves the network</Note>
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
