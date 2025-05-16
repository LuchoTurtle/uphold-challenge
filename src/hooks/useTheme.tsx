import { useContext } from "react";
import { type ThemeContextType, ThemeContext } from "../context/ThemeContext";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};