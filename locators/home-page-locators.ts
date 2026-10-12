import { CommonBaseLocator } from './common-base-locator.js';

import type { Locator } from '@playwright/test';

export class HomePageLocators extends CommonBaseLocator {
  get brand(): Locator {
    return this.page.locator('#nava');
  }

  get categoryList(): Locator {
    return this.page.locator('.list-group-item');
  }

  get productCards(): Locator {
    return this.page.locator('.card-title a');
  }

  get loginLink(): Locator {
    return this.page.getByRole('link', { name: 'Log in', exact: true });
  }

  get signUpLink(): Locator {
    return this.page.getByRole('link', { name: 'Sign up', exact: true });
  }

  get logoutLink(): Locator {
    return this.page.getByRole('link', { name: 'Log out', exact: true });
  }

  get cartLink(): Locator {
    return this.page.getByRole('link', { name: 'Cart', exact: true });
  }

  get welcomeUserLabel(): Locator {
    return this.page.locator('#nameofuser');
  }

  get addToCartButton(): Locator {
    return this.page.getByRole('link', { name: 'Add to cart', exact: true });
  }

  productByName(name: string): Locator {
    return this.page
      .locator('.card-title')
      .filter({ hasText: name })
      .locator('a');
  }
}
