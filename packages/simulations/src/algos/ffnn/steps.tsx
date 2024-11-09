import type { FFNNDefinition, Neuron } from "./types";

// Sigmoid activation function
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export const getFFNNSteps: FFNNDefinition["getSteps"] = async (
  config,
  initialStep,
) => {
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
      }, 0);

      // Step for calculating weighted sum
      steps.push({
        type: "weightedSum",
        title: `Calculate Weighted Sum (Layer ${layer}, Neuron ${neuronIndex + 1})`,
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
              = {weightedSum.toFixed(3)}
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
          activeNeuronIds: [currentNeuron.id],
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
        title: `Apply Activation Function (Layer ${layer}, Neuron ${neuronIndex + 1})`,
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
          activeNeuronIds: [currentNeuron.id],
        },
      });
    }

    // Step for completing the layer
    steps.push({
      type: "layerComplete",
      title: `Layer ${layer} Complete`,
      description: (
        <div>
          <p>Completed processing all neurons in layer {layer}.</p>
          {layer === config.layers && (
            <p>Network processing complete! Final output values are ready.</p>
          )}
        </div>
      ),
      state: {
        currentLayer: layer,
        currentNeuron: 0,
        neurons: currentNeurons,
        connections: config.connections,
        highlightedConnectionIds: [],
        activeNeuronIds: currentNeurons
          .filter((n) => n.layer === layer)
          .map((n) => n.id),
      },
    });
  }

  return steps;
};
