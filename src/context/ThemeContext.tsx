import { createContext } from "react";

export type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
