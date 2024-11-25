import { calculateDistance } from "../../lib/utils";
import type { KMeansDefinition, Point } from "./types";
import { getColoredMaterial } from "../../lib/materials";
import type { Group } from "../../lib";
import Description from "../../lib/descriptions/description";
import Paragraph from "../../lib/descriptions/paragraph";
import Note from "../../lib/descriptions/note";
import Expression from "../../lib/descriptions/math";

export const getKMeansSteps: KMeansDefinition["getSteps"] = async (
  config,
  initialStep,
) => {
  const steps = [initialStep];
  const { points, k, maxIterations } = config;
  let { centroids } = initialStep.state;
  let iteration = 0;

  while (iteration < maxIterations) {
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
          <Description>
            <Paragraph>
              Because it is the first iteration, we start by initializing{" "}
              <Expression>k={k}</Expression> random centroids.
            </Paragraph>
          </Description>
        ),
      });
    }

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
        <Description>
          <Paragraph>
            We assign each point to the nearest centroid based on Euclidean
            distance.
          </Paragraph>
          <Note>Each point is colored according to its assigned cluster.</Note>
        </Description>
      ),
    });

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
        <Description>
          <Paragraph>
            Update each centroid to the mean position (
            <Expression>\mu</Expression>) of all points in its cluster.
          </Paragraph>
        </Description>
      ),
    });

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
        <Description>
          <Paragraph>
            We check if the algorithm has converged by comparing the old and new
            centroid positions.
          </Paragraph>
          <Note>
            {hasConverged
              ? "The algorithm has converged - centroids no longer move. We can stop the algorithm."
              : "Centroids are still moving - continue to next iteration."}
          </Note>
        </Description>
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
    material: getColoredMaterial(i),
  }));
}
