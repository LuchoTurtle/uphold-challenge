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
      <div className={styles.container} aria-live="polite" aria-busy="true">
        <div className={styles.skeletonContainer} role="status">
          <span className={styles.srOnly}>Loading currency converter...</span>
          {/* Skeleton for currency input */}
          <div className={styles.skeletonInput}>
            <div className={styles.skeletonAmount} aria-hidden="true"></div>
            <div className={styles.skeletonCurrency} aria-hidden="true"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || currencies.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.error} role="alert">
          {error ? `Error: ${error.message}` : "No currencies available. Please try again later."}
        </div>
      </div>
    );
  }

  // Only render the component when currencies are successfully loaded
  return (
    <div className={styles.container}>
      <section aria-labelledby="converter-heading">
        <h2 id="converter-heading" className={styles.srOnly}>Currency Converter Tool</h2>
        
        <CurrencyInput
          amount={amount}
          currency={baseCurrency}
          onAmountChange={handleAmountChange}
          onCurrencyChange={handleCurrencyChange}
          currencies={currencies}
        />

        {loadingRates && (
          <div 
            className={styles.skeletonList} 
            role="status" 
            aria-live="polite" 
            aria-busy="true"
          >
            <span className={styles.srOnly}>Loading currency rates...</span>
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <div key={index} className={styles.skeletonItem} aria-hidden="true">
                  <div className={styles.skeletonIcon}></div>
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonTitle}></div>
                    <div className={styles.skeletonSubtitle}></div>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        {!loadingRates && rates.length > 0 && (
          <section aria-labelledby="rates-heading">
            <h3 id="rates-heading" className={styles.srOnly}>
              {`Currency conversions for ${amount || '0'} ${baseCurrency}`}
            </h3>
            <CurrencyList rates={rates} baseAmount={amount} />
          </section>
        )}
        
        {!loadingRates && rates.length === 0 && (
          <p className={styles.noResults} role="status">No conversion rates available for the selected currency.</p>
        )}
      </section>
    </div>
  );
};

export default CurrencyConverter;