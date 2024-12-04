import { MeshStandardMaterial } from "three";

const contrastingColors = [
  "hsl(0, 100%, 50%)",
  "hsl(120, 100%, 50%)",
  "hsl(240, 100%, 50%)",
  "hsl(60, 100%, 50%)",
  "hsl(300, 100%, 50%)",
  "hsl(180, 100%, 50%)",
  "hsl(30, 100%, 50%)",
  "hsl(270, 100%, 25%)",
  "hsl(350, 100%, 88%)",
  "hsl(0, 100%, 25%)",
  "hsl(120, 100%, 25%)",
  "hsl(60, 100%, 25%)",
  "hsl(0, 0%, 75%)",
];

function getContrastingColor(at: number): string {
  if (at < 0 || at >= contrastingColors.length) {
    // generate a color using the golden angle approach
    const hue = (at * 137.5) % 360;
    return `hsl(${hue}, 100%, 50%)`;
  }

  return contrastingColors[at]!;
}

/**
 * Returns a material with a color based on the index.
 */
export function getColoredMaterial(at: number): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: getContrastingColor(at),
  });
}

/**
 * Returns a material interpolating between blue and gray based on the activation value.
 */
export function getActiveMaterial(
  activation: number,
  hue: number = 240,
): { light: MeshStandardMaterial; dark: MeshStandardMaterial } {
  const saturation = activation * 100;

  return {
    dark: new MeshStandardMaterial({
      color: `hsl(${hue}, ${saturation}%, 50%)`,
    }),
    light: new MeshStandardMaterial({
      color: `hsl(${hue}, ${saturation}%, ${100 - activation * 50}%)`,
    }),
  };
}

/**
 * Returns a material interpolating between red and green based on the activation value.
 */
export function getWeightMaterial(activation: number): {
  light: MeshStandardMaterial;
  dark: MeshStandardMaterial;
} {
  const hue = activation >= 0 ? 120 : 0;

  const saturation = 100 * Math.abs(activation);

  return {
    dark: new MeshStandardMaterial({
      color: `hsl(${hue}, ${saturation}%, 50%)`,
    }),
    light: new MeshStandardMaterial({
      color: `hsl(${hue}, ${saturation}%, ${90 - Math.abs(activation) * 40}%)`,
    }),
  };
}
