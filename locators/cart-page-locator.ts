import { HtmlTable } from '../custom-elements/html-table.js';

import { CommonBaseLocator } from './common-base-locator.js';

import type { Locator } from '@playwright/test';

export class CartPageLocators extends CommonBaseLocator {
  get placeOrderButton(): Locator {
    return this.page.getByRole('button', { name: 'Place Order', exact: true });
  }

  get nameInput(): Locator {
    return this.page.locator('#name');
  }

  get countryInput(): Locator {
    return this.page.locator('#country');
  }

  get cityInput(): Locator {
    return this.page.locator('#city');
  }

  get cardInput(): Locator {
    return this.page.locator('#card');
  }

  get monthInput(): Locator {
    return this.page.locator('#month');
  }

  get yearInput(): Locator {
    return this.page.locator('#year');
  }

  get purchaseButton(): Locator {
    return this.page.getByRole('button', { name: 'Purchase', exact: true });
  }

  get cartTable(): HtmlTable {
    return new HtmlTable(this.page, this.page.locator('#tbodyid'));
  }

  productByName(name: string): Locator {
    return this.cartTable.elements.rowLocatorByText(name);
  }

  get emptyCartErrorMessage(): Locator {
    return this.page.locator('.sweet-alert').filter({
      hasText:
        /Please add .* product|Cart is empty|No product in cart|Please add some products/i,
    });
  }

  get purchaseSuccessMessage(): Locator {
    return this.page
      .locator('.sweet-alert')
      .filter({ hasText: /Thank you for your purchase!/i });
  }
}
