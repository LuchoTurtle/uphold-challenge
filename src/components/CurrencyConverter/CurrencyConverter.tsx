import React from "react";
import { useCurrencyConverter } from "../../hooks/useCurrencyConverter";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import CurrencyList from "../CurrencyList/CurrencyList";
import type { Currency } from "../../types/currency";

import styles from "./CurrencyConverter.module.scss";

const CURRENCIES: Currency[] = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "ARS", name: "Argentine Peso" },
  { code: "DKK", name: "Danish Krone" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "INR", name: "Indian Rupee" },
];

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
