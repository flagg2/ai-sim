import test, { expect } from "@playwright/test";
import { addMockRandomInitScript } from "../utils";

test("Visual regression test", async ({ page }) => {
  // Set viewport size before navigating
  await addMockRandomInitScript(page);
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/xgboost");

  // Take screenshot
  await expect(page.getByRole("main").locator("canvas")).toHaveScreenshot(
    "xgboost-page.png",
  );
});
