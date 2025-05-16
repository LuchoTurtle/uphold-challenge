import React from "react";
import { useCurrencyConverter } from "../../hooks/useCurrencyConverter";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import CurrencyList from "../CurrencyList/CurrencyList";
import styles from "./CurrencyConverter.module.scss";

const CurrencyConverter: React.FC = () => {
  const { 
    amount, 
    baseCurrency, 
    rates, 
    currencies,
    loading, 
    loadingCurrencies,
    error, 
    handleAmountChange, 
    handleCurrencyChange 
  } = useCurrencyConverter("USD");

  // Loading state - show a spinner or loading message
  if (loadingCurrencies) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Currency Converter</h1>
        <div className={styles.loading}>Loading currencies...</div>
      </div>
    );
  }

  // Error state - show error message and don't render the component
  if (error || currencies.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Currency Converter</h1>
        <div className={styles.error}>
          {error ? `Error: ${error.message}` : "No currencies available. Please try again later."}
        </div>
      </div>
    );
  }

  // Only render the component when currencies are successfully loaded
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Currency Converter</h1>

      <CurrencyInput
        amount={amount}
        currency={baseCurrency}
        onAmountChange={handleAmountChange}
        onCurrencyChange={handleCurrencyChange}
        currencies={currencies}
      />

      {loading && <div className={styles.loading}>Loading rates...</div>}
      {!loading && <CurrencyList rates={rates} baseAmount={amount} />}
    </div>
  );
};

export default CurrencyConverter;