import { useContext } from "react";
import { type ThemeContextType, ThemeContext } from "../context/ThemeContext";

/**
 * Custom hook to use the ThemeContext.
 * @returns {ThemeContextType} - The current theme context value.
 */
export default function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};