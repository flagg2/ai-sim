import { test, expect } from "@playwright/test";

test("KMeans flow", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search...").click();
  await page.getByPlaceholder("Search...").fill("kmeans");
  await page.getByRole("link", { name: "K-Means K-Means Partition" }).click();
  await page
    .locator("label")
    .filter({ hasText: "Number of Points10" })
    .locator("span")
    .nth(1)
    .click();
  await page
    .locator("label")
    .filter({ hasText: "K3" })
    .locator("span")
    .nth(1)
    .click();
  await page
    .locator("label")
    .filter({ hasText: "Max Iterations10" })
    .locator("span")
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Run" }).click();
  await page.getByRole("button", { name: "Forward" }).click();

  await expect(page.getByText("Start by initializing 6")).toBeVisible();

  // find a element in form of x/n and get the number n
  const numberOfStepsText = await page.getByText("/").nth(1).textContent();
  if (!numberOfStepsText) {
    throw new Error("No number of steps text found");
  }
  const numberOfSteps = parseInt(numberOfStepsText.split("/")[1]) - 2;

  for (let i = 0; i < numberOfSteps; i++) {
    await page.getByRole("button", { name: "Forward" }).click();
  }

  await expect(
    page.getByRole("main").getByText("Check Convergence"),
  ).toBeAttached();

  await page.getByRole("button", { name: "Settings" }).click();

  await expect(
    page.getByRole("heading", { name: "Configuration" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Go back" }).click();

  await expect(
    page.getByRole("heading", { name: "AI Algorithm Visualizations" }),
  ).toBeVisible();
});

test("Linear Regression flow", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search...").click();
  await page.getByPlaceholder("Search...").fill("linear");
  await page.getByRole("link", { name: "Linear Regression" }).click();

  // Adjust noise level
  await page
    .locator("label")
    .filter({ hasText: "Noise Level0" })
    .locator("span")
    .nth(1)
    .click();

  // Adjust number of points
  await page
    .locator("label")
    .filter({ hasText: "Number of Points20" })
    .locator("span")
    .nth(1)
    .click();

  await page.getByRole("button", { name: "Run" }).click();

  // Check initial state
  await expect(page.getByText("Initial State").first()).toBeAttached();

  // Step through visualization
  await page.getByRole("button", { name: "Forward" }).click();
  await expect(page.getByText("Calculate Means").first()).toBeAttached();

  await page.getByRole("button", { name: "Forward" }).click();
  await expect(page.getByText("Calculate Coefficients").first()).toBeAttached();

  await page.getByRole("button", { name: "Forward" }).click();
  await expect(page.getByText("Update Regression Line").first()).toBeAttached();

  await page.getByRole("button", { name: "Forward" }).click();
  await expect(
    page.getByText("Calculate Sum of Squared Errors").first(),
  ).toBeAttached();

  // Test settings panel
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(
    page.getByRole("heading", { name: "Configuration" }),
  ).toBeVisible();

  // Return to main page
  await page.getByRole("button", { name: "Go back" }).click();
  await expect(
    page.getByRole("heading", { name: "AI Algorithm Visualizations" }),
  ).toBeVisible();
});
