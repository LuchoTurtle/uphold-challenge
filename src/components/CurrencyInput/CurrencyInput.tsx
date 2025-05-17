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

/**
 * Currency input component. It has an input and a selector to change the currency that is being converted from.
 * @param CurrencyInputProps with the amount being `input` and the `currency` that is selected, alongside with the list of `currencies` that are supported.
 * @returns
 */
const CurrencyInput: React.FC<CurrencyInputProps> = ({ amount, currency, onAmountChange, onCurrencyChange, currencies }) => {
  const [inputValue, setInputValue] = useState(amount);
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
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputValue(value);
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
          <label htmlFor="currency-select" className={styles.srOnly}>Select base currency</label>
          <select 
            id="currency-select"
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
    </div>
  );
};

export default CurrencyInput;