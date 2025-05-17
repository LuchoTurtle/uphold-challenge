import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeProvider";
import App from "./App";
import { describe, expect, test, vi } from "vitest";

// Mock the components that make up `<App>`
vi.mock("./components/Header/Header", () => ({
  default: () => <div data-testid="header-mock">Header</div>,
}));

vi.mock("./components/CurrencyConverter", () => ({
  default: () => <div data-testid="converter-mock">Currency Converter</div>,
}));

describe("App Component", () => {
  const renderApp = () => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    );
  };

  test("renders the App with header and main components", () => {
    renderApp();

    // Header should be rendered
    expect(screen.getByTestId("header-mock")).toBeInTheDocument();

    // Heading should be rendered
    expect(screen.getByRole("heading", { name: /currency converter/i })).toBeInTheDocument();

    // Description text should be rendered
    expect(screen.getByText(/unlock global currency conversion/i)).toBeInTheDocument();

    // Currency converter should be rendered
    expect(screen.getByTestId("converter-mock")).toBeInTheDocument();

    // Main content should have appropriate role
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
