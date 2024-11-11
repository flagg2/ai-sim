import {
  CatmullRomCurve3,
  Material,
  MeshStandardMaterial,
  TubeGeometry,
  Vector3,
} from "three";
import type { Coords2D } from "../common/types";
import {
  RenderableObject,
  type Renderable,
} from "../common/objects/renderable";

type DecisionBoundaryProps = {
  weights: number[];
  bias: number;
  marginLines?: {
    positive: number;
    negative: number;
  };
  material?: Material;
  name?: string;
  radius?: number;
};

export class DecisionBoundary implements Renderable {
  private objects: RenderableObject[] = [];

  constructor(props: DecisionBoundaryProps) {
    const { weights, bias, marginLines, name, radius = 0.2 } = props;

    // Helper function to get points for a line given bias
    const getLinePoints = (b: number): [Coords2D, Coords2D] => {
      // Use a large enough range to cover the visualization area
      const x1 = -10,
        x2 = 10;
      const y1 = (-weights[0] * x1 - b) / weights[1];
      const y2 = (-weights[0] * x2 - b) / weights[1];

      return [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
      ];
    };

    // Create main decision boundary
    const [mainFrom, mainTo] = getLinePoints(bias);
    this.objects.push(
      new RenderableObject({
        three: {
          geometry: new TubeGeometry(
            new CatmullRomCurve3([
              new Vector3(mainFrom.x, mainFrom.y, 0),
              new Vector3(mainTo.x, mainTo.y, 0),
            ]),
            20,
            radius,
            8,
            false,
          ),
          material: new MeshStandardMaterial({ color: "#2196F3" }),
        },
        name: name ?? "Decision Boundary",
      }),
    );

    // Create margin lines if provided
    if (marginLines) {
      // Positive margin
      const [posFrom, posTo] = getLinePoints(marginLines.positive);
      this.objects.push(
        new RenderableObject({
          three: {
            geometry: new TubeGeometry(
              new CatmullRomCurve3([
                new Vector3(posFrom.x, posFrom.y, 0),
                new Vector3(posTo.x, posTo.y, 0),
              ]),
              20,
              radius / 2,
              8,
              false,
            ),
            material: new MeshStandardMaterial({
              color: "#2196F3",
              opacity: 0.5,
              transparent: true,
            }),
          },
          name: "Positive Margin",
        }),
      );

      // Negative margin
      const [negFrom, negTo] = getLinePoints(marginLines.negative);
      this.objects.push(
        new RenderableObject({
          three: {
            geometry: new TubeGeometry(
              new CatmullRomCurve3([
                new Vector3(negFrom.x, negFrom.y, 0),
                new Vector3(negTo.x, negTo.y, 0),
              ]),
              20,
              radius / 2,
              8,
              false,
            ),
            material: new MeshStandardMaterial({
              color: "#2196F3",
              opacity: 0.5,
              transparent: true,
            }),
          },
          name: "Negative Margin",
        }),
      );
    }
  }

  getRenderProps() {
    return this.objects.map((obj) => obj.getRenderProps());
  }

  getKey() {
    return "decision-boundary";
  }

  getTooltip() {
    return null;
  }
}
