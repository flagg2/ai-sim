import { Coords3D } from "./types";

export function calculateDistance(a: Coords3D, b: Coords3D): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2),
  );
}

let id = 0;

export function getNextId() {
  return (id++).toString();
}
