import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import CurrencyList from "./CurrencyList";
import type { Rate } from "../../hooks/useCurrencyConverter";

// Mock data for testing
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
  {
    ask: "40000.00",
    bid: "39800.00",
    currency: "USD",
    pair: "BTCUSD",
    pairedCurrency: "BTC",
  },
];

// Mock Image object
class MockImage {
  onload: (() => void) | null = null;
  src: string = "";

  constructor() {
    // Simulate image loading after a short delay
    setTimeout(() => {
      if (typeof this.onload === "function") {
        this.onload();
      }
    }, 10);
  }
}

// Replace global Image with mock
global.Image = MockImage as unknown as typeof Image;

describe("CurrencyList Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders list of currency items", () => {
    render(<CurrencyList rates={mockRates} baseAmount="100" />);

    // Should render 3 items
    expect(screen.getAllByRole("listitem")).toHaveLength(3);

    // Check first item content
    expect(screen.getByText("EUR")).toBeInTheDocument();
  });

  test("renders empty state when no rates are available", () => {
    render(<CurrencyList rates={[]} baseAmount="100" />);

    expect(screen.getByText("No currency rates available")).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });

  test("calculates conversion values correctly", () => {
    render(<CurrencyList rates={mockRates} baseAmount="50" />);

    // $50 * 1.08 = $54.00 (small number)
    const converted = parseFloat(mockRates[0].ask) * parseFloat("50");
    expect(screen.getByText(converted.toFixed(2))).toBeInTheDocument();
  });

  test("shows 0.00 when baseAmount is empty", () => {
    render(<CurrencyList rates={mockRates} baseAmount="" />);

    // All items should show 0.00
    const values = screen.getAllByRole("heading");
    values.forEach((value) => {
      expect(value).toHaveTextContent("0.00");
    });
  });

  test("displays fallback currency icon when image fails to load", async () => {
    // Override the mock Image to NOT trigger onload
    global.Image = class FailImage {
      onload: () => void = () => {};
      src: string = "";
    } as unknown as typeof Image;

    render(<CurrencyList rates={[mockRates[0]]} baseAmount="100" />);

    // Give time for useEffect to run
    await waitFor(() => {
      // Check that fallback is visible - should have first two letters of currency code
      const fallbackIcon = screen.getByText("EU");
      expect(fallbackIcon).toBeVisible();
    });
  });

  test("handles image loading", async () => {
    const originalImageRef = global.Image;

    // Ensure onload gets called
    global.Image = class LoadingImage {
      onload: (() => void) | null = null;
      src: string = "";

      constructor() {
        // Call onload immediately when src is set
        Object.defineProperty(this, "src", {
          set(value: string) {
            this._src = value;
            // Trigger onload after a tiny delay
            setTimeout(() => {
              if (typeof this.onload === "function") {
                this.onload();
              }
            }, 0);
          },
          get() {
            return this._src;
          },
        });
      }

      _src: string = "";
    } as unknown as typeof Image;

    render(<CurrencyList rates={[mockRates[0]]} baseAmount="100" />);

    // Just verify the component renders without errors
    // and completes its image loading process
    await waitFor(
      () => {
        expect(document.querySelectorAll("img").length).toBeGreaterThan(0);
      },
      { timeout: 1000 }
    );

    // Restore global Image
    global.Image = originalImageRef;
  });
});
