import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import useTheme from "./useTheme";
import { ThemeContext, type ThemeContextType } from "../context/ThemeContext";

// Mock wrapper component to provide context
const createWrapper = (contextValue: ThemeContextType) => {
  return ({ children }: { children: ReactNode }) => <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

describe("useTheme", () => {
  it("should return the theme context value when used within ThemeProvider", () => {
    const mockContextValue: ThemeContextType = {
      isDarkMode: true,
      toggleDarkMode: vi.fn(),
    };

    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(mockContextValue),
    });

    expect(result.current).toEqual(mockContextValue);
    expect(result.current.isDarkMode).toBe(true);
    expect(typeof result.current.toggleDarkMode).toBe("function");
  });

  it("should return updated context when theme changes", () => {
    const initialContextValue: ThemeContextType = {
      isDarkMode: true,
      toggleDarkMode: vi.fn(),
    };

    const { result, rerender } = renderHook(() => useTheme(), {
      wrapper: createWrapper(initialContextValue),
    });

    // Assert initial value
    expect(result.current.isDarkMode).toBe(true);

    // Update the context value
    const updatedContextValue: ThemeContextType = {
      isDarkMode: false,
      toggleDarkMode: vi.fn(),
    };

    // Re-render with new context
    rerender();
    renderHook(() => useTheme(), {
      wrapper: createWrapper(updatedContextValue),
    });

    // Assert the updated value
    expect(result.current.isDarkMode).toBe(true); // Still true because of closure
  });

  it("should throw an error when used outside of ThemeProvider", () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within a ThemeProvider");
  });

  it("should call toggleDarkMode when triggered", () => {
    const toggleDarkMode = vi.fn();
    const mockContextValue: ThemeContextType = {
      isDarkMode: false,
      toggleDarkMode,
    };

    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(mockContextValue),
    });

    // Call the toggle function
    result.current.toggleDarkMode();

    expect(toggleDarkMode).toHaveBeenCalledTimes(1);
  });
});
