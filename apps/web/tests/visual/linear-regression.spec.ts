import test, { expect } from "@playwright/test";
import { addMockRandomInitScript } from "../utils";

test("Visual regression test", async ({ page }) => {
  await addMockRandomInitScript(page);
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/linear-regression");

  await expect(page.getByRole("main").locator("canvas")).toHaveScreenshot(
    "linear-regression-page.png",
  );
});
