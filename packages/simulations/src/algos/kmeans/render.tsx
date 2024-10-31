import { Point3D } from "../objects/point";
import { Tube } from "../objects/tube";
import type { Renderable } from "../objects/renderable";
import type { KMeansDefinition } from "./types";

export const renderKMeans: KMeansDefinition["render"] = (state, config) => {
  const renderables: Renderable[] = [];

  // Render all points
  state.points.forEach((point) => {
    renderables.push(
      new Point3D({
        coords: point.coords,
        material: point.group.material,
        tooltip: (
          <div>
            Point {point.id} <br />
            Coords: {point.coords.x.toFixed(2)} {point.coords.y.toFixed(2)}{" "}
            {point.coords.z.toFixed(2)}
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
        scale: 4,
      }),
    );
  });

  // Render centroids
  state.centroids.forEach((centroid) => {
    renderables.push(
      new Point3D({
        coords: centroid.coords,
        material: centroid.group.material,
        tooltip: (
          <div>
            Centroid {centroid.id} <br />
            Coords: {centroid.coords.x.toFixed(2)}{" "}
            {centroid.coords.y.toFixed(2)} {centroid.coords.z.toFixed(2)}
            <br />
            <span
              style={{
                color: `#${centroid.group.material.color.getHexString()}`,
              }}
            >
              {centroid.group.label}
            </span>
          </div>
        ),
        name: `Centroid ${centroid.id}`,
        scale: 6,
      }),
    );

    // Render tubes between centroids and their cluster points
    state.points
      .filter((point) => point.group.label === centroid.group.label)
      .forEach((point) => {
        renderables.push(
          new Tube({
            from: centroid.coords,
            to: point.coords,
            material: centroid.group.material,
            name: `Line ${centroid.id}-${point.id}`,
            radius: 0.5,
          }),
        );
      });
  });

  return renderables;
};
