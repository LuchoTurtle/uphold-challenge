import React from 'react';
import CurrencyItem from './CurrencyItem';
import type { Rate } from '../types/currency';

interface CurrencyListProps {
  rates: Rate[];
  baseAmount: string;
}

const CurrencyList: React.FC<CurrencyListProps> = ({
  rates,
  baseAmount
}) => {
  return (
    <div className="currency-list">
      {rates.map((rate) => (
        <CurrencyItem
          key={rate.pair}
          currencyData={rate}
          baseAmount={baseAmount}
        />
      ))}
    </div>
  );
};

export default CurrencyList;