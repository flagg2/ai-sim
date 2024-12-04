import { Point2D } from "../../lib/objects/point2d";
import { Renderable } from "../../lib/objects/renderable";
import type { DataPoint, SVMDefinition } from "./types";
import { MeshStandardMaterial } from "three";
import { DiscreteDecisionBoundary } from "../../lib/objects/discrete-decision-boundary";
import { BOUNDARY_SCALE } from "./const";

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

  if (regionData && regionData.length > 0) {
    objects.push(
      new DiscreteDecisionBoundary(regionData, {
        size: { width: BOUNDARY_SCALE, height: BOUNDARY_SCALE },
      }),
    );
  }

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

  return objects;
};
