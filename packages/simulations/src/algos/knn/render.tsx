import {
  getPinkMaterial,
  getWhiteMaterial,
} from "@repo/simulations/utils/materials";
import { Point3D } from "../objects/point";
import type { Renderable } from "../objects/renderable";
import { Tube } from "../objects/tube";
import type { KNNDefinition } from "./types";

export const renderKNN: KNNDefinition["render"] = (state, config) => {
  const renderables: Renderable[] = [];

  // Render query point
  renderables.push(
    new Point3D({
      coords: state.queryPoint.coords,
      material: state.queryPoint.group.material,
      tooltip: (
        <div>
          Query Point
          <br />
          Coords: {state.queryPoint.coords.x}&nbsp;
          {state.queryPoint.coords.y}&nbsp;
          {state.queryPoint.coords.z}
          <br />
          <span
            style={{
              color: `#${state.queryPoint.group.material.color.getHexString()}`,
            }}
          >
            {state.queryPoint.group.label}
          </span>
        </div>
      ),
      name: "Query Point",
    }),
  );

  // Render all points
  config.points.forEach((point) => {
    renderables.push(
      new Point3D({
        coords: point.coords,
        material: point.group.material,
        tooltip: (
          <div>
            Point {point.id} <br />
            Coords: {point.coords.x} {point.coords.y} {point.coords.z}
            <br />
            <span
              style={{
                color: `#${point.group.material.color.getHexString()}`,
              }}
            >
              {point.group.label}
            </span>
          </div>
        ),
        name: `Point ${point.id}`,
      }),
    );
  });

  // Render tubes for nearest neighbors
  if (state.nearestNeighbors) {
    state.nearestNeighbors.forEach((point, index) => {
      renderables.push(
        new Tube({
          from: point.coords,
          to: state.queryPoint.coords,
          material: getWhiteMaterial(),
          name: `Nearest Neighbor ${index + 1}`,
          radius: 0.2,
        }),
      );
    });
  }

  // Render tube for current distance calculation
  if (
    state.distances.length > 0 &&
    state.currentIndex < state.distances.length
  ) {
    const currentPoint = state.distances[state.currentIndex]?.point;
    if (currentPoint) {
      renderables.push(
        new Tube({
          from: currentPoint.coords,
          to: state.queryPoint.coords,
          material: getPinkMaterial(),
          name: "Current Distance",
          radius: 0.5,
        }),
      );
    }
  }

  return {
    objects: renderables,
    sceneSetup: {
      dimension: "3D",
    },
  };
};
