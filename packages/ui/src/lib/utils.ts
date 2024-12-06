import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function snakeToTitleCase(input: string): string {
  return input
    .split("_")
    .map((word) => {
      if (word.toLowerCase() === "and") {
        return "and";
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};
