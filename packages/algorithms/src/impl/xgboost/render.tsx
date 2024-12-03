import { Point2D } from "../../lib/objects/point2d";
import { Renderable } from "../../lib/objects/renderable";
import type { DataPoint, XGBoostDefinition } from "./types";
import { MeshStandardMaterial } from "three";
import { DecisionBoundary } from "../../lib/objects/decision-boundary";
import { Vector2 } from "three";
import { NonDiscreteDecisionBoundary } from "../../lib/objects/nondiscrete-decision-boundary";

const BOUNDARY_SCALE = 150;
const GRID_SIZE = 50;

function getPointColor(point: DataPoint) {
  return point.label === 1 ? "#4CAF50" : "#F44336";
}

export const renderXGBoost: XGBoostDefinition["render"] = (state, config) => {
  const objects: Renderable[] = [];
  const { trainingPoints } = config;
  const { boundaryPredictions } = state;

  // Add decision boundary visualization if we have boundary predictions
  if (boundaryPredictions) {
    objects.push(new NonDiscreteDecisionBoundary(boundaryPredictions));
  }

  // Render all data points (using original labels)
  trainingPoints.forEach((point) => {
    objects.push(
      new Point2D({
        coords: point.coords,
        material: new MeshStandardMaterial({
          color: getPointColor(point),
        }),
        name: `Point ${point.id}`,
        scale: 3,
        tooltip: `Point ${point.id} (${point.label === 1 ? "Positive" : "Negative"})`,
      }),
    );
  });

  return objects;
};
