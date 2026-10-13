# Demoblaze E2E Automation

TypeScript and Playwright framework for UI regression checks against the public Demoblaze storefront.

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
pages/                     Page objects with their page-specific selectors and actions
custom-elements/           Reusable UI components, including HtmlTable
test-data/                 Shared DemoBlaze test data and unique-user helper
utils/                     Shared element helpers
tests/login.spec.ts        Login and sign-up scenarios
tests/cart.spec.ts         Cart and order scenarios
.github/workflows/         Standalone GitHub Actions workflow
playwright.config.ts       Browser, device, and UI test configuration
```

Each page object owns its selectors and user-facing actions. Specs are separated by function, while test data and reusable components are shared.

## Run the UI Tests

From the project root, install dependencies and browser binaries, then run the suite:

```bash
npm ci
npm run install:browsers
npm run test:cross-browser
npm run report
```

`test:cross-browser` runs the implemented UI regression cases across desktop and mobile profiles, excluding the known empty-cart product bug. Use `npm test` to run every UI test, including that known-bug case.

## Test Commands

```bash
npm test                     # All configured UI projects
npm run test:chromium        # Chromium UI suite
npm run test:firefox         # Firefox UI suite
npm run test:webkit          # WebKit UI suite
npm run test:cross-browser   # UI regression suite across desktop and mobile, excluding known bugs
npm run test:mobile          # Mobile Chrome and mobile Safari emulation
npm run test:regression      # Regression-tagged checks, excluding known bugs
npm run test:known-bugs      # Run tests tagged @known-bug
npm run test:headed          # Headed browser run
npm run test:ui              # Playwright interactive runner
npm run typecheck            # TypeScript validation
npm run report               # Open the latest HTML report
```

Test IDs are included in titles and reports. Use the `@ui` and `@regression` tags to select test categories. The known empty-cart product defect is tagged `@known-bug`; it is included in `npm test` and can be run with `npm run test:known-bugs`, but is excluded from the cross-browser, regression, and CI gates.

## Future API and Performance Examples

API and performance tests are not part of the current framework or test run. These examples show one way to add them later; they require adding corresponding Playwright projects and test commands before they can be run.

### API test example

Add an API project to `playwright.config.ts` when API coverage is introduced:

```ts
{
  name: 'api',
  testMatch: '**/api/**/*.spec.ts',
  use: {
    baseURL: process.env.API_BASE_URL ?? 'https://api.demoblaze.com',
  },
}
```

Example future spec:

```ts
import { expect, test } from '@playwright/test';

test('[API-01] should reject login for an unknown user', async ({ request }) => {
  const response = await request.post('/login', {
    data: {
      username: `missing-user-${Date.now()}`,
      password: 'invalid-password',
    },
  });

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as { errorMessage?: string };
  expect(body.errorMessage).toMatch(/user does not exist/i);
});
```

### Performance test example

Add a browser-backed performance project and configure a budget if storefront response timing is introduced:

```ts
{
  name: 'performance',
  testMatch: '**/performance/**/*.spec.ts',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.BASE_URL ?? 'https://www.demoblaze.com/',
  },
}
```

Example future spec:

```ts
import { expect, test } from '@playwright/test';

const performanceBudgetMs = Number(process.env.PERFORMANCE_BUDGET_MS ?? 10_000);

test('should receive the storefront response within budget', async ({ page }) => {
  expect(Number.isFinite(performanceBudgetMs)).toBe(true);
  expect(performanceBudgetMs).toBeGreaterThan(0);

  const response = await page.goto('/');
  expect(response).not.toBeNull();

  const responseStartMs = response!.request().timing().responseStart;
  expect(responseStartMs).toBeGreaterThanOrEqual(0);
  expect(responseStartMs).toBeLessThan(performanceBudgetMs);
});
```

The performance example is a lightweight navigation response-start budget check, not a load test.

## Configuration

| Variable   | Default                      | Purpose                 |
| ---------- | ---------------------------- | ----------------------- |
| `BASE_URL` | `https://www.demoblaze.com/` | Browser-test target     |

Playwright generates an HTML report in `playwright-report/` and retains traces, screenshots, and videos for failures in `test-results/`.

## CI

The standalone-ready GitHub Actions workflow is `.github/workflows/demoblaze-e2e.yml`. It runs from the repository root, installs Node.js 22 and all three browser engines, typechecks, runs the UI suite excluding the known-bug case, and uploads the Playwright report and test artifacts. Move the complete project directory, including `.github/`, to the standalone repository root for GitHub Actions to discover the workflow. The known-bug case is excluded from the CI gate and can be run directly with `npx playwright test --grep @known-bug`.
