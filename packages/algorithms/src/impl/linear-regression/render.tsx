import { getColoredMaterial } from "../../lib/materials";
import { Point3D } from "../../lib/objects/point3d";
import { Renderable } from "../../lib/objects/renderable";
import { Tube } from "../../lib/objects/tube";
import type { LinearRegressionDefinition } from "./types";

export const renderLinearRegression: LinearRegressionDefinition["render"] = (
  { state },
  config,
) => {
  const renderables: Renderable[] = [];
  const defaultMaterial = getColoredMaterial(0);
  const predictionLineMaterial = getColoredMaterial(1);

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

  if (state.predictionLine) {
    const { start, end } = state.predictionLine;

    const padding = Math.abs(end.x - start.x) * 2; // 20% padding
    const extendedStart = { ...start, x: start.x - padding };
    const extendedEnd = { ...end, x: end.x + padding };

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

  if (state.means) {
    renderables.push(
      new Point3D({
        coords: {
          x: state.means.x,
          y: state.means.y,
          z: state.means.z,
        },
        material: getColoredMaterial(2),
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
