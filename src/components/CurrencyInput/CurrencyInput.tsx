import React, { useState, useEffect } from 'react';
import styles from "./CurrencyInput.module.scss";
import useDebounce from '../../hooks/useDebounce';

interface CurrencyInputProps {
  amount: string;
  currency: string;
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
  currencies: string[];
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  currencies
}) => {
  // Use local state to track input value immediately
  const [inputValue, setInputValue] = useState(amount);
  // Debounce the input value before passing it up
  const debouncedAmount = useDebounce(inputValue, 500); // 500ms delay
  
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
    
    // Only allow numbers and decimal point
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputValue(value);
    }
  };
  
  return (
    <div className={styles.currencyInputContainer}>
      <div className={styles.currencyRow}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="0.00"
          className={styles.amountInput}
          aria-label="Amount"
        />
        <div className={styles.currencySelector}>
          <select 
            value={currency} 
            onChange={(e) => onCurrencyChange(e.target.value)}
            className={styles.currencySelect}
            aria-label="Select currency"
          >
            {currencies.map((curr) => (
              <option key={curr} value={curr}>
                {curr}
              </option>
            ))}
          </select>
          <div className={styles.displayedCurrency}>
            <span className={styles.currencyCode}>{currency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyInput;