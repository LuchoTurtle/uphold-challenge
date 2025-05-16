import SDK, { type Ticker } from "@uphold/uphold-sdk-javascript";

const sdk = new SDK({
  baseUrl: import.meta.env.DEV ? "/api" : "http://api-sandbox.uphold.com", // proxy to avoid CORS issues (check vite.config.js)
  clientId: "foo",
  clientSecret: "bar",
});

//TODO maybe use React Query instead of caching like so (it will cache based on the search URL)
//TODO add aria
const ratesCache = new Map();

export const getCurrencyRates = async (baseCurrency = ""): Promise<Ticker[]> => {
  if (ratesCache.has(baseCurrency)) {
    return ratesCache.get(baseCurrency);
  }

  try {
    let rates = await sdk.getTicker(baseCurrency);
    // If we pass on a `pair` ticket, we only get one object instead of array, hence the possibility of getting Ticker[] or just a Ticker object
    if (Array.isArray(rates)) {
      const formattedRates = rates.map((rate) => ({
        ...rate,
        ask: parseFloat(rate.ask).toFixed(6),
        bid: parseFloat(rate.bid).toFixed(6),
      }));

      ratesCache.set(baseCurrency, formattedRates);
      rates = formattedRates;
    } else {
      rates = [rates]
    }
    return rates;
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    throw error;
  }
};
