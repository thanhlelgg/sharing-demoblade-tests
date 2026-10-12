import type { Locator } from '@playwright/test';

export class ElementHelper {
  static async waitForStableLocatorCount(locator: Locator): Promise<void> {
    await locator.first().waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);
  }
}
