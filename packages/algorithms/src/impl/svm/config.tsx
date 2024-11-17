import type { SVMDefinition, DataPoint } from "./types";

export const getSVMConfig: SVMDefinition["getConfig"] = (params) => {
  const points = generatePoints(params.points);
  return {
    points,
  };
};

let id = 0;

function getNextId() {
  return id++;
}

function generatePoints(numberOfPoints: number): DataPoint[] {
  const points: DataPoint[] = [];

  // Generate linearly separable data
  for (let i = 0; i < numberOfPoints; i++) {
    // Negative class (bottom-left)
    points.push({
      id: getNextId().toString(),
      coords: {
        x: Math.random() * 40 + 20, // 20 to 60
        y: Math.random() * 40 + 20, // 20 to 60
      },
      label: -1,
    });
    // Positive class (top-right)
    points.push({
      id: getNextId().toString(),
      coords: {
        x: Math.random() * 40 + 60, // 60 to 100
        y: Math.random() * 40 + 60, // 60 to 100
      },
      label: 1,
    });
  }

  return points;
}
