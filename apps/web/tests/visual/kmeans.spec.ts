import test, { expect } from "@playwright/test";
import { addMockRandomInitScript } from "../utils";

test("Visual regression test", async ({ page }) => {
  await addMockRandomInitScript(page);

  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/kmeans");

  await page.waitForTimeout(1000);
  await expect(page.getByRole("main").locator("canvas")).toHaveScreenshot(
    "kmeans-page.png",
  );
});
