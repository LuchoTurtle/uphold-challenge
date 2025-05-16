import { useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if the user has a saved preference in localStorage, otherwise use system preference
  const getInitialTheme = (): boolean => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    // Check system preference (note the "inverted" check to match your mixin behavior)
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Set initial theme after component mounts to avoid SSR mismatch
  useEffect(() => {
    setIsDarkMode(getInitialTheme());
  }, []);

  // Apply the dark mode class to the html element
  useEffect(() => {
    // Add a data attribute to the document for CSS targeting
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    // Save the user's preference to localStorage
    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
