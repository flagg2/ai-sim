import type { SVMDefinition, DataPoint } from "./types";

export const getSVMConfig: SVMDefinition["getConfig"] = (params) => {
  const points = generatePoints(params.points, params.useRadialData);
  return {
    points,
  };
};

let id = 0;

function getNextId() {
  return id++;
}

function generatePoints(
  numberOfPoints: number,
  showcaseKernel: boolean,
): DataPoint[] {
  const points: DataPoint[] = [];

  if (showcaseKernel) {
    // Generate circular pattern (non-linearly separable)
    for (let i = 0; i < numberOfPoints; i++) {
      const angle = (i / numberOfPoints) * Math.PI * 2;
      const noiseX = (Math.random() - 0.5) * 10; // ±5 noise
      const noiseY = (Math.random() - 0.5) * 10; // ±5 noise

      // Inner circle (negative class)
      points.push({
        id: getNextId().toString(),
        coords: {
          x: Math.cos(angle) * 30 + 70 + noiseX,
          y: Math.sin(angle) * 30 + 70 + noiseY,
        },
        label: -1,
      });

      // Outer circle (positive class)
      // Use different noise for outer circle
      const outerNoiseX = (Math.random() - 0.5) * 10;
      const outerNoiseY = (Math.random() - 0.5) * 10;
      points.push({
        id: getNextId().toString(),
        coords: {
          x: Math.cos(angle) * 60 + 70 + outerNoiseX,
          y: Math.sin(angle) * 60 + 70 + outerNoiseY,
        },
        label: 1,
      });
    }
  } else {
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
  }

  return points;
}
