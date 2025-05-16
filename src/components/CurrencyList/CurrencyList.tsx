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
  
  // Use the currency code to get the corresponding icon from public/currencyIcons
  const currencyIconUrl = `/currencyIcons/${currencyCode.toLowerCase()}.svg`;
  
  // Generate a random color class (1-5)
  const colorClass = `color${Math.floor(Math.random() * 5) + 1}`;
  
  return (
    <div className={styles.currencyItem}>
      <div className={styles.iconContainer}>
        <img 
          src={currencyIconUrl}
          alt={`${currencyCode} currency`}
          className={styles.currencyImage}
          onError={(e) => {
            // Remove the failed image
            e.currentTarget.style.display = 'none';
            
            // Create a fallback element with currency code initials
            const fallbackElement = document.createElement('div');
            fallbackElement.className = `${styles.fallbackIcon} ${styles[colorClass]}`;
            fallbackElement.textContent = currencyCode.substring(0, 2).toUpperCase();
            
            // Add to the DOM
            e.currentTarget.parentElement?.appendChild(fallbackElement);
          }}
        />
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