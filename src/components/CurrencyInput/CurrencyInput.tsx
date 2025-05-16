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
      <div className={styles.currencyInputField}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="0"
          className={styles.amountInput}
        />
        <div className={styles.currencySelector}>
          <div className={styles.selectedCurrency}>
            <select 
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyInput;