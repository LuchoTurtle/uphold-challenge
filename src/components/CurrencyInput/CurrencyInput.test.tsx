import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import CurrencyInput from "./CurrencyInput";

// Mock the useDebounce hook to return the value immediately
vi.mock("../../hooks", () => ({
  useDebounce: (value: number) => value,
}));

describe("CurrencyInput Component", () => {
  const defaultProps = {
    amount: "100",
    currency: "USD",
    onAmountChange: vi.fn(),
    onCurrencyChange: vi.fn(),
    currencies: ["USD", "EUR", "GBP", "JPY", "BTC"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with initial values", () => {
    render(<CurrencyInput {...defaultProps} />);

    // Check input has correct value
    const input = screen.getByLabelText("Amount to convert");
    expect(input).toHaveValue("100");

    // Check currency selector has correct value
    const displayedCurrency = screen.getByText("USD", {
      selector: ".currencyCode",
    });
    expect(displayedCurrency).toBeInTheDocument();

    // Verify all currencies are in the dropdown
    defaultProps.currencies.forEach((currency) => {
      expect(screen.getByRole("option", { name: currency })).toBeInTheDocument();
    });
  });

  it("handles amount input changes", async () => {
    render(<CurrencyInput {...defaultProps} />);

    const input = screen.getByLabelText("Amount to convert");

    // Simulate typing a new value
    await userEvent.clear(input);
    await userEvent.type(input, "250.50");

    // Check input value changes immediately
    expect(input).toHaveValue("250.50");

    // Since we mocked useDebounce to return immediately, check if callback was called
    expect(defaultProps.onAmountChange).toHaveBeenCalledWith("250.50");
  });

  it("handles currency selection changes", async () => {
    render(<CurrencyInput {...defaultProps} />);

    // Get select element
    const select = screen.getByLabelText("Select base currency");

    // Change selection
    await userEvent.selectOptions(select, "EUR");

    // Verify callback was called
    expect(defaultProps.onCurrencyChange).toHaveBeenCalledWith("EUR");

    // Verify displayed currency was updated
    expect(screen.getByText("EUR")).toBeInTheDocument();
  });

  it("only allows valid number input", async () => {
    render(<CurrencyInput {...defaultProps} />);

    const input = screen.getByLabelText("Amount to convert");

    // Clear existing value
    await userEvent.clear(input);

    // Try entering invalid input
    await userEvent.type(input, "abc");

    // Input should remain empty
    expect(input).toHaveValue("");

    // Valid input should work
    await userEvent.type(input, "123.45");
    expect(input).toHaveValue("123.45");
  });

  it("enforces maximum value limit", async () => {
    render(<CurrencyInput {...defaultProps} />);

    const input = screen.getByLabelText("Amount to convert");

    // Clear and enter value above maximum
    await userEvent.clear(input);
    await userEvent.type(input, "2000000000"); // 2 billion, above 1 billion limit

    // Value should be capped at MAX_VALUE
    expect(input).toHaveValue("1000000000");

    // Error message should appear
    expect(screen.getByRole("alert")).toHaveTextContent("Value cannot exceed 1,000,000,000");
  });

  it("clears error message when input is valid", async () => {
    render(<CurrencyInput {...defaultProps} />);

    const input = screen.getByLabelText("Amount to convert");

    // First generate an error
    await userEvent.clear(input);
    await userEvent.type(input, "2000000000"); // 2 billion, above limit

    // Error should appear
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Now enter valid input
    await userEvent.clear(input);
    await userEvent.type(input, "100");

    // Error should disappear
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("updates when external amount prop changes", () => {
    const { rerender } = render(<CurrencyInput {...defaultProps} />);

    // Initial value should be 100
    expect(screen.getByLabelText("Amount to convert")).toHaveValue("100");

    // Update the amount prop
    rerender(<CurrencyInput {...defaultProps} amount="500" />);

    // Input should update to new value
    expect(screen.getByLabelText("Amount to convert")).toHaveValue("500");
  });

  it("handles empty input correctly", async () => {
    render(<CurrencyInput {...defaultProps} />);

    const input = screen.getByLabelText("Amount to convert");

    // Clear the input
    await userEvent.clear(input);

    // Input should be empty
    expect(input).toHaveValue("");

    // Callback should be called with empty string
    expect(defaultProps.onAmountChange).toHaveBeenCalledWith("");
  });
});
