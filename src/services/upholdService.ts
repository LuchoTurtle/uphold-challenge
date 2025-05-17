import SDK, { type Ticker } from "@uphold/uphold-sdk-javascript";

// Extended Ticker interface with `pairedCurrency` of a given base currency
export interface EnhancedTicker extends Ticker {
  pairedCurrency: string;
}

const sdk = new SDK({
  baseUrl: import.meta.env.DEV ? "/api" : "http://api-sandbox.uphold.com",
  clientId: "foo",
  clientSecret: "bar",
});

/**
 * Extracts the paired currency code from different ticker pair formats.
 * @param pair - The currency pair string (e.g. "XCH-USD" or "XAUUSD")
 * @param currency - The quote currency (e.g. "USD")
 * @returns The extracted paired currency code
 */
function extractPairedCurrency(pair: string, currency: string) {
  // Format: "XCH-USD"
  if (pair.includes("-")) {
    const parts = pair.split("-");
    return parts[0] === currency ? parts[1] : parts[0];
  }

  // Format: "XAUUSD" where currency is "USD"
  else {
    if (pair.endsWith(currency)) {
      return pair.substring(0, pair.length - currency.length);
    } else if (pair.startsWith(currency)) {
      return pair.substring(currency.length);
    }
    // Default fallback
    return pair;
  }
}

/**
 * Gets all the currencies that UpHolds supports for conversion.
 * @returns all currencies supported by UpHold.
 */
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
      if (ticker.pair && ticker.currency) {
        const pairedCurrency = extractPairedCurrency(ticker.pair, ticker.currency);
        currenciesSet.add(pairedCurrency);
        currenciesSet.add(ticker.currency);
      }
    });
    
    // Convert to array
    return Array.from(currenciesSet);
  } catch (error) {
    console.error("Error fetching available currencies:", error);
    throw error;
  }
};

/**
 * Gets the currency pairs and their rates from UpHold for a given base currency.
 * @param baseCurrency The base currency to get rates for. If empty, defaults to 'USD'.
 * @returns An array of EnhancedTicker objects with the rates and paired currency.
 */
export const getCurrencyRates = async (baseCurrency = ""): Promise<EnhancedTicker[]> => {
  try {
    const rates = await sdk.getTicker(baseCurrency);
    
    // Handle either single Ticker or array of Tickers
    if (Array.isArray(rates)) {
      return rates.map(rate => enhanceTicker(rate));
    } else {
      return [enhanceTicker(rates)];
    }
  } catch (error) {
    console.error("Error fetching currency rates:", error);
    throw error;
  }
};


/**
 * Enhances the Ticker object by formatting its values and adding the paired currency.
 * @param rate The Ticker object to enhance.
 * @returns An EnhancedTicker object with formatted values and paired currency.
 */
const enhanceTicker = (rate: Ticker): EnhancedTicker => {
  const formattedRate = {
    ...rate,
    ask: parseFloat(rate.ask).toFixed(6),
    bid: parseFloat(rate.bid).toFixed(6),
  };
  
  return {
    ...formattedRate,
    pairedCurrency: rate.currency ? extractPairedCurrency(rate.pair, rate.currency) : ''
  };
};