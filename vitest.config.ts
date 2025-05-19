import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    exclude: ["**/node_modules/**", "**/*.e2e.{test,spec}.{ts,tsx}", "**/tests/e2e/**"],
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      include: ["src/**/*.{ts,tsx,js,jsx}"],
      exclude: [
        "src/main.tsx",
        "src/**/*.d.ts",
        "src/**/*.test.{ts,tsx,js,jsx}",
        "src/**/index.{ts,tsx,js,jsx}",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});