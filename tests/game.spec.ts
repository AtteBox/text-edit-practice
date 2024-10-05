import { test, expect } from '@playwright/test';

test('initially shows start view', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText("Welcome to Typo Terminator!")).toBeVisible();
});
