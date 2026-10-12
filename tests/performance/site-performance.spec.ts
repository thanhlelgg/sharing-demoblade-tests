import { expect, test } from '@playwright/test';

const performanceBudgetMs = Number(process.env.PERFORMANCE_BUDGET_MS ?? 10_000);

test('[PERF-01] @performance should receive the storefront response within budget', async ({
  page,
}) => {
  expect(Number.isFinite(performanceBudgetMs)).toBe(true);
  expect(performanceBudgetMs).toBeGreaterThan(0);

  const response = await page.goto('/');
  expect(response).not.toBeNull();

  const responseStartMs = response!.request().timing().responseStart;
  expect(responseStartMs).toBeGreaterThanOrEqual(0);
  expect(responseStartMs).toBeLessThan(performanceBudgetMs);
});
