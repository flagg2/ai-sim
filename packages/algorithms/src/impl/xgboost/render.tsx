import { Line } from "../../lib/objects/line";
import { Point2D } from "../../lib/objects/point2d";
import { Renderable } from "../../lib/objects/renderable";
import { getColoredMaterial } from "../../lib/materials";
import type { XGBoostDefinition, TreeNode } from "./types";

export const renderXGBoost: XGBoostDefinition["render"] = (state, config) => {
  const renderables: Renderable[] = [];
  const { points, currentTree, trees } = state;

  // Render data points
  points.forEach((point) => {
    renderables.push(
      new Point2D({
        coords: point.coords,
        material: getColoredMaterial(point.currentPrediction || 0),
        name: `Point ${point.id}`,
        scale: 3,
        tooltip: (
          <div>
            Point {point.id}
            <br />
            Label: {point.label}
            <br />
            Current Prediction: {point.currentPrediction?.toFixed(3)}
          </div>
        ),
      }),
    );
  });

  // Constants for tree layout
  const treeVerticalSpacing = 150;
  const treeBaseY = 100; // Start trees below the data points

  // Render previous trees
  if (trees) {
    trees.forEach((tree, index) => {
      const treeOffset = treeBaseY + index * treeVerticalSpacing;
      renderTreeStructure(tree, renderables, 0.7, treeOffset);
    });
  }

  // Render current tree (larger and at the bottom)
  if (currentTree) {
    const currentTreeOffset =
      treeBaseY + (trees?.length || 0) * treeVerticalSpacing;
    renderTreeStructure(currentTree, renderables, 1, currentTreeOffset);
  }

  return renderables;
};

function renderTreeStructure(
  node: TreeNode,
  renderables: Renderable[],
  scale: number = 1,
  yOffset: number = 0,
) {
  if (!node.coords) return;

  // Apply the y-offset to the node's coordinates
  const nodePosition = {
    x: node.coords.x,
    y: node.coords.y + yOffset,
  };

  // Render node
  renderables.push(
    new Point2D({
      coords: nodePosition,
      material: getColoredMaterial(node.prediction || 0),
      name: `Node ${node.id}`,
      scale: 5 * scale,
      tooltip: (
        <div>
          Tree {Math.floor(yOffset / 150)} Node {node.id}
          <br />
          {node.splitFeature !== undefined && (
            <>
              Split at x = {node.splitValue?.toFixed(3)}
              <br />
            </>
          )}
          {node.prediction !== undefined && (
            <>Prediction: {node.prediction.toFixed(3)}</>
          )}
        </div>
      ),
    }),
  );

  // Render connections to children
  if (node.left?.coords) {
    const leftPosition = {
      x: node.left.coords.x,
      y: node.left.coords.y + yOffset,
    };
    renderables.push(
      new Line({
        from: nodePosition,
        to: leftPosition,
        material: getColoredMaterial(0),
        name: `Edge ${node.id}-${node.left.id}`,
        radius: 0.5 * scale,
      }),
    );
    renderTreeStructure(node.left, renderables, scale, yOffset);
  }

  if (node.right?.coords) {
    const rightPosition = {
      x: node.right.coords.x,
      y: node.right.coords.y + yOffset,
    };
    renderables.push(
      new Line({
        from: nodePosition,
        to: rightPosition,
        material: getColoredMaterial(0),
        name: `Edge ${node.id}-${node.right.id}`,
        radius: 0.5 * scale,
      }),
    );
    renderTreeStructure(node.right, renderables, scale, yOffset);
  }
}
