import { calculateDistance } from "@repo/simulations/lib/utils";
import type { KMeansDefinition, Point } from "./types";
import { getMaterial } from "@repo/simulations/lib/materials";
import type { Group } from "@repo/simulations/lib/types";

export const getKMeansSteps: KMeansDefinition["getSteps"] = async (
  config,
  initialStep,
) => {
  const steps = [initialStep];
  const { points, k, maxIterations } = config;
  let { centroids } = initialStep.state;
  let iteration = 0;

  while (iteration < maxIterations) {
    // Initialize centroids if first iteration

    if (iteration === 0) {
      centroids = generateRandomCentroids(points, k);

      steps.push({
        type: "initializeCentroids",
        title: "Initialize Centroids",
        state: {
          points,
          centroids,
          iteration,
        },
        description: (
          <div>
            <p>Start by initializing {k} random centroids:</p>
            <ul>
              {centroids.map((centroid, index) => (
                <li key={centroid.id}>
                  Centroid {index + 1}: ({centroid.coords.x.toFixed(2)},{" "}
                  {centroid.coords.y.toFixed(2)}, {centroid.coords.z.toFixed(2)}
                  )
                </li>
              ))}
            </ul>
          </div>
        ),
      });
    }

    // Assign points to clusters
    const updatedPoints = points.map((point) => {
      const nearestCentroid = centroids.reduce((nearest, centroid) => {
        const distance = calculateDistance(point.coords, centroid.coords);
        return distance < calculateDistance(point.coords, nearest.coords)
          ? centroid
          : nearest;
      });
      return { ...point, group: nearestCentroid.group };
    });

    steps.push({
      type: "assignPointsToClusters",
      title: "Assign Points to Clusters",
      state: {
        points: updatedPoints,
        centroids,
        iteration,
      },
      description: (
        <div>
          <p>
            Assigning points to their nearest centroid based on Euclidean
            distance.
          </p>
          <p>Each point is colored according to its assigned cluster.</p>
        </div>
      ),
    });

    // Update centroids
    const updatedCentroids = centroids.map((centroid) => {
      const clusterPoints = updatedPoints.filter(
        (p) => p.group.label === centroid.group.label,
      );
      const newCoords = {
        x:
          clusterPoints.reduce((sum, p) => sum + p.coords.x, 0) /
          clusterPoints.length,
        y:
          clusterPoints.reduce((sum, p) => sum + p.coords.y, 0) /
          clusterPoints.length,
        z:
          clusterPoints.reduce((sum, p) => sum + p.coords.z, 0) /
          clusterPoints.length,
      };
      return { ...centroid, coords: newCoords };
    });

    steps.push({
      type: "updateCentroids",
      title: "Update Centroids",
      state: {
        points: updatedPoints,
        centroids: updatedCentroids,
        iteration,
      },
      description: (
        <div>
          <p>
            Update each centroid to the mean position of all points in its
            cluster.
          </p>
          <ul>
            {updatedCentroids.map((centroid, index) => (
              <li key={centroid.id}>
                Centroid {index + 1}: ({centroid.coords.x.toFixed(2)},{" "}
                {centroid.coords.y.toFixed(2)}, {centroid.coords.z.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      ),
    });

    // Check convergence
    const hasConverged = centroids.every(
      (centroid, i) =>
        calculateDistance(centroid.coords, updatedCentroids[i]!.coords) === 0,
    );

    steps.push({
      type: "checkConvergence",
      title: "Check Convergence",
      state: {
        points: updatedPoints,
        centroids: updatedCentroids,
        iteration: iteration + 1,
      },
      description: (
        <div>
          <p>
            Checking if the algorithm has converged by comparing the old and new
            centroid positions.
          </p>
          <p>
            {hasConverged
              ? "The algorithm has converged - centroids no longer move."
              : "Centroids are still moving - continue to next iteration."}
          </p>
          <p>
            Iteration: {iteration + 1} / {maxIterations}
          </p>
        </div>
      ),
    });

    if (hasConverged) break;
    centroids = updatedCentroids;
    iteration++;
  }

  return steps;
};

function generateRandomCentroids(points: Point[], k: number): Point[] {
  const centroids: Point[] = [];
  const groups = generateKGroups(k);
  const availablePoints = [...points];

  for (let i = 0; i < k; i++) {
    if (availablePoints.length === 0) {
      throw new Error("Not enough unique points to generate centroids");
    }
    const randomIndex = Math.floor(Math.random() * availablePoints.length);
    const randomPoint = availablePoints[randomIndex]!;
    centroids.push({
      id: `centroid-${i}`,
      coords: { ...randomPoint.coords },
      group: groups[i]!,
    });
    availablePoints.splice(randomIndex, 1);
  }

  return centroids;
}

function generateKGroups(k: number): Group[] {
  return Array.from({ length: k }, (_, i) => ({
    label: `Group ${i + 1}`,
    material: getMaterial(i),
  }));
}
