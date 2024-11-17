import { test, expect } from "@playwright/test";

test("Has title and links", async ({ page }) => {
  await page.goto("/");

  // Check title
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "AI Algorithm Visualizations",
  );

  // Check if visualizations are present
  await expect(page.getByRole("link")).toHaveCount(6); // Adjust count based on your visualizations
});

test("Search functionality works correctly", async ({ page }) => {
  await page.goto("/");

  // Get the search input
  const searchInput = page.getByRole("searchbox");
  await expect(searchInput).toBeVisible();

  // Initially should show all visualizations
  await expect(page.getByRole("link")).toHaveCount(6);

  // Search for "clustering"
  await searchInput.fill("clustering");

  // Should show K-Means visualization
  const links = page.getByRole("link");
  await expect(links).toHaveCount(1);
  await expect(links.first()).toContainText("K-Means");

  // Clear search should show all visualizations again
  await searchInput.clear();
  await expect(page.getByRole("link")).toHaveCount(6);

  // Search for "neural"
  await searchInput.fill("neural");

  // Should show Neural Network and Autoencoder visualizations
  await expect(page.getByRole("link")).toHaveCount(2);
  await expect(page.getByText("Feedforward Neural Network")).toBeVisible();
  await expect(page.getByText("Autoencoder")).toBeVisible();
});
