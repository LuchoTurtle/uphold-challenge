import SDK from "@uphold/uphold-sdk-javascript";

const sdk = new SDK({
  baseUrl: import.meta.env.DEV ? "/api" : "http://api-sandbox.uphold.com",  // proxy to avoid CORS issues (check vite.config.js)
  clientId: "foo",
  clientSecret: "bar",
});

const ratesCache = new Map();


export const getCurrencyRates = async (baseCurrency = "") => {
  if (ratesCache.has(baseCurrency)) {
    return ratesCache.get(baseCurrency);
  }

  try {
    // If we pass on a `pair` ticket, we only get one object instead of array, hence the possibility of getting Ticker[] or just a Ticker object
    const rates = await sdk.getTicker(baseCurrency);

    ratesCache.set(baseCurrency, rates);

    return rates;
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    throw error;
  }
};