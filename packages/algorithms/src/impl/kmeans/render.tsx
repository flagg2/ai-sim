import type { KMeansDefinition } from "./types";
import { Point3D } from "../../lib/objects/point";
import { Tube } from "../../lib/objects/tube";
import type { Renderable } from "../../lib/objects/renderable";

export const renderKMeans: KMeansDefinition["render"] = (state) => {
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
        scale: 5,
      }),
    );

    // Render tubes between centroids and points
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
