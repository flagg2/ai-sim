import { type Renderable } from "../common/objects/renderable";
import { Point2D } from "../common/objects/point2d";
import type { SVMDefinition } from "./types";
import { Line } from "../common/objects/line";
import { MeshStandardMaterial } from "three";

export const renderSVM2: SVMDefinition["render"] = (state, config) => {
  const objects: Renderable[] = [];
  const { points } = config;
  const { supportVectors, separationLine } = state;

  if (separationLine) {
    const slope = separationLine.slope;
    const yIntercept = separationLine.yIntercept;

    // Create two points far apart to draw the line
    const x1 = -200; // Left point
    const x2 = 200; // Right point
    const y1 = slope * x1 + yIntercept;
    const y2 = slope * x2 + yIntercept;

    objects.push(
      new Line({
        from: { x: x1, y: y1 },
        to: { x: x2, y: y2 },
        material: new MeshStandardMaterial({ color: "#2196F3" }),
        name: "Separation Line",
        radius: 0.2,
      }),
    );
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
          material: new MeshStandardMaterial({ color: "#FFD700" }),
          name: `SV ${sv.id}`,
          scale: 5,
          tooltip: `Support Vector ${sv.id}`,
        }),
      );
    });
  }

  return objects;
};
