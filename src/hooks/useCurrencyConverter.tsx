import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrencyRates } from "../services/upholdService";
import type { Rate, CurrencyConverterHook } from "../types/currency";

export const useCurrencyConverter = (initialCurrency = "USD"): CurrencyConverterHook => {
  const [amount, setAmount] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<string>(initialCurrency);
  
  // React Query handles the API calls, caching, and refetching
  const { data: allRates = [], isLoading, error } = useQuery({
    queryKey: ['currencyRates', baseCurrency],
    queryFn: () => getCurrencyRates(baseCurrency),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Filter rates to only include those for the selected currency
  const rates = allRates.filter((rate: Rate) => 
    rate.currency && rate.ask && rate.bid && rate.currency === baseCurrency
  );

  const handleAmountChange = (newAmount: string): void => {
    setAmount(newAmount);
  };

  const handleCurrencyChange = (newCurrency: string): void => {
    setBaseCurrency(newCurrency);
    // React Query will automatically fetch new data when `baseCurrency` changes
  };

  return {
    amount,
    baseCurrency,
    rates,
    loading: isLoading,
    error: error as Error | null,
    handleAmountChange,
    handleCurrencyChange,
  };
};