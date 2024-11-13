import {
  getActiveMaterial,
  getWeightMaterial,
} from "@repo/simulations/lib/materials";
import type { NNDefinition } from "./types";
import type { Renderable } from "@repo/simulations/lib/objects/renderable";
import { Line } from "@repo/simulations/lib/objects/line";
import { Point2D } from "@repo/simulations/lib/objects/point2d";

export const renderNN: NNDefinition["render"] = (state, config) => {
  const renderables: Renderable[] = [];
  const {
    neurons,
    connections,
    highlightedNeuronIds,
    highlightedConnectionIds,
  } = state;

  // Calculate layout dimensions
  //   const layerCount = config.layers + 2; // input + hidden + output
  const maxNeuronsInLayer = Math.max(
    config.inputSize,
    config.neuronsPerLayer,
    config.outputSize,
  );

  // Calculate spacing and offsets
  const spacing = {
    x: 100, // space between layers
    y: 50, // space between neurons in a layer
  };
  const offsetY = 100; // Add this line to move everything up

  // Calculate canvas dimensions
  const height = spacing.y * (maxNeuronsInLayer - 1);

  // Render connections first (so they appear behind neurons)
  connections.forEach((connection) => {
    const fromLayer = connection.fromNeuron.layer;
    const toLayer = connection.toNeuron.layer;

    const fromX = fromLayer * spacing.x;
    const toX = toLayer * spacing.x;

    const fromNeuronsInLayer = getNeuronsInLayer(fromLayer, config);
    const toNeuronsInLayer = getNeuronsInLayer(toLayer, config);

    const fromY =
      calculateNeuronY(
        connection.fromNeuron.index,
        fromNeuronsInLayer,
        height,
      ) + offsetY;
    const toY =
      calculateNeuronY(connection.toNeuron.index, toNeuronsInLayer, height) +
      offsetY;

    renderables.push(
      new Line({
        from: { x: fromX, y: fromY },
        to: { x: toX, y: toY },
        material: getWeightMaterial(connection.weight),
        name: `Connection ${connection.id}`,
        radius: highlightedConnectionIds?.includes(connection.id) ? 0.5 : 0.25,
      }),
    );
  });

  // Render neurons
  neurons.forEach((neuron) => {
    const neuronsInLayer = getNeuronsInLayer(neuron.layer, config);
    const x = neuron.layer * spacing.x;
    const y = calculateNeuronY(neuron.index, neuronsInLayer, height) + offsetY;

    renderables.push(
      new Point2D({
        coords: { x, y },
        material: getActiveMaterial(neuron.activation),
        tooltip: (
          <div>
            Neuron {neuron.id}
            <br />
            Layer: {neuron.layer}
            <br />
            Value: {neuron.value.toFixed(3)}
            <br />
            Activation: {neuron.activation.toFixed(3)}
          </div>
        ),
        name: `Neuron ${neuron.id}`,
        scale: highlightedNeuronIds?.includes(neuron.id) ? 5 : 3,
      }),
    );
  });

  return renderables;
};

// Helper function to get number of neurons in a specific layer
function getNeuronsInLayer(
  layer: number,
  config: {
    layers: number;
    inputSize: number;
    neuronsPerLayer: number;
    outputSize: number;
  },
) {
  if (layer === 0) return config.inputSize;
  if (layer === config.layers + 1) return config.outputSize;
  return config.neuronsPerLayer;
}

// Helper function to calculate Y position for a neuron
function calculateNeuronY(
  index: number,
  neuronsInLayer: number,
  totalHeight: number,
): number {
  const layerHeight = totalHeight;
  const spacing = layerHeight / (neuronsInLayer - 1 || 1);
  return index * spacing - layerHeight / 2;
}
