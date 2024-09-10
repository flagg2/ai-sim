import { MeshStandardMaterial } from "three";

const contrastingColors = [
  "hsl(0, 100%, 50%)", // Red
  "hsl(120, 100%, 50%)", // Green
  "hsl(240, 100%, 50%)", // Blue
  "hsl(60, 100%, 50%)", // Yellow
  "hsl(300, 100%, 50%)", // Magenta
  "hsl(180, 100%, 50%)", // Cyan
  "hsl(30, 100%, 50%)", // Orange
  "hsl(270, 100%, 25%)", // Purple
  "hsl(350, 100%, 88%)", // Pink
  "hsl(0, 100%, 25%)", // Dark Red
  "hsl(120, 100%, 25%)", // Dark Green
  "hsl(60, 100%, 25%)", // Olive
  "hsl(0, 0%, 75%)", // Silver,
];

function getContrastingColor(at: number): string {
  if (at < 0 || at >= contrastingColors.length) {
    // Generate a color using the golden angle approach
    const hue = (at * 137.5) % 360;
    return `hsl(${hue}, 100%, 50%)`;
  }

  return contrastingColors[at]!;
}

export function getMaterial(at: number): MeshStandardMaterial {
  return new MeshStandardMaterial({ color: getContrastingColor(at) });
}

export function getWhiteMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({ color: "white" });
}
