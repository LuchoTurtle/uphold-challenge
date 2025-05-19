import { test as base } from "@playwright/test";

// Create a fixture that extends the base test
export const test = base.extend({
  // Setup API mocking for each test that uses this fixture
  page: async ({ page }, use) => {
    // Mock API responses
    await page.route("**/api**", async (route) => {
      if (route.request().url().includes("/api/ticker")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            { pair: "BTC-USD", ask: "42000", bid: "41900", currency: "USD" },
            { pair: "ETH-USD", ask: "2500", bid: "2490", currency: "USD" },
          ]),
        });
      }
    });

    // Use the page with mocks applied
    await use(page);
  },
});

// Re-export expect
export { expect } from "@playwright/test";
