
import { scan } from "react-scan"; // must be imported before React and React DOM

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./styles/global.scss";
import { ThemeProvider } from "./context/ThemeProvider.tsx";

// Enable React Scan in development mode
scan({
  enabled: import.meta.env.DEV,
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
