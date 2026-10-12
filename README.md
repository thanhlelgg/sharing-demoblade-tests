# Demoblaze E2E Automation

TypeScript and Playwright framework for UI, API, regression, and browser-performance checks against the public Demoblaze storefront.

## Requirements

- Node.js 22.x
- npm

## Setup

```bash
npm ci
npm run install:browsers
```

On Linux CI, install browser system dependencies with `npx playwright install --with-deps`.

## Framework Structure

```text
pages/                     Page objects for home, login, and cart workflows
locators/                  Selectors grouped by page
custom-elements/           Reusable UI components, including HtmlTable
test-data/                 Shared DemoBlaze test data and unique-user helper
utils/                     Shared element helpers
tests/demoblaze.spec.ts    UI and regression scenarios
tests/api/auth-api.spec.ts API contract check
tests/performance/site-performance.spec.ts  Response-time budget check
.github/workflows/demoblaze-e2e.yml          Standalone GitHub Actions workflow
playwright.config.ts         Browser, device, API, and performance projects
```

Specs describe expected behavior, page objects keep interactions reusable, and locator modules centralize selectors so UI changes can be handled without duplicating selectors across tests. Test data and shared components are separate for reuse. Playwright projects isolate UI, API, and performance checks and provide desktop/mobile browser coverage.

## Run the Demo

From the project root, install dependencies and browser binaries, then run the suite you want:

```bash
npm ci
npm run install:browsers
npm run test:cross-browser
npm run test:api
npm run test:performance
npm run report
```

`test:cross-browser` runs the implemented UI regression cases across desktop and mobile profiles, excluding the known empty-cart product bug. Use `npm test` to run every configured test, including that known-bug case.

## Test Commands

```bash
npm test                     # All configured projects
npm run test:chromium         # Chromium UI suite
npm run test:firefox          # Firefox UI suite
npm run test:webkit           # WebKit UI suite
npm run test:cross-browser    # UI regression suite across desktop and mobile, excluding known bugs
npm run test:mobile           # Mobile Chrome and mobile Safari emulation
npm run test:api              # API checks only
npm run test:performance      # Browser performance checks only
npm run test:regression       # Regression-tagged checks, excluding known bugs
npm run test:known-bugs       # Run tests tagged @known-bug
npm run test:headed           # Headed browser run
npm run test:ui               # Playwright interactive runner
npm run typecheck             # TypeScript validation
npm run report                # Open the latest HTML report
```

Test IDs are included in titles and reports. Use `@ui`, `@api`, `@performance`, and `@regression` tags to select test categories. The known empty-cart product defect is tagged `@known-bug`; it is included in `npm test` and can be run with `npm run test:known-bugs`, but is excluded from the cross-browser, regression, and CI gates.

## Configuration

Set environment variables to target another environment or adjust the performance budget:

| Variable                | Default                      | Purpose                                |
| ----------------------- | ---------------------------- | -------------------------------------- |
| `BASE_URL`              | `https://www.demoblaze.com/` | Browser-test target                    |
| `API_BASE_URL`          | `https://api.demoblaze.com`  | API-test target                        |
| `PERFORMANCE_BUDGET_MS` | `10000`                      | Maximum navigation response-start time |

Playwright generates an HTML report in `playwright-report/` and retains traces, screenshots, and videos for failures in `test-results/`. The performance project currently checks storefront response-start time; it is a lightweight budget check, not a load test.

## CI

The standalone-ready GitHub Actions workflow is `.github/workflows/demoblaze-e2e.yml`. It runs from the repository root, installs Node.js 22 and all three browser engines, typechecks, runs the non-known-bug suite, and uploads the Playwright report and test artifacts. Move the complete project directory, including `.github/`, to the standalone repository root for GitHub Actions to discover the workflow. The known-bug case is excluded from the CI gate and can be run directly with `npx playwright test --grep @known-bug`.
