import type { NNConfig, NNStep } from "./types";

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
          <div>
            <p>Calculating weighted sum for neuron {currentNeuron.id}:</p>
            <p>
              Weighted Sum ={" "}
              {incomingConnections.map((conn, idx) => {
                const fromNeuron = currentNeurons.find(
                  (n) => n.id === conn.fromNeuron.id,
                );
                return (
                  <span key={conn.id}>
                    {idx > 0 ? " + " : ""}(
                    {fromNeuron?.activation?.toFixed(3) || "0"} ×{" "}
                    {conn.weight.toFixed(3)})
                  </span>
                );
              })}{" "}
              + {currentNeuron.bias?.toFixed(3) || "0"}={" "}
              {weightedSum.toFixed(3)}
            </p>
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
          <div>
            <p>
              Apply sigmoid activation function to neuron {currentNeuron.id}:
            </p>
            <p>
              sigmoid({weightedSum.toFixed(3)}) = {activation.toFixed(3)}
            </p>
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

    // Step for completing the layer
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
            <p>
              {type === "autoencoder"
                ? "Autoencoder processing complete! Reconstruction values are ready."
                : "Network processing complete! Final output values are ready."}
            </p>
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
        <div>
          <p>Calculating Mean Squared Error (MSE) loss:</p>
          <p>
            MSE ={" "}
            {outputNeurons.map((neuron, idx) => (
              <span key={neuron.id}>
                {idx > 0 ? " + " : ""}
                (({neuron.activation.toFixed(3)} -{" "}
                {config.targetValues?.[idx].toFixed(3)})²/2)
              </span>
            ))}{" "}
            = {loss.toFixed(3)}
          </p>
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

    // Initialize backpropagation
    steps.push({
      type: "backpropStart",
      title: "Start Backpropagation",
      description: (
        <div>
          <p>Beginning backpropagation to update network weights.</p>
          <p>Learning rate: {config.learningRate}</p>
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
              <div>
                <p>Updating bias for neuron {neuron.id}:</p>
                <p>Bias gradient = δ = {biasGradient.toFixed(3)}</p>
                <p>
                  New bias = {(neuron.bias || 0).toFixed(3)} - {learningRate} ×{" "}
                  {biasGradient.toFixed(3)} = {newBias.toFixed(3)}
                </p>
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
              <div>
                <p>Calculating gradient for hidden neuron {neuron.id}:</p>
                <p>
                  δ = Σ(δₖ × w<sub>jk</sub>) × activation derivative
                </p>
                <p>
                  δ = ({sumDeltaWeights.toFixed(3)}) ×{" "}
                  {activationDerivative.toFixed(3)} = {delta.toFixed(3)}
                </p>
                <p>Updating bias:</p>
                <p>
                  New bias = {(neuron.bias || 0).toFixed(3)} - {learningRate} ×{" "}
                  {biasGradient.toFixed(3)} = {newBias.toFixed(3)}
                </p>
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
            <div>
              <p>Updating weight for connection {conn.id}:</p>
              <p>
                Weight gradient = δ<sub>k</sub> × activation of neuron{" "}
                {conn.fromNeuron.id}
              </p>
              <p>
                Weight gradient = {delta_j.toFixed(3)} ×{" "}
                {activation_i.toFixed(3)} = {weightGradient.toFixed(3)}
              </p>
              <p>
                Updated weight = {oldWeight.toFixed(3)} - {learningRate} ×{" "}
                {weightGradient.toFixed(3)} = {newWeight.toFixed(3)}
              </p>
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

    // After weight updates, add a backpropComplete step
    steps.push({
      type: "backpropComplete",
      title: "Backpropagation Complete",
      description: (
        <div>
          <p>Backpropagation completed. All weights have been updated.</p>
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
