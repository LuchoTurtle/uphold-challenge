import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, type MockedFunction } from "vitest";
import CurrencyConverter from "./CurrencyConverter";
import { useCurrencyConverter } from "../../hooks";
import type { Rate } from "../../hooks/useCurrencyConverter";

type MockedHook = MockedFunction<typeof useCurrencyConverter>;

// Mock the currency converter hook
vi.mock("../../hooks", () => ({
  useCurrencyConverter: vi.fn(),
  useDebounce: (value: number) => value,
}));

describe("CurrencyConverter Component", () => {
  // Sample data for testing
  const mockRates: Rate[] = [
    {
      ask: "1.08000",
      bid: "1.07000",
      currency: "USD",
      pair: "EUR-USD",
      pairedCurrency: "EUR",
    },
    {
      ask: "0.92500",
      bid: "0.92000",
      currency: "EUR",
      pair: "USD-EUR",
      pairedCurrency: "USD",
    },
  ];

  const mockCurrencies = ["USD", "EUR", "GBP", "JPY"];

  // Default hook implementation
  const defaultHookReturn = {
    amount: "100",
    baseCurrency: "USD",
    rates: mockRates,
    currencies: mockCurrencies,
    loadingRates: false,
    loadingCurrencies: false,
    error: null,
    handleAmountChange: vi.fn(),
    handleCurrencyChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const mockedHook = useCurrencyConverter as MockedHook;
    mockedHook.mockReturnValue({
      ...defaultHookReturn,
    });
  });

  it("renders the currency input with correct props", () => {
    render(<CurrencyConverter />);

    // Check if CurrencyInput is rendered with the right props
    const amountInput = screen.getByLabelText("Amount to convert");
    expect(amountInput).toHaveValue("100");

    // Currency selector should show USD
    const displayedCurrency = screen.getByText("USD", {
      selector: ".currencyCode",
    });
    expect(displayedCurrency).toBeInTheDocument();
  });

  it("renders the currency list when rates are available", () => {
    render(<CurrencyConverter />);

    // Check if CurrencyList is rendered
    expect(screen.getByLabelText("Currency conversion results")).toBeInTheDocument();

    // Check for specific rates in the list
    expect(screen.getByText("EUR", { selector: ".description" })).toBeInTheDocument();
  });

  it("shows loading skeleton when currencies are loading", () => {
    const mockedHook = useCurrencyConverter as MockedHook;
    mockedHook.mockReturnValue({
      ...defaultHookReturn,
      loadingCurrencies: true,
    });

    render(<CurrencyConverter />);

    // Check if loading skeleton is displayed
    expect(screen.getByText("Loading currency converter...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows loading skeleton when rates are loading", () => {
    const mockedHook = useCurrencyConverter as MockedHook;
    mockedHook.mockReturnValue({
      ...defaultHookReturn,
      loadingRates: true,
    });

    render(<CurrencyConverter />);

    // Check if rate loading skeleton is displayed
    expect(screen.getByText("Loading currency rates...")).toBeInTheDocument();

    // Should show 5 skeleton items
    const skeletonItems = document.querySelectorAll(".skeletonItem");
    expect(skeletonItems.length).toBe(5);
  });

  it("shows error message when there is an error", () => {
    const errorMessage = "Failed to fetch currencies";
    const mockedHook = useCurrencyConverter as MockedHook;
    mockedHook.mockReturnValue({
      ...defaultHookReturn,
      error: new Error(errorMessage),
    });

    render(<CurrencyConverter />);

    // Check if error message is displayed
    expect(screen.getByRole("alert")).toHaveTextContent(`Error: ${errorMessage}`);
  });

  it("shows 'no currencies' message when currencies array is empty", () => {
    const mockedHook = useCurrencyConverter as MockedHook;
    mockedHook.mockReturnValue({
      ...defaultHookReturn,
      currencies: [],
    });

    render(<CurrencyConverter />);

    // Check if no currencies message is displayed
    expect(screen.getByRole("alert")).toHaveTextContent("No currencies available");
  });

  it("shows 'no rates' message when rates array is empty", () => {
    const mockedHook = useCurrencyConverter as MockedHook;
    mockedHook.mockReturnValue({
      ...defaultHookReturn,
      rates: [],
    });

    render(<CurrencyConverter />);

    // Check if no rates message is displayed
    expect(screen.getByText("No conversion rates available for the selected currency.")).toBeInTheDocument();
  });

  it("passes the correct props to CurrencyInput", async () => {
    // Setup the mock functions
    const mockHandleAmountChange = vi.fn();
    const mockHandleBaseCurrencyChange = vi.fn();
    const mockedHook = useCurrencyConverter as MockedHook;

    mockedHook.mockReturnValue({
      ...defaultHookReturn,
      handleAmountChange: mockHandleAmountChange,
      handleCurrencyChange: mockHandleBaseCurrencyChange,
    });

    // Create a user instance (required for async user events)
    const user = userEvent.setup();

    render(<CurrencyConverter />);

    // Simulate amount change
    const amountInput = screen.getByLabelText("Amount to convert");
    await user.clear(amountInput);
    await user.type(amountInput, "200");

    // Verify callback was called
    expect(mockHandleAmountChange).toHaveBeenCalled();

    // Simulate currency change
    const select = screen.getByLabelText("Select base currency");
    await user.selectOptions(select, "EUR");

    // Verify callback was called
    expect(mockHandleBaseCurrencyChange).toHaveBeenCalled();
  });
});
