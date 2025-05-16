import React from 'react';
import type { Currency } from '../../types/currency';
import styles from "./CurrencyInput.module.scss";

interface CurrencyInputProps {
  amount: string;
  currency: string;
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
  currencies: Currency[];
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  currencies
}) => {
  const flagUrl = 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Europe_flag_circle.png';
  
  return (
    <div className={styles.currencyInputContainer}>
      <div className={styles.currencyInputField}>
        <input
          type="text"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0"
          className={styles.amountInput}
        />
        <div className={styles.currencySelector}>
          <div className={styles.selectedCurrency}>
            <img 
              src={flagUrl} 
              alt={`${currency} flag`} 
              className={styles.currencyFlag} 
            />
            <select 
              value={currency} 
              onChange={(e) => onCurrencyChange(e.target.value)}
              className={styles.currencySelect}
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code}
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