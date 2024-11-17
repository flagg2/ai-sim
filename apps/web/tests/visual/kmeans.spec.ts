import test, { expect } from "@playwright/test";

test("Visual regression test", async ({ page }) => {
  // Set viewport size before navigating
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/kmeans");

  // Take screenshot
  await expect(page.getByRole("main").locator("canvas")).toHaveScreenshot(
    "kmeans-page.png",
    {
      maxDiffPixelRatio: 0.05,
    },
  );
});
