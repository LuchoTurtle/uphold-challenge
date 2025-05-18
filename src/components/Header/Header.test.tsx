import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Header from "./Header";
import { ThemeContext } from "../../context/ThemeContext";

// Mock assets
vi.mock("../../assets/uphold-horizontal-dark.svg", () => ({default: "mock-dark-logo.svg"}));
vi.mock("../../assets/uphold-horizontal-light.svg", () => ({default: "mock-light-logo.svg"}));

describe("Header Component", () => {
  // Test rendering with light theme
  test("renders correctly in light mode", () => {
    const mockToggleDarkMode = vi.fn();

    render(
      <ThemeContext.Provider value={{ isDarkMode: false, toggleDarkMode: mockToggleDarkMode }}>
        <Header />
      </ThemeContext.Provider>
    );

    // Check logo renders with correct src
    const logo = screen.getByAltText("Uphold");
    expect(logo).toHaveAttribute("src", "mock-light-logo.svg");

    // Check skip link exists
    const skipLink = screen.getByText("Skip to main content");
    expect(skipLink).toHaveAttribute("href", "#main-content");

    // Check theme toggle label
    expect(screen.getByText("Switch to dark mode")).toBeInTheDocument();

    // Check checkbox state
    const checkbox = screen.getByLabelText("Switch to dark mode");
    expect(checkbox).toBeChecked();
  });

  // Test rendering with dark theme
  test("renders correctly in dark mode", () => {
    const mockToggleDarkMode = vi.fn();

    render(
      <ThemeContext.Provider value={{ isDarkMode: true, toggleDarkMode: mockToggleDarkMode }}>
        <Header />
      </ThemeContext.Provider>
    );

    // Check logo renders with correct src
    const logo = screen.getByAltText("Uphold");
    expect(logo).toHaveAttribute("src", "mock-dark-logo.svg");

    // Check theme toggle label
    expect(screen.getByText("Switch to light mode")).toBeInTheDocument();

    // Check checkbox state
    const checkbox = screen.getByLabelText("Switch to light mode");
    expect(checkbox).not.toBeChecked();
  });

  // Test theme toggle interaction
  test("toggles theme when checkbox is clicked", () => {
    const mockToggleDarkMode = vi.fn();

    render(
      <ThemeContext.Provider value={{ isDarkMode: false, toggleDarkMode: mockToggleDarkMode }}>
        <Header />
      </ThemeContext.Provider>
    );

    const checkbox = screen.getByLabelText("Switch to dark mode");
    fireEvent.click(checkbox);

    expect(mockToggleDarkMode).toHaveBeenCalledTimes(1);
  });

  // Test logo link
  test("logo links to Uphold homepage", () => {
    const mockToggleDarkMode = vi.fn();

    render(
      <ThemeContext.Provider value={{ isDarkMode: false, toggleDarkMode: mockToggleDarkMode }}>
        <Header />
      </ThemeContext.Provider>
    );

    const logoLink = screen.getByLabelText("Uphold homepage");
    expect(logoLink).toHaveAttribute("href", "https://uphold.com/");
  });
});
