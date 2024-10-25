import type { Group } from "../types";
import { calculateDistance } from "../utils";
import type { DataPoint, KNNDefinition, KNNStep } from "./types";

export const getKNNSteps: KNNDefinition["getSteps"] = (config, initialStep) => {
  const steps: KNNStep[] = [initialStep];
  const { points, k, groups } = config;
  const queryPoint = points[points.length - 1]!;
  let distances: { point: DataPoint; distance: number }[] = [];

  // Calculate distances and update nearest neighbors
  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i]!;
    const distance = calculateDistance(queryPoint.coords, currentPoint.coords);
    distances.push({ point: currentPoint, distance });

    steps.push({
      type: "calculateDistance",
      title: "Calculate Distance",
      index: steps.length,
      state: {
        currentIndex: i,
        distances: [...distances],
        queryPoint,
      },
      description: (
        <div>
          <p>
            We calculate the euclidean distance between point {i} and the query
            point.
          </p>
        </div>
      ),
    });

    const kNearest = distances
      .toSorted((a, b) => a.distance - b.distance)
      .slice(0, k)
      .map((d) => d.point);

    steps.push({
      type: "updateNearestNeighbors",
      title: "Update Nearest Neighbors",
      index: steps.length,
      state: {
        currentIndex: i,
        distances: [...distances],
        nearestNeighbors: kNearest,
        queryPoint,
      },

      description: (
        <div>
          <p>The {k} nearest neighbors for the current point are:</p>
          <ul>
            {kNearest.map((p) => (
              <li key={p.id}>
                Point {p.id} (Group:{" "}
                <span
                  style={{
                    color: `#${p.group.material.color.getHexString()}`,
                  }}
                >
                  {p.group.label}
                </span>
                ) Distance:{" "}
                {distances
                  .find((d) => d.point.id === p.id)
                  ?.distance.toFixed(2)}
              </li>
            ))}
          </ul>
          <br />
          <p>
            We do this step after each new distance is calculated for
            visualization purposes. Normally, we would wait until we've
            calculated the distance for all points before updating the nearest
            neighbors.
          </p>
        </div>
      ),
    });
  }

  // Update query point
  const nearestNeighbors = distances
    .toSorted((a, b) => a.distance - b.distance)
    .slice(0, k)
    .map((d) => d.point);

  const groupCounts = new Map<Group["label"], number>();
  nearestNeighbors.forEach((neighbor) => {
    const groupLabel = neighbor.group.label;
    groupCounts.set(groupLabel, (groupCounts.get(groupLabel) || 0) + 1);
  });

  let mostCommonGroup: Group | undefined;
  let maxCount = 0;

  groupCounts.forEach((count, groupLabel) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonGroup = groups.find((g) => g.label === groupLabel);
    }
  });

  if (!mostCommonGroup) {
    throw new Error("No most common group found");
  }

  const updatedQueryPoint = {
    ...queryPoint,
    group: mostCommonGroup,
  };

  steps.push({
    type: "updateQueryPoint",
    title: "Update Query Point",
    index: steps.length,
    state: {
      currentIndex: points.length - 1,
      distances,
      nearestNeighbors,
      queryPoint: updatedQueryPoint,
    },
    description: (
      <div>
        <p>We've found the most common group among the nearest neighbors.</p>
        <p>
          The query point is now classified as:{" "}
          <strong
            style={{
              color: `#${mostCommonGroup?.material.color.getHexString()}`,
            }}
          >
            {mostCommonGroup?.label}
          </strong>
        </p>
      </div>
    ),
  });

  return steps;
};
