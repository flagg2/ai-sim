import { test, expect } from "@playwright/test";

test("Has title and links", async ({ page }) => {
  await page.goto("/");

  // check title
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "AI Algorithm Visualizations",
  );

  // check if visualizations are present
  await expect(page.getByRole("link")).toHaveCount(6);
});

test("Search functionality works correctly", async ({ page }) => {
  await page.goto("/");

  // get the search input
  const searchInput = page.getByRole("searchbox");
  await expect(searchInput).toBeVisible();

  // initially should show all visualizations
  await expect(page.getByRole("link")).toHaveCount(6);

  // search for "clustering"
  await searchInput.fill("clustering");

  // should show K-Means visualization
  const links = page.getByRole("link");
  await expect(links).toHaveCount(1);
  await expect(links.first()).toContainText("K-Means");

  // clear search should show all visualizations again
  await searchInput.clear();
  await expect(page.getByRole("link")).toHaveCount(6);

  // search for "neural"
  await searchInput.fill("neural");

  // should show Neural Network and Autoencoder visualizations
  await expect(page.getByRole("link")).toHaveCount(2);
  await expect(page.getByText("Feedforward Neural Network")).toBeVisible();
  await expect(page.getByText("Autoencoder")).toBeVisible();
});
