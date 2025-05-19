# Uphold Frontend Challenge

A responsive currency converter application built with React, TypeScript, and Vite that uses the Uphold API to convert between different currencies in real-time.

<div align="center">
  <img width="800" src="https://github.com/user-attachments/assets/65ec26c1-eb09-47e8-a0e1-5fcc5c53ed4a>
</div>

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/LuchoTurtle/uphold-challenge.git
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to [http://localhost:5173](http://localhost:5173)

## 🧪 Testing

### Unit Tests

Run the unit test suite:

```bash
# Run tests in watch mode
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### End-to-End Tests

Run the E2E test suite with Playwright:

```bash
# Run E2E tests
npm run e2e

# Run E2E tests with UI mode
npm run e2e:ui

# Show E2E test report
npm run e2e:report
```

## 🔨 Building for Production

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
/
├── public/                # Static assets
│   └── currencyIcons/     # Currency SVG icons
├── src/                   # Application source code
│   ├── components/        # React components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and service functions
│   └── styles/            # Global styles and variables
├── tests/                 # Test configurations and helpers
│   ├── setup.ts           # Unit test setup
│   └── e2e/               # End-to-end tests with Playwright
│       ├── fixtures/      # Test fixtures and mocks
│       └── *.spec.ts      # Test specs
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── vitest.config.ts       # Vitest configuration
└── playwright.config.ts   # Playwright configuration
```

## 🔧 Technical Details

### Technology Stack

- **React 19** for the UI
- **TypeScript** for type safety
- **Vite** for fast development and optimized builds
- **React Query** for data fetching and caching
- **SASS Modules** for component styling
- **Vitest** for unit testing
- **Playwright** for end-to-end testing

## 🙏 Acknowledgments

- Currency icons from [cryptocurrency-icons](https://github.com/spothq/cryptocurrency-icons)
- Design inspiration from [Uphold's official website](https://uphold.com)
- Theme toggle adapted from [uiverse.io](https://uiverse.io/JustCode14/red-dingo-61)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

<!--

NOTES:

- should have used relative units for the font size and spacing but wanted to stick to the brand dguidelines.
- talk about production considerations for CORS (using a proxy backend with express or something)
- could have used `zod` to validate the DATA from the Api since it it can return a single object or an array
- montserrat is the closest font to the one used in the original design
- added all the styles from the brand guide from link.
- used CSS modules instead of styled components to keep it simpler and have CSS guidelines be more visible
- downloaded icons from `https://github.com/spothq/cryptocurrency-icons/tree/master/svg/color`
- could have virtualized and could have fixed the height and width of the items but decided against it, it wasn't really relevant. Decided to sticky the header instead.
- tried to follow Uphold guidelines through variables and global
- added accessbility as much as possible
- used instead of styled-components for simplicity, to make CSS guidelines more visible and to align with UpHold's tech stack.
- tried adding ARIA and skip links for accessibility and screen reader support.
- added ark/light mode with user preference detection and localStorage persistence
- added skeleton screens for improved perceived performance
- used react-query for data fetching and caching (instead of using a map inside the code)
- used the defaults from react-query and vitest.
- proxied the API calls to avoid CORS issues during development. In production, a backend proxy server (e.g., Express) would be necessary to handle CORS and secure API keys.
- added comprehensive testing with Vitest for unit tests and Playwright for E2E tests
- implemented CI pipeline with GitHub Actions for automated testing

-->
