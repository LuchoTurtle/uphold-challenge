import { test, expect } from "./fixtures/api-mock";

test("homepage has correct title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Uphold Currency Converter/);
});

test("theme toggle works", async ({ page }) => {
  await page.goto("/");

  // Get the initial theme (whichever it is)
  const initialTheme = await page.locator("html").getAttribute("data-theme");
  expect(initialTheme).not.toBeNull();

  // Target the switch label instead of the hidden checkbox
  await page.locator('[data-testid="theme-toggle-label"]').click();

  // Verify theme changed to something different
  const newTheme = await page.locator("html").getAttribute("data-theme");
  expect(newTheme).not.toBeNull();
  expect(newTheme).not.toBe(initialTheme);
});

test("currency converter displays rates", async ({ page }) => {
  await page.goto("/");

  // Wait for currency data to load
  await page.waitForSelector('[data-testid="currency-selector"]');

  // Select a currency
  await page.selectOption('[data-testid="currency-selector"]', "EUR");

  // Check if rates are displayed after selection
  await expect(page.locator('[data-testid="rates-list"]')).toBeVisible();
});
