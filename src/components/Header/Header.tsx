import React, { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import darkLogo from '../../assets/uphold-horizontal-dark.svg';
import lightLogo from '../../assets/uphold-horizontal-light.svg';

const Header: React.FC = () => {
  // State to track dark mode preference
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Effect to detect system color scheme and set up listener
  useEffect(() => {
    // Check initial preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: light)');
    setIsDarkMode(darkModeQuery.matches);

    // Set up listener for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeQuery.addEventListener('change', handleChange);
    
    // Clean up listener
    return () => {
      darkModeQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Use the appropriate logo based on theme
  const logoSrc = isDarkMode ? darkLogo : lightLogo;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo/icon on the left */}
        <div className={styles.logoContainer}>
          <img 
            src={logoSrc} 
            alt="Uphold Currency Converter" 
            className={styles.logo}
          />
        </div>
        
        {/* Placeholder for right component */}
        <div className={styles.rightComponent}>
          {/* Your right component goes here */}
        </div>
      </div>
    </header>
  );
};

export default Header;