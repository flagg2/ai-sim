import type { XGBoostDefinition, TreeNode, DataPoint } from "./types";

export const getXGBoostSteps: XGBoostDefinition["getSteps"] = async (
  config,
  initialStep,
) => {
  const steps = [initialStep];
  const { points, maxDepth, learningRate, numTrees } = config;
  let currentPoints = [...points];
  const trees: TreeNode[] = [];

  // For each tree in the ensemble
  for (let treeIndex = 0; treeIndex < numTrees; treeIndex++) {
    const currentTree = await buildDecisionTree(
      currentPoints,
      maxDepth,
      treeIndex * 200, // Offset each tree's visualization
    );

    // Add step to show tree structure being built
    steps.push({
      type: "buildTree",
      title: `Building Tree ${treeIndex + 1}`,
      state: {
        points: currentPoints,
        currentTree,
        trees,
        iteration: treeIndex,
      },
      description: (
        <div>
          <p>
            Building decision tree {treeIndex + 1} of {numTrees}
          </p>
          <ul>
            <li>Max depth: {maxDepth}</li>
            <li>Learning rate: {learningRate}</li>
          </ul>
        </div>
      ),
    });

    // Calculate predictions for current tree
    const treePredictions = currentPoints.map((point) =>
      predictWithTree(point, currentTree),
    );

    // Add step to show predictions from current tree
    steps.push({
      type: "calculatePredictions",
      title: `Tree ${treeIndex + 1} Predictions`,
      state: {
        points: currentPoints.map((point, i) => ({
          ...point,
          currentPrediction: treePredictions[i],
        })),
        currentTree,
        trees,
        iteration: treeIndex,
      },
      description: (
        <div>
          <p>Calculating predictions for tree {treeIndex + 1}</p>
          <p>
            These predictions will be scaled by the learning rate (
            {learningRate}) and added to the ensemble.
          </p>
        </div>
      ),
    });

    // Update residuals and prepare points for next iteration
    currentPoints = currentPoints.map((point, i) => ({
      ...point,
      label: point.label - learningRate * treePredictions[i]!, // Update residuals
      currentPrediction: treePredictions[i],
    }));

    // Add step to show residual updates
    steps.push({
      type: "updateResiduals",
      title: `Update Residuals - Tree ${treeIndex + 1}`,
      state: {
        points: currentPoints,
        currentTree,
        trees,
        iteration: treeIndex,
      },
      description: (
        <div>
          <p>Updating residuals after tree {treeIndex + 1}</p>
          <ul>
            <li>Residuals = Actual - Predicted</li>
            <li>These residuals will be the targets for the next tree</li>
          </ul>
        </div>
      ),
    });

    // Store the tree in the ensemble
    trees.push(currentTree);
  }

  // Final predictions using the entire ensemble
  const finalPredictions = currentPoints.map((point) => {
    let prediction = 0;
    trees.forEach((tree) => {
      prediction += learningRate * predictWithTree(point, tree);
    });
    return prediction;
  });

  // Add final step showing ensemble predictions
  steps.push({
    type: "finalPredictions",
    title: "Final Ensemble Predictions",
    state: {
      points: points.map((point, i) => ({
        ...point,
        currentPrediction: finalPredictions[i],
      })),
      trees,
      iteration: numTrees,
    },
    description: (
      <div>
        <p>Final predictions from the entire ensemble:</p>
        <ul>
          <li>Combined {numTrees} trees</li>
          <li>Each tree's contribution scaled by {learningRate}</li>
          <li>
            Mean Squared Error:{" "}
            {(
              finalPredictions.reduce(
                (sum, pred, i) => sum + Math.pow(pred! - points[i]!.label, 2),
                0,
              ) / points.length
            ).toFixed(4)}
          </li>
        </ul>
      </div>
    ),
  });

  return steps;
};

// Helper function to build a decision tree
async function buildDecisionTree(
  points: DataPoint[],
  maxDepth: number,
  xOffset: number = 0,
  currentDepth: number = 0,
  nodeId: string = "0",
): Promise<TreeNode> {
  // Base cases: max depth reached or not enough points
  if (currentDepth >= maxDepth || points.length < 2) {
    const prediction =
      points.reduce((sum, p) => sum + p.label, 0) / points.length;
    return {
      id: nodeId,
      prediction,
      coords: {
        x: xOffset,
        y: -currentDepth * 50, // Spread tree vertically
      },
    };
  }

  // Find best split (simplified version - using x coordinate as feature)
  const feature = 0; // Using x-coordinate as the split feature
  const sortedPoints = [...points].sort((a, b) => a.coords.x - b.coords.x);
  const splitIndex = Math.floor(points.length / 2);
  const splitValue = sortedPoints[splitIndex]!.coords.x;

  // Split points
  const leftPoints = points.filter((p) => p.coords.x <= splitValue);
  const rightPoints = points.filter((p) => p.coords.x > splitValue);

  // Create node
  const node: TreeNode = {
    id: nodeId,
    splitFeature: feature,
    splitValue,
    coords: {
      x: xOffset,
      y: -currentDepth * 50,
    },
  };

  // Recursively build children
  const spacing = 100 / (currentDepth + 1); // Adjust spacing based on depth
  node.left = await buildDecisionTree(
    leftPoints,
    maxDepth,
    xOffset - spacing,
    currentDepth + 1,
    nodeId + "L",
  );
  node.right = await buildDecisionTree(
    rightPoints,
    maxDepth,
    xOffset + spacing,
    currentDepth + 1,
    nodeId + "R",
  );

  return node;
}

// Helper function to make predictions with a tree
function predictWithTree(point: DataPoint, tree: TreeNode): number {
  if (tree.prediction !== undefined) {
    return tree.prediction;
  }

  if (!tree.splitFeature || tree.splitValue === undefined) {
    return 0;
  }

  // For this simplified version, we're always using x-coordinate as the feature
  const featureValue = point.coords.x;

  if (featureValue <= tree.splitValue) {
    return tree.left ? predictWithTree(point, tree.left) : 0;
  } else {
    return tree.right ? predictWithTree(point, tree.right) : 0;
  }
}
