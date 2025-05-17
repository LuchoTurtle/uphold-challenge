import { createContext } from "react";

export type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

/**
 * ThemeContext is a React context that provides the current theme (dark or light) and a function to toggle it.
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
