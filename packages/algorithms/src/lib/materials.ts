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

export function getColoredMaterial(at: number): MeshStandardMaterial {
  return new MeshStandardMaterial({ color: getContrastingColor(at) });
}

export function getWhiteMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({ color: "white" });
}

export function getPinkMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({ color: "pink" });
}

export function getInactiveMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({ color: "gray" });
}

export function getActiveMaterial(
  activation: number,
  hue: number = 240, // Fixed hue for red
): MeshStandardMaterial {
  // Transition from gray (saturation 0%) to bright red (saturation 100%)
  const saturation = activation * 100; // Varies from 0% (gray) to 100% (red)
  const lightness = 50; // Fixed at 50% for brightness consistency

  return new MeshStandardMaterial({
    color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
  });
}

export function getWeightMaterial(activation: number): MeshStandardMaterial {
  // Determine hue (0 for red, 120 for green)
  const hue = activation >= 0 ? 120 : 0; // 0 (red) on the left, 120 (green) on the right

  // Calculate saturation from activation, going from 100% at |activation| = 1 to 0% at activation = 0
  const saturation = 100 * Math.abs(activation); // Full saturation at |activation| = 1, grey (0%) at 0

  const lightness = 50; // Constant lightness for consistency

  return new MeshStandardMaterial({
    color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
  });
}
