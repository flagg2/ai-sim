import test, { expect } from "@playwright/test";

test("Visual regression test", async ({ page }) => {
  // Set viewport size before navigating
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/linear-regression");

  await page
    .locator("label")
    .filter({ hasText: "Noise Level0" })
    .locator("span")
    .nth(1)
    .click({ position: { x: 0, y: 0 } });

  // Take screenshot
  await expect(page.getByRole("main").locator("canvas")).toHaveScreenshot(
    "linear-regression-page.png",
    {
      maxDiffPixelRatio: 0,
    },
  );
});
