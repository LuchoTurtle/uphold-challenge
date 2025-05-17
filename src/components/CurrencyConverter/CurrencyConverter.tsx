import React from "react";
import { useCurrencyConverter } from "../../hooks/useCurrencyConverter";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import CurrencyList from "../CurrencyList/CurrencyList";
import styles from "./CurrencyConverter.module.scss";

const CurrencyConverter: React.FC = () => {
  const { amount, baseCurrency, rates, currencies, loading, loadingCurrencies, error, handleAmountChange, handleCurrencyChange } =
    useCurrencyConverter("USD");

  // Loading input state - show a skeleton loader
  if (loadingCurrencies) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonContainer}>
          {/* Skeleton for currency input */}
          <div className={styles.skeletonInput}>
            <div className={styles.skeletonAmount}></div>
            <div className={styles.skeletonCurrency}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - show error message and don't render the component
  if (error || currencies.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error ? `Error: ${error.message}` : "No currencies available. Please try again later."}</div>
      </div>
    );
  }

  // Only render the component when currencies are successfully loaded
  return (
    <div>
      <CurrencyInput
        amount={amount}
        currency={baseCurrency}
        onAmountChange={handleAmountChange}
        onCurrencyChange={handleCurrencyChange}
        currencies={currencies}
      />

      {loading && (
        <div className={styles.skeletonList}>
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div key={index} className={styles.skeletonItem}>
                <div className={styles.skeletonIcon}></div>
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonTitle}></div>
                  <div className={styles.skeletonSubtitle}></div>
                </div>
              </div>
            ))}
        </div>
      )}
      {!loading && <CurrencyList rates={rates} baseAmount={amount} />}
    </div>
  );
};

export default CurrencyConverter;
