import React from "react";
import CurrencyInput from "../CurrencyInput/CurrencyInput";
import CurrencyList from "../CurrencyList/CurrencyList";
import styles from "./CurrencyConverter.module.scss";
import { useCurrencyConverter } from "../../hooks";

/**
 * Currency converter component.
 * It handles all the state and logic with the input and the list of converted rates in other currencies.
 * @returns component with input and list of converted currency pairs.
 */
const CurrencyConverter: React.FC = () => {
  const { amount, baseCurrency, rates, currencies, loadingRates, loadingCurrencies, error, handleAmountChange, handleCurrencyChange } =
    useCurrencyConverter("USD");

  // Show skeleton loader when loading the currencies to fill the input
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

  // Error state
  if (error || currencies.length === 0) {
    return (
      <div className={styles.container}>
        <h4 className={styles.error}>{error ? `Error: ${error.message}` : "No currencies available. Please try again later."}</h4>
      </div>
    );
  }

  // Only render the component when currencies are successfully loaded
  return (
    <>
      <CurrencyInput
        amount={amount}
        currency={baseCurrency}
        onAmountChange={handleAmountChange}
        onCurrencyChange={handleCurrencyChange}
        currencies={currencies}
      />

      {loadingRates && (
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
      {!loadingRates && <CurrencyList rates={rates} baseAmount={amount} />}
    </>
  );
};

export default CurrencyConverter;
