import React, { useCallback, useState, useEffect, useRef } from "react";
import styles from "./CurrencyList.module.scss";
import type { Rate } from "../../hooks/useCurrencyConverter";

interface CurrencyItemProps {
  currencyData: Rate;
  baseAmount: string;
}

const CurrencyItem: React.FC<CurrencyItemProps> = ({ currencyData, baseAmount }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const iconContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const colorClassRef = useRef<string>(`color${Math.floor(Math.random() * 5) + 1}`);
  
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
  
  // Preload the image to check if it exists
  useEffect(() => {
    const img = new Image();
    const currencyIconUrl = `/currencyIcons/${currencyCode.toLowerCase()}.svg`;
    
    img.onload = () => {
      setImageLoaded(true);
      if (imgRef.current) {
        imgRef.current.style.display = 'block';
      }
    };
    
    img.src = currencyIconUrl;
    
    return () => {
      // Clean up
      img.onload = null;
    };
  }, [currencyCode]);
  
  return (
    <div className={styles.currencyItem}>
      <div className={styles.iconContainer} ref={iconContainerRef}>
        {/* Fallback is always rendered by default */}
        <div 
          className={`${styles.fallbackIcon} ${styles[colorClassRef.current]}`}
          style={{ display: imageLoaded ? 'none' : 'flex' }}
        >
          {currencyCode.substring(0, 2).toUpperCase()}
        </div>
        
        {/* Image is hidden until loaded */}
        <img 
          ref={imgRef}
          src={`/currencyIcons/${currencyCode.toLowerCase()}.svg`}
          alt={`${currencyCode} currency`}
          className={styles.currencyImage} 
          style={{ display: 'none' }}
        />
      </div>
      <div className={styles.contentContainer}>
        <h4
          className={styles.title}
          title={`${convertedValue} ${currencyCode}`}
        >
          {convertedValue}
        </h4>
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
