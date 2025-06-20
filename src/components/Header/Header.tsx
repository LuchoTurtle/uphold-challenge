import React from "react";
import styles from "./Header.module.scss";
import darkLogo from "../../assets/uphold-horizontal-dark.svg";
import lightLogo from "../../assets/uphold-horizontal-light.svg";
import { useTheme } from "../../hooks";

/**
 * Header component. It contains the logo and the toggle for dark mode.
 * @returns Header component with logo and dark mode toggle.
 */
const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  const logoSrc = isDarkMode ? darkLogo : lightLogo;
  const themeLabel = isDarkMode ? "Switch to light mode" : "Switch to dark mode";

  return (
    <header className={styles.header} role="banner">
      {/* Skip to main content link for keyboard users (screen readers) */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>

      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <a href="https://uphold.com/" aria-label="Uphold homepage">
            <img src={logoSrc} alt="Uphold" className={styles.logo} />
          </a>
        </div>

        <div className={styles.rightComponent}>
          <div className={styles.themeToggleContainer}>
            <label htmlFor="themeToggle" className={styles.themeLabel}>
              {themeLabel}
            </label>
            <label className={styles.switch} data-testid="theme-toggle-label">
              <input
                checked={!isDarkMode}
                id="themeToggle"
                type="checkbox"
                data-testid="theme-toggle"
                onChange={toggleDarkMode}
                aria-label={themeLabel}
              />
              <span className={styles.slider} role="presentation">
                <div className={`${styles.star} ${styles.star_1}`} role="presentation" aria-hidden="true"></div>
                <div className={`${styles.star} ${styles.star_2}`} role="presentation" aria-hidden="true"></div>
                <div className={`${styles.star} ${styles.star_3}`} role="presentation" aria-hidden="true"></div>
                <svg viewBox="0 0 16 16" className={`${styles.cloud} ${styles.cloud_1}`} role="presentation" aria-hidden="true">
                  <path
                    transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                    fill="#fff"
                    d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                  ></path>
                </svg>
              </span>
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
