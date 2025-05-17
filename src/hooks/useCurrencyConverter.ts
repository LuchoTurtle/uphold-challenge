import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllCurrencies, getCurrencyRates } from "../services/upholdService";

export interface Rate {
  currency: string;
  pair: string;
  ask: string;
  bid: string;
}

export interface CurrencyConverterHook {
  amount: string;
  baseCurrency: string;
  rates: Rate[];
  currencies: string[];
  loadingCurrencies: boolean;
  loadingPairs: boolean;
  error: Error | null;
  handleAmountChange: (amount: string) => void;
  handleCurrencyChange: (currency: string) => void;
}

export default function useCurrencyConverter(initialCurrency = "USD"): CurrencyConverterHook {
  const [amount, setAmount] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<string>(initialCurrency);
  
  // Fetch and cache available currencies with proper error handling
  const { 
    data: currencies = [], 
    isLoading: loadingCurrencies,
    error: currenciesError
  } = useQuery({
    queryKey: ['availableCurrencies'],
    queryFn: getAllCurrencies,
    staleTime: 1000 * 60 * 60,
    retry: 2, // Retry failed requests up to 2 times
  });
  
  // Only fetch rates if currencies loaded successfully
  const { 
    data: allRates = [], 
    isLoading: ratesLoading, 
    error: ratesError 
  } = useQuery({
    queryKey: ['currencyRates', baseCurrency],
    queryFn: () => getCurrencyRates(baseCurrency),
    enabled: !loadingCurrencies && !currenciesError && currencies.length > 0,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    retry: 2, // Retry failed requests up to 2 times
  });
  
  // Filter rates to only include those for the selected currency
  const rates = useMemo(() => 
    allRates.filter((rate: Rate) => 
      rate.currency && rate.ask && rate.bid && rate.currency === baseCurrency
    ), 
    [allRates, baseCurrency]
  );

  const handleAmountChange = (newAmount: string): void => {
    setAmount(newAmount);
  };

  const handleCurrencyChange = (newCurrency: string): void => {
    setBaseCurrency(newCurrency);
  };

  // Combine errors - return the first error encountered
  const error = currenciesError || ratesError;

  return {
    amount,
    baseCurrency,
    rates,
    currencies,
    loadingPairs: ratesLoading,
    loadingCurrencies,
    error: error as Error | null,
    handleAmountChange,
    handleCurrencyChange,
  };
};