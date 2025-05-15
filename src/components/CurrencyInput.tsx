import React from 'react';
import type { Currency } from '../types/currency';

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
  return (
    <div className="currency-input">
      <input
        type="number"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        placeholder="Enter amount"
      />
      <select 
        value={currency} 
        onChange={(e) => onCurrencyChange(e.target.value)}
      >
        {currencies.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.code}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyInput;