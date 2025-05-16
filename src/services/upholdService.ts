import SDK, { type Ticker } from "@uphold/uphold-sdk-javascript";

const sdk = new SDK({
  baseUrl: import.meta.env.DEV ? "/api" : "http://api-sandbox.uphold.com",
  clientId: "foo",
  clientSecret: "bar",
});

export const getCurrencyRates = async (baseCurrency = ""): Promise<Ticker[]> => {
  try {
    const rates = await sdk.getTicker(baseCurrency);
    
    // Handle either single Ticker or array of Tickers
    if (Array.isArray(rates)) {
      return rates.map(formatRate);
    } else {
      return [formatRate(rates)];
    }
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    throw error;
  }
};

// Helper function to format rate values consistently
const formatRate = (rate: Ticker): Ticker => ({
  ...rate,
  ask: parseFloat(rate.ask).toFixed(6),
  bid: parseFloat(rate.bid).toFixed(6),
});