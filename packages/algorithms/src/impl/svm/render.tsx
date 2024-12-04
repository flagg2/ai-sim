import { Point2D } from "../../lib/objects/point2d";
import { Renderable } from "../../lib/objects/renderable";
import type { DataPoint, SVMDefinition } from "./types";
import { MeshStandardMaterial } from "three";
import { DecisionBoundary } from "../../lib/objects/decision-boundary";
import { Vector2 } from "three";
import { BOUNDARY_SCALE, GRID_SIZE } from "./const";

function getPointColor(point: DataPoint, supportVectors: DataPoint[]) {
  if (supportVectors?.includes(point)) {
    return point.label === 1 ? "#B4FFB8" : "#FFB3AE";
  }
  return point.label === 1 ? "#4CAF50" : "#F44336";
}

export const renderSVM: SVMDefinition["render"] = ({ state }, config) => {
  const objects: Renderable[] = [];
  const { points } = config;
  const { supportVectors, regionData = [] } = state;

  // Add decision boundary visualization if we have the region data
  if (regionData && regionData.length > 0) {
    objects.push(
      new DecisionBoundary(regionData, {
        colors: {
          pos: new Vector2(0x4c / 0xff, 0xaf / 0xff), // Green
          neg: new Vector2(0xf4 / 0xff, 0x43 / 0xff), // Red
        },
        size: { width: BOUNDARY_SCALE, height: BOUNDARY_SCALE },
      }),
    );

    // Create ASCII visualization
    let asciiViz = "\nRegion Data Visualization\n";
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const value = regionData[i * GRID_SIZE + j].prediction;
        asciiViz += value > 0 ? "+" : "-";
      }
      asciiViz += "\n";
    }

    console.log(asciiViz);
  }

  // Render all data points
  points.forEach((point) => {
    objects.push(
      new Point2D({
        coords: point.coords,
        material: new MeshStandardMaterial({
          color: getPointColor(point, supportVectors ?? []),
        }),
        name: `Point ${point.id}`,
        scale: 3,
        tooltip: `Point ${point.id}`,
      }),
    );
  });

  //   }

  return objects;
};
