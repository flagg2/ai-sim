import test, { expect } from "@playwright/test";
import { addMockRandomInitScript } from "../utils";

test("Visual regression test", async ({ page }) => {
  await addMockRandomInitScript(page);
  // Set viewport size before navigating
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/autoencoder");

  // Take screenshot
  await expect(page.getByRole("main").locator("canvas")).toHaveScreenshot(
    "autoencoder-page.png",
  );
});
