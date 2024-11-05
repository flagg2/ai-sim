import { Point3D } from "../common/objects/point";
import { Plane } from "../common/objects/plane";
import type { Renderable } from "../common/objects/renderable";
import type { SVMDefinition } from "./types";
import { getMaterial } from "@repo/simulations/utils/materials";
import { Point2D } from "../common/objects/point2d";

export const renderSVM: SVMDefinition["render"] = (state, config) => {
  const renderables: Renderable[] = [];
  const defaultMaterial = getMaterial(0);
  const positiveMaterial = getMaterial(1);
  const negativeMaterial = getMaterial(2);
  const supportVectorMaterial = getMaterial(3);

  // Render points based on whether we're in 2D or 3D
  if (!state.transformedPoints) {
    // Initial 2D view
    config.points.forEach((point) => {
      renderables.push(
        new Point2D({
          coords: point.coords,
          material: point.label === 1 ? positiveMaterial : negativeMaterial,
          tooltip: (
            <div>
              Point {point.id}
              <br />
              Class: {point.label === 1 ? "Positive" : "Negative"}
              <br />
              Coords: ({point.coords.x.toFixed(2)}, {point.coords.y.toFixed(2)})
            </div>
          ),
          name: `Point ${point.id}`,
        }),
      );
    });
  } else {
    // 3D view with transformed points
    state.transformedPoints.forEach((point) => {
      const isSupport = state.supportVectors?.some((sv) => sv.id === point.id);
      renderables.push(
        new Point3D({
          coords: point.transformedCoords!,
          material: isSupport
            ? supportVectorMaterial
            : point.label === 1
              ? positiveMaterial
              : negativeMaterial,
          tooltip: (
            <div>
              Point {point.id}
              <br />
              Class: {point.label === 1 ? "Positive" : "Negative"}
              {isSupport && (
                <>
                  <br />
                  Support Vector
                </>
              )}
              <br />
              Original: ({point.coords.x.toFixed(2)},{" "}
              {point.coords.y.toFixed(2)})
              <br />
              Transformed: ({point.transformedCoords!.x.toFixed(2)},
              {point.transformedCoords!.y.toFixed(2)},
              {point.transformedCoords!.z.toFixed(2)})
            </div>
          ),
          name: `Point ${point.id}`,
        }),
      );
    });

    // Render hyperplane if available
    if (state.hyperplane) {
      renderables.push(
        new Plane({
          normal: state.hyperplane.normal,
          bias: state.hyperplane.bias,
          tooltip: (
            <div>
              Separating Hyperplane
              <br />
              Margin: {state.margin?.toFixed(2)}
            </div>
          ),
          name: "Separating Hyperplane",
        }),
      );
    }
  }

  return renderables;
};
