import { test, expect } from "@playwright/test";

// Generate a consistent set of mock highscores for testing pagination
function generateMockHighscores(count: number = 105) {
  return Array.from({ length: count }, (_, i) => {
    const score = 1000 - i * 10;
    return {
      username: `User ${i + 1}`,
      score,
      date: Date.now() - i * 86400000, // Each score is one day older than the previous
    };
  });
}

test.describe("Highscores page", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the highscores API endpoint to return consistent test data
    await page.route("/api/highscores", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: generateMockHighscores() }),
      });
    });
  });

  test("displays highscores table with pagination", async ({ page }) => {
    await page.goto("/highscores");

    // Check page title is visible
    await expect(
      page.getByText("top 100 highscores", { exact: false }),
    ).toBeVisible();

    // Check the table is visible with headers
    await expect(page.getByRole("table")).toBeVisible();

    await expect(page.locator("th").nth(0)).toContainText("#");
    await expect(page.locator("th").nth(1)).toContainText("Username");
    await expect(page.locator("th").nth(2)).toContainText("Score");
    await expect(page.locator("th").nth(3)).toContainText("Date");

    // Verify first page shows correct data (20 items per page)
    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow.locator("td").nth(0)).toContainText("🥇");
    await expect(firstRow.locator("td").nth(1)).toContainText("User 1");
    await expect(firstRow.locator("td").nth(2)).toContainText("1,000");

    // Check pagination shows correct info
    await expect(page.getByText("Showing 1-20 of 105 entries")).toBeVisible();
  });

  test("pagination navigation works correctly", async ({ page }) => {
    await page.goto("/highscores");

    // Verify initial pagination state
    await expect(page.getByRole("button", { name: "1" })).toHaveClass(
      /bg-violet-600/,
    );
    await expect(
      page.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();

    // Go to page 2
    await page.getByRole("button", { name: "2" }).click();

    // Check URL and active button updates
    await expect(page.getByRole("button", { name: "2" })).toHaveClass(
      /bg-violet-600/,
    );
    await expect(page.getByRole("button", { name: "1" })).not.toHaveClass(
      /bg-violet-600/,
    );

    // Verify page 2 content
    const firstRowOnPage2 = page.locator("tbody tr").first();
    await expect(firstRowOnPage2.locator("td").nth(1)).toContainText("User 21");
    await expect(page.getByText("Showing 21-40 of 105 entries")).toBeVisible();

    // Test next page button
    await page.getByRole("button", { name: "Next page" }).click();
    await expect(page.getByRole("button", { name: "3" })).toHaveClass(
      /bg-violet-600/,
    );
    await expect(page.getByText("Showing 41-60 of 105 entries")).toBeVisible();

    // Test previous page button
    await page.getByRole("button", { name: "Previous page" }).click();
    await expect(page.getByRole("button", { name: "2" })).toHaveClass(
      /bg-violet-600/,
    );
    await expect(page.getByText("Showing 21-40 of 105 entries")).toBeVisible();
  });

  test("last page shows correct item count", async ({ page }) => {
    await page.goto("/highscores");

    // Link to the last page is not visible initially
    await page.getByRole("button", { name: "5" }).click();
    // Navigate to the last page (6th page with 105 items)
    await page.getByRole("button", { name: "6" }).click();

    // Check the page shows the correct range
    await expect(
      page.getByText("Showing 101-105 of 105 entries"),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Next page" }),
    ).toBeDisabled();
  });

  test("displays empty state when no highscores", async ({ page }) => {
    // Override the mock to return empty items
    await page.route("/api/highscores", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ items: [] }),
      });
    });

    await page.goto("/highscores");

    // Check empty state message is shown
    await expect(
      page.getByText("No highscores yet. Be the first to play!"),
    ).toBeVisible();

    // Table should not be visible
    await expect(page.getByRole("table")).not.toBeVisible();
  });

  test("shows error state when API fails", async ({ page }) => {
    // Mock API failure
    await page.route("/api/highscores", (route) => {
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Server error" }),
      });
    });

    await page.goto("/highscores");

    // Check error message is displayed
    await expect(page.getByText("Failed to load highscores")).toBeVisible();

    // Table should not be visible
    await expect(page.getByRole("table")).not.toBeVisible();
  });

  test("page numbers adjust based on current page", async ({ page }) => {
    await page.goto("/highscores");

    // Initially we should see pages 1-5
    await expect(page.getByRole("button", { name: "1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "5" })).toBeVisible();

    // Go to page 4
    await page.getByRole("button", { name: "4" }).click();

    // Now we should see pages 2-6 (adjusted around current page)
    await expect(page.getByRole("button", { name: "2" })).toBeVisible();
    await expect(page.getByRole("button", { name: "6" })).toBeVisible();

    // Go to last page
    await page.getByRole("button", { name: "6" }).click();

    // Now we should see pages 2-6
    await expect(page.getByRole("button", { name: "2" })).toBeVisible();
    await expect(page.getByRole("button", { name: "6" })).toBeVisible();
  });
});
