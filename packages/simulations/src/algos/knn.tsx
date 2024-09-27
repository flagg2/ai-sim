import { getMaterial } from "../utils/materials";
import type { Algorithm, Coords, Group, Step } from "./common";
import { MathJax } from "better-react-mathjax";

export type Point = {
  id: string;
  coords: Coords;
  group: Group;
};

type KNNStepType =
  | "calculateDistance"
  | "updateNearestNeighbors"
  | "updateQueryPoint";

type KNNStepState = {
  currentIndex: number;
  distances: { point: Point; distance: number }[];
  nearestNeighbors?: Point[];
  queryPoint: Point;
};

export type KNNStep = Step<KNNStepState, KNNStepType>;

export type KNNConfig = {
  points: Point[];
  k: number;
  groups: Group[];
};

export type KNNAlgorithm = Algorithm<KNNStep, KNNConfig>;

function getLastStep(knn: KNNAlgorithm): KNNStep {
  if (knn.steps.length === 0) {
    throw new Error("No steps found");
  }
  return knn.steps[knn.steps.length - 1]!;
}

export function stepKNN(knn: KNNAlgorithm): KNNStep {
  const lastStep = getLastStep(knn);

  switch (lastStep.nextStep) {
    case "calculateDistance":
      return calculateDistanceStep(knn);
    case "updateNearestNeighbors":
      return updateNearestNeighborsStep(knn);
    case "updateQueryPoint":
      return updateQueryPointStep(knn);
    default:
      return lastStep;
  }
}

function updateQueryPointStep(knn: KNNAlgorithm): KNNStep {
  const lastStep = getLastStep(knn);

  // find most common group among nearest neighbors
  const nearestNeighbors = lastStep.state.nearestNeighbors || [];
  const groupCounts = new Map<Group["label"], number>();

  nearestNeighbors.forEach((neighbor) => {
    const groupLabel = neighbor.group.label;
    groupCounts.set(groupLabel, (groupCounts.get(groupLabel) || 0) + 1);
  });

  // find the group with the most count
  let mostCommonGroup: Group | undefined;
  let maxCount = 0;

  groupCounts.forEach((count, groupLabel) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonGroup = knn.config.groups.find((g) => g.label === groupLabel);
    }
  });

  if (!mostCommonGroup) {
    // TODO: this was thrown somehow
    throw new Error("No most common group found");
  }

  const updatedQueryPoint = {
    ...lastStep.state.queryPoint,
    group: mostCommonGroup,
  };

  return {
    type: "updateQueryPoint",
    title: "Update Query Point",
    index: lastStep.index + 1,
    state: {
      ...lastStep.state,
      queryPoint: updatedQueryPoint,
    },
    nextStep: null, // Algorithm complete
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
  };
}

function calculateDistanceStep(knn: KNNAlgorithm): KNNStep {
  const lastStep = getLastStep(knn);
  const currentIndex = lastStep.state.currentIndex + 1;
  const currentPoint = knn.config.points[currentIndex];
  if (!currentPoint) {
    return lastStep;
  }

  const distance = calculateDistance(
    lastStep?.state.queryPoint.coords,
    currentPoint.coords,
  );

  return {
    type: "calculateDistance",
    title: "Calculate Distance",
    index: lastStep.index + 1,
    state: {
      ...lastStep.state,
      distances: [
        ...(lastStep?.state.distances || []),
        { point: currentPoint, distance },
      ],
      currentIndex,
    },
    nextStep: "updateNearestNeighbors",
    description: (
      <div>
        <MathJax>
          <p>
            We calculate the euclidean distance between point {currentIndex} and
            the query point:
          </p>
          {`$$\\text{distance} = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2 + (z_2-z_1)^2}$$`}
          <br />
          {`$$(x_2-x_1) = ${currentPoint.coords.x - lastStep.state.queryPoint.coords.x}$$`}
          {`$$(y_2-y_1) = ${currentPoint.coords.y - lastStep.state.queryPoint.coords.y}$$`}
          {`$$(z_2-z_1) = ${currentPoint.coords.z - lastStep.state.queryPoint.coords.z}$$`}
          <br />
          {`$$\\text{distance} = \\sqrt{(${currentPoint.coords.x - lastStep.state.queryPoint.coords.x})^2 + (${currentPoint.coords.y - lastStep.state.queryPoint.coords.y})^2 + (${currentPoint.coords.z - lastStep.state.queryPoint.coords.z})^2} = ${distance.toFixed(2)}$$`}
        </MathJax>
      </div>
    ),
  };
}

function updateNearestNeighborsStep(knn: KNNAlgorithm): KNNStep {
  const lastStep = getLastStep(knn);
  const kNearest = lastStep.state
    .distances!.toSorted((a, b) => a.distance - b.distance)
    .slice(0, knn.config.k)
    .map((d) => d.point);

  const isLastPoint =
    lastStep.state.currentIndex === knn.config.points.length - 1;

  return {
    type: "updateNearestNeighbors",
    title: "Update Nearest Neighbors",
    index: lastStep.index + 1,
    state: {
      ...lastStep.state,
      nearestNeighbors: kNearest,
    },
    nextStep: isLastPoint ? "updateQueryPoint" : "calculateDistance",
    description: (
      <div>
        <p>The {knn.config.k} nearest neighbors for the current point are:</p>
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
              {lastStep.state.distances
                ?.find((d) => d.point.id === p.id)
                ?.distance.toFixed(2)}
            </li>
          ))}
        </ul>
        <br />
        <p>
          We do this step after each new distance is calculated for
          visualization purposes. Normally, we would wait until we've calculated
          the distance for all points before updating the nearest neighbors.
        </p>
      </div>
    ),
  };
}

// Helper function to calculate Euclidean distance
function calculateDistance(a: Point["coords"], b: Point["coords"]): number {
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
  points: Point[];
}): Point {
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
      point: Point | null;
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
    points: Point[];
  },
  numberOfPoints: number,
): Point[] {
  const points: Point[] = state.points.slice(0, numberOfPoints);
  while (points.length < numberOfPoints) {
    points.push(generateRandomPoint(state));
  }
  return points;
}
