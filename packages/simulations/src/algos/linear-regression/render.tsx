import { Point3D } from "../common/objects/point";
import type { Renderable } from "../common/objects/renderable";
import { Tube } from "../common/objects/tube";
import type { LinearRegressionDefinition } from "./types";
import { getMaterial } from "@repo/simulations/utils/materials";

export const renderLinearRegression: LinearRegressionDefinition["render"] = (
  state,
  config,
) => {
  const renderables: Renderable[] = [];
  const defaultMaterial = getMaterial(0);
  const predictionLineMaterial = getMaterial(1);

  // Render all data points
  config.points.forEach((point) => {
    renderables.push(
      new Point3D({
        coords: point.coords,
        material: defaultMaterial,
        tooltip: (
          <div>
            Point {point.id} <br />
            Coords: {point.coords.x.toFixed(2)} {point.coords.y.toFixed(2)}{" "}
            {point.coords.z.toFixed(2)}
            <br />
          </div>
        ),
        name: `Point ${point.id}`,
      }),
    );
  });

  // Render prediction line if available
  if (state.predictionLine) {
    const { start, end } = state.predictionLine;

    // Extend the line by adding padding to x coordinates
    const padding = Math.abs(end.x - start.x) * 2; // 20% padding
    const extendedStart = { ...start, x: start.x - padding };
    const extendedEnd = { ...end, x: end.x + padding };

    // Create start and end points with predicted y and z values
    const startY = state.coefficients
      ? state.coefficients.slopeXY * extendedStart.x +
        state.coefficients.interceptY
      : 0;
    const startZ = state.coefficients
      ? state.coefficients.slopeXZ * extendedStart.x +
        state.coefficients.interceptZ
      : 0;

    const endY = state.coefficients
      ? state.coefficients.slopeXY * extendedEnd.x +
        state.coefficients.interceptY
      : 0;
    const endZ = state.coefficients
      ? state.coefficients.slopeXZ * extendedEnd.x +
        state.coefficients.interceptZ
      : 0;

    const startPoint = { ...extendedStart, y: startY, z: startZ };
    const endPoint = { ...extendedEnd, y: endY, z: endZ };

    renderables.push(
      new Tube({
        from: startPoint,
        to: endPoint,
        material: predictionLineMaterial,
        name: "Regression Line",
        radius: 1,
      }),
    );
  }

  // Render mean point if available
  if (state.means) {
    renderables.push(
      new Point3D({
        coords: {
          x: state.means.x,
          y: state.means.y,
          z: state.means.z,
        },
        material: getMaterial(2),
        scale: 5,
        tooltip: (
          <div>
            Mean Point
            <br />
            X: {state.means.x.toFixed(2)}
            <br />
            Y: {state.means.y.toFixed(2)}
          </div>
        ),
        name: "Mean Point",
      }),
    );
  }

  return renderables;
};
