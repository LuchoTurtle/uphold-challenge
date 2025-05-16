import React from "react";
import { useCurrencyConverter } from "../../hooks/useCurrencyConverter";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import CurrencyList from "../CurrencyList/CurrencyList";

import styles from "./CurrencyConverter.module.scss";

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "BRL",
  "CNY",
  "ARS",
  "DKK",
  "AUD",
  "HKD",
  "INR",
]

const CurrencyConverter: React.FC = () => {
  const { amount, baseCurrency, rates, loading, error, handleAmountChange, handleCurrencyChange } = useCurrencyConverter("USD");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Currency Converter</h1>

      <CurrencyInput
        amount={amount}
        currency={baseCurrency}
        onAmountChange={handleAmountChange}
        onCurrencyChange={handleCurrencyChange}
        currencies={CURRENCIES}
      />

      {loading && <p className={styles.loading}>Loading rates...</p>}
      {error && <p className={styles.error}>Error: {error.message}</p>}

      {!loading && !error && <CurrencyList rates={rates} baseAmount={amount} />}
    </div>
  );
};

export default CurrencyConverter;
