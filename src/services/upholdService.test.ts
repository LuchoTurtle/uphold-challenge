import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { getAllCurrencies, getCurrencyRates } from "./upholdService";
import SDK from "@uphold/uphold-sdk-javascript";

// Mock the SDK
vi.mock("@uphold/uphold-sdk-javascript", () => {
  const MockSDK = vi.fn();
  MockSDK.prototype.getTicker = vi.fn();
  return { default: MockSDK };
});

describe("upholdService", () => {
  // Test data
  const mockTickers = [
    { pair: "BTC-USD", ask: "42000.123456", bid: "41900.987654", currency: "USD" },
    { pair: "ETH-USD", ask: "2500.123456", bid: "2490.987654", currency: "USD" },
    { pair: "XRP-EUR", ask: "0.492345", bid: "0.487654", currency: "EUR" },
    { pair: "XAUUSD", ask: "2000.123456", bid: "1990.987654", currency: "USD" },
  ];

  // Get a reference to the mocked SDK instance
  const sdk = new SDK({
    baseUrl: "base_url",
    clientId: "test-client",
    clientSecret: "test-secret",
  });

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllCurrencies", () => {
    it("should extract unique currencies from ticker data", async () => {
      // Setup the mock
      (sdk.getTicker as Mock).mockResolvedValue(mockTickers);

      const currencies = await getAllCurrencies();

      expect(sdk.getTicker).toHaveBeenCalledTimes(1);

      expect(currencies).toContain("USD");
      expect(currencies).toContain("BTC");
      expect(currencies).toContain("ETH");
      expect(currencies).toContain("XRP");
      expect(currencies).toContain("EUR");
      expect(currencies).toContain("XAU");

      // No duplicates should be present
      const uniqueCurrencies = new Set(currencies);
      expect(uniqueCurrencies.size).toBe(currencies.length);
    });

    it("should handle a single ticker response", async () => {
      // Setup the mock with a single ticker
      (sdk.getTicker as Mock).mockResolvedValue(mockTickers[0]);

      const currencies = await getAllCurrencies();

      expect(currencies).toContain("USD");
      expect(currencies).toContain("BTC");
      expect(currencies.length).toBe(2); // USD + BTC
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("API Error");
      (sdk.getTicker as Mock).mockRejectedValue(error);

      await expect(getAllCurrencies()).rejects.toThrow(error);
    });
  });

  describe("getCurrencyRates", () => {
    it("should return enhanced ticker data for a given currency", async () => {
      // Setup the mock
      (sdk.getTicker as Mock).mockResolvedValue(mockTickers);

      const rates = await getCurrencyRates("USD");

      expect(sdk.getTicker).toHaveBeenCalledWith("USD");
      expect(rates.length).toBe(mockTickers.length);

      expect(rates[0]).toHaveProperty("pairedCurrency", "BTC");
      expect(rates[0].ask).toBe("42000.123456");
      expect(rates[0].bid).toBe("41900.987654");
    });

    it("should handle a single rate response", async () => {
      // Setup the mock with a single ticker
      (sdk.getTicker as Mock).mockResolvedValue(mockTickers[0]);

      const rates = await getCurrencyRates("USD");

      expect(rates.length).toBe(1);
      expect(rates[0]).toHaveProperty("pairedCurrency", "BTC");
    });

    it("should extract paired currency correctly for different formats", async () => {
      // Setup the mock
      (sdk.getTicker as Mock).mockResolvedValue(mockTickers);

      const rates = await getCurrencyRates("USD");

      // Check paired currency extraction for hyphenated pairs
      const btcRate = rates.find((r) => r.pair === "BTC-USD");
      expect(btcRate).toHaveProperty("pairedCurrency", "BTC");

      // Check paired currency extraction for non-hyphenated pairs
      const xauRate = rates.find((r) => r.pair === "XAUUSD");
      expect(xauRate).toHaveProperty("pairedCurrency", "XAU");
    });

    it("should use default empty string for baseCurrency if not provided", async () => {
      // Setup the mock
      (sdk.getTicker as Mock).mockResolvedValue(mockTickers);

      await getCurrencyRates();

      expect(sdk.getTicker).toHaveBeenCalledWith("");
    });

    it("should handle errors gracefully", async () => {
      const error = new Error("API Error");
      (sdk.getTicker as Mock).mockRejectedValue(error);

      await expect(getCurrencyRates("USD")).rejects.toThrow(error);
    });
  });

  describe("extractPairedCurrency", () => {
    // We can test this private function through the public API

    it("should extract first part when currency is second in hyphenated pair", async () => {
      // Setup mock with a specific pair
      (sdk.getTicker as Mock).mockResolvedValue({
        pair: "BTC-USD",
        ask: "42000",
        bid: "41900",
        currency: "USD",
      });

      const rates = await getCurrencyRates("USD");
      expect(rates[0].pairedCurrency).toBe("BTC");
    });

    it("should extract second part when currency is first in hyphenated pair", async () => {
      // Setup mock with a specific pair
      (sdk.getTicker as Mock).mockResolvedValue({
        pair: "USD-BTC",
        ask: "0.000024",
        bid: "0.000023",
        currency: "USD",
      });

      const rates = await getCurrencyRates("USD");
      expect(rates[0].pairedCurrency).toBe("BTC");
    });

    it("should handle non-hyphenated pairs with currency at end", async () => {
      // Setup mock with a specific pair
      (sdk.getTicker as Mock).mockResolvedValue({
        pair: "XAUUSD",
        ask: "2000",
        bid: "1990",
        currency: "USD",
      });

      const rates = await getCurrencyRates("USD");
      expect(rates[0].pairedCurrency).toBe("XAU");
    });

    it("should handle non-hyphenated pairs with currency at start", async () => {
      // Setup mock with a specific pair
      (sdk.getTicker as Mock).mockResolvedValue({
        pair: "USDXAU",
        ask: "0.0005",
        bid: "0.0004",
        currency: "USD",
      });

      const rates = await getCurrencyRates("USD");
      expect(rates[0].pairedCurrency).toBe("XAU");
    });
  });
});
