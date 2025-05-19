import React, { useState, useEffect } from "react";
import styles from "./CurrencyInput.module.scss";
import { useDebounce } from "../../hooks";

interface CurrencyInputProps {
  amount: string;
  currency: string;
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
  currencies: string[];
}

const MAX_VALUE = 1000000000; // 1 billion

/**
 * Currency input component. It has an input and a selector to change the currency that is being converted from.
 * @param CurrencyInputProps with the amount being `input` and the `currency` that is selected, alongside with the list of `currencies` that are supported.
 * @returns
 */
const CurrencyInput: React.FC<CurrencyInputProps> = ({ amount, currency, onAmountChange, onCurrencyChange, currencies }) => {
  const [inputValue, setInputValue] = useState(amount);
  const [inputError, setInputError] = useState("");
  const debouncedAmount = useDebounce(inputValue, 500);

  // Update the controlled input when external amount changes
  useEffect(() => {
    setInputValue(amount);
  }, [amount]);

  // Only call the parent's onAmountChange when the debounced value changes
  useEffect(() => {
    if (debouncedAmount !== amount) {
      onAmountChange(debouncedAmount);
    }
  }, [debouncedAmount, onAmountChange, amount]);

  // Handle input changes locally first
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputError(""); // Clear previous errors

    // Only allow numbers with optional decimal point
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      const numValue = parseFloat(value);

      if (value === "" || isNaN(numValue) || numValue <= MAX_VALUE) {
        setInputValue(value);
      } else {
        setInputError(`Value cannot exceed ${MAX_VALUE.toLocaleString()}`);
        setInputValue(MAX_VALUE.toString());
      }
    }
  };

  return (
    <div className={styles.currencyInputContainer}>
      <fieldset className={styles.currencyRow} aria-describedby="currency-input-desc">
        <legend className={styles.srOnly}>Currency Converter Input</legend>
        <div id="currency-input-desc" className={styles.srOnly}>
          Enter an amount and select a currency to convert from
        </div>

        <input
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="0.00"
          className={styles.amountInput}
          aria-label="Amount to convert"
          id="amount-input"
        />

        <div className={styles.currencySelector}>
          <label htmlFor="currency-select" className={styles.srOnly}>
            Select base currency
          </label>
          <select
            id="currency-select"
            data-testid="currency-selector"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className={styles.currencySelect}
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
          <div className={styles.displayedCurrency} aria-hidden="true">
            <span className={styles.currencyCode}>{currency}</span>
          </div>
        </div>
      </fieldset>

      {inputError && (
        <div className={`${styles.inputErrorText} text-tag`} role="alert">
          <span>{inputError}</span>
        </div>
      )}
    </div>
  );
};

export default CurrencyInput;
