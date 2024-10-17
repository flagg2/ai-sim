import {
  getMaterial,
  getPinkMaterial,
  getWhiteMaterial,
} from "../utils/materials";
import type { Algorithm, Coords3D, Group, Step } from "./common";
import { MathJax } from "better-react-mathjax";
import type { Renderable } from "./objects/renderable";
import { Point3D } from "./objects/point";
import { Tube } from "./objects/tube";

// TODO: one point gets skipped - evident with few points

export type DataPoint = {
  id: string;
  coords: Coords3D;
  group: Group;
};

type KNNStepType =
  | "calculateDistance"
  | "updateNearestNeighbors"
  | "updateQueryPoint";

type KNNStepState = {
  currentIndex: number;
  distances: { point: DataPoint; distance: number }[];
  nearestNeighbors?: DataPoint[];
  queryPoint: DataPoint;
};

export type KNNStep = Step<KNNStepState, KNNStepType>;

export type KNNConfig = {
  points: DataPoint[];
  k: number;
  groups: Group[];
};

export type KNNAlgorithm = Algorithm<KNNStep, KNNConfig>;

export function renderKNN(
  state: KNNStepState,
  config: KNNConfig,
): Renderable[] {
  const renderables: Renderable[] = [];

  // Render query point
  renderables.push(
    new Point3D({
      coords: state.queryPoint.coords,
      material: state.queryPoint.group.material,
      tooltip: (
        <div>
          Query Point
          <br />
          Coords: {state.queryPoint.coords.x}&nbsp;
          {state.queryPoint.coords.y}&nbsp;
          {state.queryPoint.coords.z}
          <br />
          <span
            style={{
              color: `#${state.queryPoint.group.material.color.getHexString()}`,
            }}
          >
            {state.queryPoint.group.label}
          </span>
        </div>
      ),
      name: "Query Point",
    }),
  );

  // Render all points
  config.points.forEach((point) => {
    renderables.push(
      new Point3D({
        coords: point.coords,
        material: point.group.material,
        tooltip: (
          <div>
            Point {point.id} <br />
            Coords: {point.coords.x} {point.coords.y} {point.coords.z}
            <br />
            <span
              style={{
                color: `#${point.group.material.color.getHexString()}`,
              }}
            >
              {point.group.label}
            </span>
          </div>
        ),
        name: `Point ${point.id}`,
      }),
    );
  });

  // Render tubes for nearest neighbors
  if (state.nearestNeighbors) {
    state.nearestNeighbors.forEach((point, index) => {
      renderables.push(
        new Tube({
          from: point.coords,
          to: state.queryPoint.coords,
          material: getWhiteMaterial(),
          name: `Nearest Neighbor ${index + 1}`,
          radius: 0.2,
        }),
      );
    });
  }

  // Render tube for current distance calculation
  if (
    state.distances.length > 0 &&
    state.currentIndex < state.distances.length
  ) {
    const currentPoint = state.distances[state.currentIndex]?.point;
    if (currentPoint) {
      renderables.push(
        new Tube({
          from: currentPoint.coords,
          to: state.queryPoint.coords,
          material: getPinkMaterial(),
          name: "Current Distance",
          radius: 0.5,
        }),
      );
    }
  }

  return renderables;
}

export function simulateKNN(
  config: KNNConfig,
  initialStep: KNNStep,
): KNNStep[] {
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
          <MathJax>
            <p>
              We calculate the euclidean distance between point {i} and the
              query point:
            </p>
          </MathJax>
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
}

// Helper function to calculate Euclidean distance
function calculateDistance(
  a: DataPoint["coords"],
  b: DataPoint["coords"],
): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
  );
}

export function generateKGroups(k: number): Group[] {
  return Array.from({ length: k }, (_, i) => ({
    label: `Group ${i + 1}`,
    material: getMaterial(i),
  }));
}

function randomValue(similarityTendency: number, group: Group): number {
  return (
    Math.floor(Math.random() * 100) +
    1 +
    (Math.random() < similarityTendency ? group.label.charCodeAt(6) : 0)
  );
}

const defaultGroupSimilarityTendency = 0;

let id = 0;

function getNextId() {
  return id++;
}

export function generateRandomPoint({
  groups,
  points,
}: {
  groups: Group[];
  points: DataPoint[];
}): DataPoint {
  const group = groups[Math.floor(Math.random() * groups.length)]!;
  const coords = {
    x: randomValue(defaultGroupSimilarityTendency, group),
    y: randomValue(defaultGroupSimilarityTendency, group),
    z: randomValue(defaultGroupSimilarityTendency, group),
  };

  // TODO: this check can be improved but we can tolerate it since max number of points is low
  const closestPoint = points.reduce(
    (closest, point) => {
      const distance = calculateDistance(coords, point.coords);
      return distance < closest.distance ? { point, distance } : closest;
    },
    { point: null, distance: Infinity } as {
      point: DataPoint | null;
      distance: number;
    },
  );

  const distance = closestPoint.point
    ? calculateDistance(coords, closestPoint.point.coords)
    : Infinity;

  // TODO: doesn't work
  if (distance < 10) {
    return generateRandomPoint({ groups, points });
  }
  return {
    id: getNextId().toString(),
    coords: {
      x: randomValue(defaultGroupSimilarityTendency, group),
      y: randomValue(defaultGroupSimilarityTendency, group),
      z: randomValue(defaultGroupSimilarityTendency, group),
    },
    group: group,
  };
}

export function generateRandomPoints(
  state: {
    groups: Group[];
    points: DataPoint[];
  },
  numberOfPoints: number,
): DataPoint[] {
  const points: DataPoint[] = state.points.slice(0, numberOfPoints);
  while (points.length < numberOfPoints) {
    points.push(generateRandomPoint(state));
  }
  return points;
}
