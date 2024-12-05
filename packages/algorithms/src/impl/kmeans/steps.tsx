import { calculateDistance } from "../../lib/utils";
import type { KMeansDefinition, Point } from "./types";
import { getColoredMaterial } from "../../lib/materials";
import type { Group } from "../../lib";
import Text from "../../lib/descriptions/text";
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
          <Text>
            <Paragraph>
              First, we randomly place <Expression>k={k}</Expression> center
              points (called centroids) in our data space. These centroids will
              help us group similar points together.
            </Paragraph>
            <Note>
              Think of centroids as the "representatives" of each group we want
              to create. We're starting with random positions, but they'll move
              to better locations as the algorithm runs.
            </Note>
          </Text>
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
        <Text>
          <Paragraph>
            For each point in our dataset, we find the closest centroid and
            assign the point to that centroid's group. We measure "closest" by
            calculating the straight-line distance between the point and each
            centroid.
          </Paragraph>
          <Note>
            Points are colored based on which centroid they're closest to. All
            points of the same color belong to the same group.
          </Note>
        </Text>
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
        <Text>
          <Paragraph>
            Now that points are assigned to groups, we move each centroid to the
            center of its group. We do this by calculating the average position
            of all points in the group.
          </Paragraph>
          <Note>
            This helps centroids move to better positions that better represent
            their group of points.
          </Note>
        </Text>
      ),
    });

    const hasConverged = centroids.every(
      (centroid, i) =>
        calculateDistance(centroid.coords, updatedCentroids[i]!.coords) === 0,
    );

    steps.push({
      type: "checkConvergence",
      title: "Check if Complete",
      state: {
        points: updatedPoints,
        centroids: updatedCentroids,
        iteration: iteration + 1,
      },
      description: (
        <Text>
          <Paragraph>
            We check if the centroids have stopped moving. If they haven't moved
            since the last time we checked, we've found our final groups.
          </Paragraph>
          <Note>
            {hasConverged
              ? "The centroids are now in their final positions! Each group is as well-defined as it can be."
              : "The centroids are still moving to find better positions - we'll repeat the process."}
          </Note>
        </Text>
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
