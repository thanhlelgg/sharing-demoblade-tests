import type { Page } from '@playwright/test';

export class CommonBaseLocator {
  constructor(protected readonly page: Page) {}
}
