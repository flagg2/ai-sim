import { Point2D } from "../../lib/objects/point2d";
import { Renderable } from "../../lib/objects/renderable";
import type { DataPoint, XGBoostDefinition } from "./types";
import { MeshStandardMaterial, Vector2 } from "three";
import { NonDiscreteDecisionBoundary } from "../../lib/objects/nondiscrete-decision-boundary";
import { Tree } from "../../lib/objects/tree";

function getPointColor(point: DataPoint) {
  return point.label === 1 ? "#4CAF50" : "#F44336";
}

export const renderXGBoost: XGBoostDefinition["render"] = (
  { state, type },
  config,
) => {
  const objects: Renderable[] = [];

  // render example tree
  if (type === "buildTree") {
    const exampleTree = {
      value: "x <= 75",
      position: new Vector2(75, 100),
      children: [
        {
          value: "y <= 45",
          position: new Vector2(50, 75),
          children: [
            {
              value: "-0.6",
              position: new Vector2(25, 50),
            },
            {
              value: "+0.3",
              position: new Vector2(50, 50),
            },
          ],
        },
        {
          value: "+0.8",
          position: new Vector2(100, 75),
        },
      ],
    };

    objects.push(new Tree(exampleTree));
    return objects;
  }

  const { trainingPoints } = config;
  const { boundaryPredictions } = state;

  if (boundaryPredictions) {
    objects.push(new NonDiscreteDecisionBoundary(boundaryPredictions));
  }

  trainingPoints.forEach((point) => {
    objects.push(
      new Point2D({
        coords: point.coords,
        material: new MeshStandardMaterial({
          color: getPointColor(point),
        }),
        name: `Point ${point.id}`,
        scale: 3,
        tooltip: `Point ${point.id} (${point.label === 1 ? "Positive" : "Negative"})`,
      }),
    );
  });

  return objects;
};
