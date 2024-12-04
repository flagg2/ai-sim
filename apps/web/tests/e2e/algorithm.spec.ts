import { test, expect } from "@playwright/test";

test("Step navigation controls behave correctly", async ({ page }) => {
  await page.goto("/kmeans");

  // start the visualization
  await page.getByRole("button", { name: "Run" }).click();

  // initially, backward should be disabled and forward enabled
  await expect(page.getByRole("button", { name: "Backward" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Forward" })).toBeEnabled();

  // after moving forward, both controls should be enabled
  await page.getByRole("button", { name: "Forward" }).click();
  await expect(page.getByRole("button", { name: "Backward" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Forward" })).toBeEnabled();

  // check step counter updates
  await expect(page.getByText("2 /").first()).toContainText("2 /");
});

test("Play/pause functionality works", async ({ page }) => {
  await page.goto("/kmeans");
  await page.getByRole("button", { name: "Run" }).click();

  // initially should show play button
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();

  // click play and verify it changes to pause
  await page.getByRole("button", { name: "Play" }).click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();

  // click pause and verify it changes back to play
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
});

test("Configuration panel toggles correctly", async ({ page }) => {
  await page.goto("/kmeans");

  // initially configuration should be visible
  await expect(page.getByText("Configuration")).toBeVisible();

  // start visualization
  await page.getByRole("button", { name: "Run" }).click();

  // open configuration panel
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByText("Configuration")).toBeVisible();

  // close configuration panel
  await page.getByRole("button", { name: "Go back" }).click();
  await expect(page.getByText("Configuration")).not.toBeVisible();
});

test("Tooltip appears on hover", async ({ page }) => {
  await page.goto("/linear-regression");
  await page.getByRole("button", { name: "Run" }).click();

  // wait for Three.js to initialize
  await page.waitForTimeout(2000);

  const canvas = page.getByRole("main").locator("canvas");

  // perform pinch-to-zoom gesture in the center of the canvas
  await canvas.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    element.dispatchEvent(
      new WheelEvent("wheel", {
        deltaY: -100,
        ctrlKey: true,
        clientX: centerX,
        clientY: centerY,
      }),
    );
  });

  // hover the center of the canvas
  const canvasBounds = await canvas.boundingBox();
  if (!canvasBounds) throw new Error("Canvas not found");

  const centerX = canvasBounds.width / 2;
  const centerY = canvasBounds.height / 2;

  await canvas.hover({ position: { x: centerX, y: centerY } });

  // verify tooltip appears
  await expect(page.getByText(/Coords:/).first()).toBeAttached();
});
