import type { SVMDefinition, DataPoint } from "./types";
import {
  RADIAL_CENTER_X,
  RADIAL_CENTER_Y,
  RADIAL_INNER_RADIUS,
  RADIAL_OUTER_MIN,
  RADIAL_OUTER_MAX,
  LINEAR_RANGE,
  MIN_COORDINATE,
} from "./const";

export const getSVMConfig: SVMDefinition["getConfig"] = (params) => {
  const points = params.generateRadialData
    ? generateRadialPoints(params.points)
    : generatePoints(params.points);
  return {
    points,
    kernelType: params.kernelType,
  };
};

let id = 0;

function getNextId() {
  return id++;
}

function generateRadialPoints(numberOfPoints: number): DataPoint[] {
  const points: DataPoint[] = [];
  const centerX = RADIAL_CENTER_X;
  const centerY = RADIAL_CENTER_Y;
  const innerRadius = RADIAL_INNER_RADIUS;
  const outerRadiusMin = RADIAL_OUTER_MIN;
  const outerRadiusMax = RADIAL_OUTER_MAX;

  // Generate inner circle (negative class)
  for (let i = 0; i < numberOfPoints / 2; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * innerRadius;
    points.push({
      id: getNextId().toString(),
      coords: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
      label: -1,
    });
  }

  // Generate outer ring (positive class)
  for (let i = 0; i < numberOfPoints / 2; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius =
      outerRadiusMin + Math.random() * (outerRadiusMax - outerRadiusMin);
    points.push({
      id: getNextId().toString(),
      coords: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      },
      label: 1,
    });
  }

  return points;
}

function generatePoints(numberOfPoints: number): DataPoint[] {
  const points: DataPoint[] = [];

  for (let i = 0; i < numberOfPoints / 2; i++) {
    // Negative class (bottom-left)
    points.push({
      id: getNextId().toString(),
      coords: {
        x: Math.random() * LINEAR_RANGE + MIN_COORDINATE,
        y: Math.random() * LINEAR_RANGE + MIN_COORDINATE,
      },
      label: -1,
    });
    // Positive class (top-right)
    points.push({
      id: getNextId().toString(),
      coords: {
        x: Math.random() * LINEAR_RANGE + RADIAL_CENTER_X,
        y: Math.random() * LINEAR_RANGE + RADIAL_CENTER_Y,
      },
      label: 1,
    });
  }

  return points;
}
