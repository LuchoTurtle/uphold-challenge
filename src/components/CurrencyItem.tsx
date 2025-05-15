import React from 'react';
import type { Rate } from '../types/currency';

interface CurrencyItemProps {
  currencyData: Rate;
  baseAmount: string;
}

const CurrencyItem: React.FC<CurrencyItemProps> = ({ currencyData, baseAmount }) => {
  const convertedValue = baseAmount ? 
    (parseFloat(baseAmount) * parseFloat(currencyData.ask)).toFixed(4) : 
    '0.0000';

  return (
    <div className="currency-item">
      <div className="currency-pair">
        {currencyData.pair.replace('-', ' to ')}
      </div>
      <div className="currency-values">
        <div className="ask-bid">
          <span>Ask: {currencyData.ask}</span>
          <span>Bid: {currencyData.bid}</span>
        </div>
        <div className="converted-amount">
          {baseAmount || '0'} {currencyData.pair.split('-')[0]} = 
          <strong> {convertedValue} {currencyData.currency}</strong>
        </div>
      </div>
    </div>
  );
};

export default CurrencyItem;