import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

/**
 * ThemeProvider component that manages the dark mode state and provides it to the rest of the app.
 * @param children - The children components that will have access to the theme context.
 * @returns {JSX.Element} - The ThemeProvider component.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if the user has a saved preference in localStorage, otherwise use system preference
  const getInitialTheme = (): boolean => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      return savedTheme === "true";
    }

    // Check system preference
    return window.matchMedia("(prefers-color-scheme: light)").matches;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
};
