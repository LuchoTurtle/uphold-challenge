import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCurrencies, getCurrencyRates, type EnhancedTicker } from "../services/upholdService";

export type Rate = EnhancedTicker;

export interface CurrencyConverterHook {
  amount: string;
  baseCurrency: string;
  rates: Rate[];
  currencies: string[];
  loadingRates: boolean;
  loadingCurrencies: boolean;
  error: Error | null;
  handleAmountChange: (amount: string) => void;
  handleCurrencyChange: (currency: string) => void;
}

/**
 * Custom hook to manage currency conversion logic.
 * It fetches available currencies and their rates from UpHold.
 * @param initialCurrency The initial currency to set as the base currency. Defaults to 'USD'.
 * @returns An object containing the state and functions to manage currency conversion.
 */
export default function useCurrencyConverter(initialCurrency = "USD"): CurrencyConverterHook {
  const [amount, setAmount] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<string>(initialCurrency);

  // Fetch and cache available currencies with proper error handling
  const {
    data: currencies = [],
    isLoading: loadingCurrencies,
    error: currenciesError,
  } = useQuery({
    queryKey: ["availableCurrencies"],
    queryFn: getAllCurrencies,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });

  // Only fetch rates if currencies loaded successfully
  const {
    data: allRates = [],
    isLoading: ratesLoading,
    error: ratesError,
  } = useQuery({
    queryKey: ["currencyRates", baseCurrency],
    queryFn: () => getCurrencyRates(baseCurrency),
    enabled: !loadingCurrencies && !currenciesError && currencies.length > 0,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Filter rates to only include those for the selected currency
  const rates = useMemo(
    () => allRates.filter((rate: Rate) => rate.currency && rate.ask && rate.bid && rate.currency === baseCurrency),
    [allRates, baseCurrency]
  );

  const handleAmountChange = (newAmount: string): void => {
    setAmount(newAmount);
  };

  const handleCurrencyChange = (newCurrency: string): void => {
    setBaseCurrency(newCurrency);
  };

  const error = currenciesError || ratesError;

  return {
    amount,
    baseCurrency,
    rates,
    currencies,
    loadingRates: ratesLoading,
    loadingCurrencies,
    error: error as Error | null,
    handleAmountChange,
    handleCurrencyChange,
  };
}
