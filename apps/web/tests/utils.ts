import { Page } from "@playwright/test";

export const addMockRandomInitScript = async (page: Page) => {
  await page.addInitScript(() => {
    let seed = 45;
    Math.random = () => {
      seed = seed + 0x6d2b79f5;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
};
