import { useState, useEffect } from "react";
import { getCurrencyRates } from "../services/upholdService";
import useDebounce from "./useDebounce";
import type { Rate, CurrencyConverterHook } from "../types/currency";

export const useCurrencyConverter = (initialCurrency = "USD"): CurrencyConverterHook => {
  const [amount, setAmount] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<string>(initialCurrency);
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRates = async (currency: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedRates = await getCurrencyRates(currency);
      const filteredRates = fetchedRates.filter((rate: Rate) => 
        rate.currency && rate.ask && rate.bid && rate.currency === currency
      );
      setRates(filteredRates);
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const debouncedBaseCurrency = useDebounce<string>(baseCurrency, 300);

  useEffect(() => {
    fetchRates(debouncedBaseCurrency);
  }, [debouncedBaseCurrency]);

  const handleAmountChange = (newAmount: string): void => {
    setAmount(newAmount);
  };

  const handleCurrencyChange = (newCurrency: string): void => {
    setBaseCurrency(newCurrency);
  };

  return {
    amount,
    baseCurrency,
    rates,
    loading,
    error,
    handleAmountChange,
    handleCurrencyChange,
  };
};