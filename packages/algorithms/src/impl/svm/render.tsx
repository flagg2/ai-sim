import { Line } from "../../lib/objects/line";
import { Point2D } from "../../lib/objects/point2d";
import { Renderable } from "../../lib/objects/renderable";
import type { SVMDefinition } from "./types";
import { MeshStandardMaterial } from "three";
import { DecisionBoundary } from "../../lib/objects/decision-boundary";

export const renderSVM: SVMDefinition["render"] = (state, config) => {
  const objects: Renderable[] = [];
  const { points } = config;
  const { supportVectors, separationLine, regionData = [] } = state;

  // Add decision boundary visualization if we have the separation line
  if (separationLine && regionData.length > 0) {
    objects.push(new DecisionBoundary(regionData));
  }

  // Render all data points
  points.forEach((point) => {
    objects.push(
      new Point2D({
        coords: point.coords,
        material: new MeshStandardMaterial({
          color: point.label === 1 ? "#4CAF50" : "#F44336",
        }),
        name: `Point ${point.id}`,
        scale: 3,
        tooltip: `Point ${point.id}`,
      }),
    );
  });

  // Render support vectors
  if (supportVectors) {
    supportVectors.forEach((sv) => {
      objects.push(
        new Point2D({
          coords: sv.coords,
          material: new MeshStandardMaterial({
            color:
              points.find((p) => p.id === sv.id)?.label === 1
                ? "#B4FFB8"
                : "#FFB3AE",
          }),
          name: `SV ${sv.id}`,
          scale: 3,
          tooltip: `Support Vector ${sv.id}`,
        }),
      );
    });
  }

  return objects;
};
