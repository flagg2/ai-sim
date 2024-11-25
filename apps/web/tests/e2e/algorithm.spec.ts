import { test, expect } from "@playwright/test";

test("Step navigation controls behave correctly", async ({ page }) => {
  await page.goto("/kmeans");

  // Start the visualization
  await page.getByRole("button", { name: "Run" }).click();

  // Initially, backward should be disabled and forward enabled
  await expect(page.getByRole("button", { name: "Backward" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Forward" })).toBeEnabled();

  // After moving forward, both controls should be enabled
  await page.getByRole("button", { name: "Forward" }).click();
  await expect(page.getByRole("button", { name: "Backward" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Forward" })).toBeEnabled();

  // Check step counter updates
  await expect(page.getByText("2 /").first()).toContainText("2 /");
});

test("Play/pause functionality works", async ({ page }) => {
  await page.goto("/kmeans");
  await page.getByRole("button", { name: "Run" }).click();

  // Initially should show play button
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();

  // Click play and verify it changes to pause
  await page.getByRole("button", { name: "Play" }).click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();

  // Click pause and verify it changes back to play
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
});

test("Configuration panel toggles correctly", async ({ page }) => {
  await page.goto("/kmeans");

  // Initially configuration should be visible
  await expect(page.getByText("Configuration")).toBeVisible();

  // Start visualization
  await page.getByRole("button", { name: "Run" }).click();

  // Open configuration panel
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByText("Configuration")).toBeVisible();

  // Close configuration panel
  await page.getByRole("button", { name: "Go back" }).click();
  await expect(page.getByText("Configuration")).not.toBeVisible();
});

test("Tooltip appears on hover", async ({ page }) => {
  await page.goto("/linear-regression");
  await page.getByRole("button", { name: "Run" }).click();

  // Wait for Three.js to initialize
  await page.waitForTimeout(2000);

  const canvas = page.getByRole("main").locator("canvas");

  // Perform pinch-to-zoom gesture in the center of the canvas
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

  // Hover the center of the canvas
  const canvasBounds = await canvas.boundingBox();
  if (!canvasBounds) throw new Error("Canvas not found");

  const centerX = canvasBounds.width / 2;
  const centerY = canvasBounds.height / 2;

  await canvas.hover({ position: { x: centerX, y: centerY } });

  // Verify tooltip appears
  await expect(page.getByText(/Coords:/).first()).toBeAttached();
});
