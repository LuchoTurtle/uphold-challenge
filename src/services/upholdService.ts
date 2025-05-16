import SDK, { type Ticker } from "@uphold/uphold-sdk-javascript";

const sdk = new SDK({
  baseUrl: import.meta.env.DEV ? "/api" : "http://api-sandbox.uphold.com",
  clientId: "foo",
  clientSecret: "bar",
});

export const getAllCurrencies = async (): Promise<string[]> => {
  try {
    // Get all USD pairs by default
    const tickers = await sdk.getTicker();
    const tickerArray = Array.isArray(tickers) ? tickers : [tickers];
    
    // Extract unique currencies from pairs
    const currenciesSet = new Set<string>();
    
    // Always add USD (since that's our default reference)
    currenciesSet.add("USD");
    
    tickerArray.forEach(ticker => {
      if (ticker.pair) {
        // Extract currency codes from pair strings
        if (ticker.pair.includes('-')) {
          // Format: "USD-EUR"
          const [first, second] = ticker.pair.split('-');
          currenciesSet.add(first);
          currenciesSet.add(second);
        } else {
          // Format: "USDEUR"
          if (ticker.currency && ticker.pair.endsWith(ticker.currency)) {
            // Extract the first part of the pair (e.g., "USD" from "USDEUR")
            const firstCurrency = ticker.pair.substring(0, ticker.pair.length - ticker.currency.length);
            currenciesSet.add(firstCurrency);
          } else if (ticker.currency && ticker.pair.startsWith(ticker.currency)) {
            // Extract the second part (e.g., "EUR" from "EURJPY" where currency is "EUR")
            const secondCurrency = ticker.pair.substring(ticker.currency.length);
            currenciesSet.add(secondCurrency);
          }
          // Also add the ticker currency itself
          if (ticker.currency) {
            currenciesSet.add(ticker.currency);
          }
        }
      }
    });
    
    // Convert to sorted array
    return Array.from(currenciesSet).sort();
  } catch (error) {
    console.error("Error fetching available currencies:", error);
    throw error;
  }
};

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