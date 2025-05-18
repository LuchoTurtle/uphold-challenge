import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";

// Test component to consume the theme context
const TestComponent = () => {
  const context = useContext(ThemeContext);
  if (context) {
    const { isDarkMode, toggleDarkMode } = context;
    return (
      <div>
        <span data-testid="theme-status">{isDarkMode ? "dark" : "light"}</span>
        <button onClick={toggleDarkMode} data-testid="toggle-button">
          Toggle Theme
        </button>
      </div>
    );
  }
};

describe("ThemeProvider", () => {
  // Save original implementations
  const originalLocalStorage = window.localStorage;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();

    // Mock localStorage with a fresh store each time
    const localStorageStore: Record<string, string> = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key: string) => localStorageStore[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          localStorageStore[key] = value;
        }),
        clear: vi.fn(() => {
          Object.keys(localStorageStore).forEach((key) => {
            delete localStorageStore[key];
          });
        }),
        removeItem: vi.fn((key: string) => {
          delete localStorageStore[key];
        }),
        key: vi.fn((index: number) => Object.keys(localStorageStore)[index] || null),
        length: 0,
      },
      writable: true,
    });

    // Default matchMedia implementation - will be overridden in tests as needed
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false, // Default to not matching any media query
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Clean up DOM
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    // Restore original implementations
    Object.defineProperty(window, "localStorage", { value: originalLocalStorage });
    window.matchMedia = originalMatchMedia;

    // Clean up DOM again just to be safe
    document.documentElement.removeAttribute("data-theme");
  });

  it("should use saved preference from localStorage", () => {
    // Setup localStorage to return dark mode preference
    Object.defineProperty(window.localStorage, "getItem", {
      value: vi.fn().mockReturnValue("true"),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Assert localStorage was checked and theme is set to dark
    expect(window.localStorage.getItem).toHaveBeenCalledWith("darkMode");
    expect(screen.getByTestId("theme-status")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("should use system preference when no localStorage value exists", () => {
    // Setup localStorage to return null (no saved preference)
    Object.defineProperty(window.localStorage, "getItem", {
      value: vi.fn().mockReturnValue(null),
    });

    // Setup matchMedia to indicate light mode preference
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Assert localStorage was checked and theme matches system preference (light)
    expect(window.localStorage.getItem).toHaveBeenCalledWith("darkMode");
    expect(screen.getByTestId("theme-status")).toHaveTextContent("light");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("should toggle theme when toggleDarkMode is called", () => {
    // Start with light mode
    Object.defineProperty(window.localStorage, "getItem", {
      value: vi.fn().mockReturnValue("false"),
    });

    // Track localStorage.setItem calls
    const setItemSpy = vi.fn();
    Object.defineProperty(window.localStorage, "setItem", {
      value: setItemSpy,
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initial state should be light
    expect(screen.getByTestId("theme-status")).toHaveTextContent("light");

    // Toggle the theme
    fireEvent.click(screen.getByTestId("toggle-button"));

    // Should now be dark
    expect(screen.getByTestId("theme-status")).toHaveTextContent("dark");
    expect(setItemSpy).toHaveBeenCalledWith("darkMode", "true");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    // Toggle again
    fireEvent.click(screen.getByTestId("toggle-button"));

    // Should now be light again
    expect(screen.getByTestId("theme-status")).toHaveTextContent("light");
    expect(setItemSpy).toHaveBeenCalledWith("darkMode", "false");
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });

  it("should update the DOM and localStorage when theme changes", () => {
    // Start with light mode
    Object.defineProperty(window.localStorage, "getItem", {
      value: vi.fn().mockReturnValue("false"),
    });

    // Track localStorage.setItem calls
    const setItemSpy = vi.fn();
    Object.defineProperty(window.localStorage, "setItem", {
      value: setItemSpy,
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Toggle the theme
    fireEvent.click(screen.getByTestId("toggle-button"));

    // Should update DOM and localStorage
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(setItemSpy).toHaveBeenCalledWith("darkMode", "true");
  });

  it("should handle system preference for dark mode", () => {
    Object.defineProperty(window.localStorage, "getItem", {
      value: vi.fn().mockReturnValue(null),
    });

    // System prefers dark mode (does NOT prefer light mode)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      // When (prefers-color-scheme: light) returns false, it means dark mode is preferred
      // which should make isDarkMode = true (dark theme)
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(window.matchMedia).toHaveBeenCalledWith("(prefers-color-scheme: light)");
    expect(screen.getByTestId("theme-status")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  it("should provide context values to children", () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(context) => (
            <div>
              <span data-testid="is-dark">{String(context?.isDarkMode)}</span>
              <button data-testid="toggle-fn" onClick={context?.toggleDarkMode} />
            </div>
          )}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(screen.getByTestId("is-dark")).toBeInTheDocument();

    // Toggle function should work
    const initialTheme = screen.getByTestId("is-dark").textContent;
    fireEvent.click(screen.getByTestId("toggle-fn"));
    expect(screen.getByTestId("is-dark").textContent).not.toBe(initialTheme);
  });
});
