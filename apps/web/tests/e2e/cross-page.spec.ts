import { test, expect } from "@playwright/test";

test("KMeans flow", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search for an algorithm...").click();
  await page.getByPlaceholder("Search for an algorithm...").fill("kmeans");
  await page.getByRole("link", { name: "K-Means K-Means Partition" }).click();
  await page
    .locator("label")
    .filter({ hasText: "Number of Points" })
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
    .filter({ hasText: "Max Iterations" })
    .locator("span")
    .nth(1)
    .click();
  // wait for the page to load
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: "Run" }).click();

  await page.waitForTimeout(1000);
  await page.getByRole("button", { name: "Forward" }).click();

  await expect(page.getByText("called centroids")).toBeVisible();

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
    page.getByRole("main").getByText("Check If Complete"),
  ).toBeAttached();

  await page.getByRole("button", { name: "Settings" }).click();

  await expect(page.getByText("Number of Points")).toBeVisible();
});

test("Linear Regression flow", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search for an algorithm...").click();
  await page.getByPlaceholder("Search for an algorithm...").fill("linear");
  await page.getByRole("link", { name: "Linear Regression" }).click();

  // adjust noise level
  await page
    .locator("label")
    .filter({ hasText: "Noise Level0" })
    .locator("span")
    .nth(1)
    .click();

  // adjust number of points
  await page
    .locator("label")
    .filter({ hasText: "Number of Points20" })
    .locator("span")
    .nth(1)
    .click();

  // wait for the page to load
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: "Run" }).click();

  await page.waitForTimeout(1000);

  // check initial state
  await expect(page.getByText("Initial State").first()).toBeAttached();

  // step through visualization
  await page.getByRole("button", { name: "Forward" }).click();
  await expect(page.getByText("Calculate Means").first()).toBeAttached();

  await page.getByRole("button", { name: "Forward" }).click();
  await expect(page.getByText("Calculate Coefficients").first()).toBeAttached();

  await page.getByRole("button", { name: "Forward" }).click();
  await expect(page.getByText("Create Regression Line").first()).toBeAttached();

  await page.getByRole("button", { name: "Forward" }).click();
  await expect(
    page.getByText("Evaluate Model Accuracy").first(),
  ).toBeAttached();

  // test settings panel
  await page.getByRole("button", { name: "Settings" }).click();
  await expect(page.getByText("Number of Points")).toBeVisible();

  // return to main page
  await page.getByRole("button", { name: "Go back" }).click();
  await expect(page.getByRole("heading", { name: "MLens" })).toBeVisible();
});
