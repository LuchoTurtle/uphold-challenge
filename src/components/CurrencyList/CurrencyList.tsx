import React, { useState, useEffect, useRef } from "react";
import styles from "./CurrencyList.module.scss";
import type { Rate } from "../../hooks/useCurrencyConverter";

interface CurrencyItemProps {
  currencyData: Rate;
  baseAmount: string;
}

/**
 * List item that renders the converted currency pair with the chosen currency, alongside the icon and the label of the currency pair.
 * @param CurrentyItemProps receives a `rate` object and the base amount that we want to convert from
 * @returns rendered currency item with the icon and the label of the currency pair.
 */
const CurrencyItem: React.FC<CurrencyItemProps> = ({ currencyData, baseAmount }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const iconContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const colorClassRef = useRef<string>(`color${Math.floor(Math.random() * 5) + 1}`);

  const convertedValue = baseAmount
    ? parseFloat((parseFloat(baseAmount) * parseFloat(currencyData.ask)).toFixed(2)).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  const currencyCode = currencyData.pairedCurrency;

  // Preload the image to check if it exists
  useEffect(() => {
    const img = new Image();
    const currencyIconUrl = `/currencyIcons/${currencyCode.toLowerCase()}.svg`;

    img.onload = () => {
      setImageLoaded(true);
      if (imgRef.current) {
        imgRef.current.style.display = "block";
      }
    };

    img.src = currencyIconUrl;

    return () => {
      // Clean up
      img.onload = null;
    };
  }, [currencyCode]);

  return (
    <div className={styles.currencyItem} tabIndex={0} role="listitem" aria-label={`${convertedValue} ${currencyCode}`}>
      <div className={styles.iconContainer} ref={iconContainerRef} aria-hidden="true">
        {/* Fallback is always rendered by default */}
        <div
          className={`${styles.fallbackIcon} ${styles[colorClassRef.current]}`}
          style={{ display: imageLoaded ? "none" : "flex" }}
          aria-hidden="true"
        >
          {currencyCode.substring(0, 2).toUpperCase()}
        </div>

        {/* Image is hidden until loaded */}
        <img
          ref={imgRef}
          src={`/currencyIcons/${currencyCode.toLowerCase()}.svg`}
          alt={`${currencyCode.toLowerCase()} icon`}
          className={styles.currencyImage}
          style={{ display: "none" }}
          aria-hidden="true"
        />
      </div>

      <div className={styles.contentContainer}>
        <h4 className={styles.title} id={`currency-amount-${currencyCode}`} title={`${convertedValue} ${currencyCode}`}>
          {convertedValue}
        </h4>
        <p className={styles.description} id={`currency-code-${currencyCode}`} title={currencyCode}>
          {currencyCode}
        </p>
      </div>
    </div>
  );
};

interface CurrencyListProps {
  rates: Rate[];
  baseAmount: string;
}

/**
 * List of currency items that are being converted from the base amount.
 * @param CurrencyListProps receives a list of `rates` and the base amount that we want to convert from.
 * @returns rendered list of currency items with the icon and the label of the currency pair.
 */
const CurrencyList: React.FC<CurrencyListProps> = ({ rates, baseAmount }) => {
  return (
    <div className={styles.currencyList} role="list" data-testid="rates-list" aria-label="Currency conversion results">
      {rates.length === 0 ? (
        <p className={styles.noResults}>No currency rates available</p>
      ) : (
        rates.map((rate) => <CurrencyItem key={rate.pair} currencyData={rate} baseAmount={baseAmount} />)
      )}
    </div>
  );
};

export default CurrencyList;
