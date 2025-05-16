import React, { useCallback } from "react";
import styles from "./CurrencyList.module.scss";
import type { Rate } from "../../hooks/useCurrencyConverter";

interface CurrencyItemProps {
  currencyData: Rate;
  baseAmount: string;
}

const CurrencyItem: React.FC<CurrencyItemProps> = ({ currencyData, baseAmount }) => {

  const convertedValue = baseAmount 
    ? parseFloat((parseFloat(baseAmount) * parseFloat(currencyData.ask)).toFixed(2))
      .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "0.00";

  // Extract the correct currency code
  const extractCurrencyCode = useCallback((pair: string, currency: string): string => {
    if (pair.includes('-')) {
      // Format: "XCH-USD"
      const [first] = pair.split('-');
      return first;
    } else {
      // Format: "XAUUSD"
      return pair.substring(0, pair.length - currency.length);
    }
  }, []);

  const currencyCode = extractCurrencyCode(currencyData.pair, currencyData.currency);
    
  return (
    <div className={styles.currencyItem}>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>📬</span>
      </div>
      <div className={styles.contentContainer}>
        <h4 className={styles.title}>{convertedValue}</h4>
        <p className={styles.description}>{currencyCode}</p>
      </div>
    </div>
  );
};

interface CurrencyListProps {
  rates: Rate[];
  baseAmount: string;
}

const CurrencyList: React.FC<CurrencyListProps> = ({ rates, baseAmount }) => {
  return (
    <div className={styles.currencyList}>
      {rates.map((rate) => (
        <CurrencyItem key={rate.pair} currencyData={rate} baseAmount={baseAmount} />
      ))}
    </div>
  );
};

export default CurrencyList;