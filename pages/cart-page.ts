import { HtmlTable } from '../custom-elements/html-table.js';

import type { Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  element = {
    placeOrderButton: () =>
      this.page.getByRole('button', { name: 'Place Order', exact: true }),
    nameInput: () => this.page.locator('#name'),
    countryInput: () => this.page.locator('#country'),
    cityInput: () => this.page.locator('#city'),
    cardInput: () => this.page.locator('#card'),
    monthInput: () => this.page.locator('#month'),
    yearInput: () => this.page.locator('#year'),
    purchaseButton: () =>
      this.page.getByRole('button', { name: 'Purchase', exact: true }),
    cartTable: () => new HtmlTable(this.page, this.page.locator('#tbodyid')),
    productByName: (name: string) =>
      this.element.cartTable().elements.rowLocatorByText(name),
    emptyCartErrorMessage: () =>
      this.page.locator('.sweet-alert').filter({
        hasText:
          /Please add .* product|Cart is empty|No product in cart|Please add some products/i,
      }),
    purchaseSuccessMessage: () =>
      this.page
        .locator('.sweet-alert')
        .filter({ hasText: /Thank you for your purchase!/i }),
  };

  async placeOrderWithDetails(details: {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
  }): Promise<string> {
    await this.element.placeOrderButton().click();

    await this.element.nameInput().fill(details.name);
    await this.element.countryInput().fill(details.country);
    await this.element.cityInput().fill(details.city);
    await this.element.cardInput().fill(details.card);
    await this.element.monthInput().fill(details.month);
    await this.element.yearInput().fill(details.year);

    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 5_000 })
      .catch(() => null);

    await this.element.purchaseButton().click();
    const dialog = await dialogPromise;

    if (!dialog) {
      return 'Purchase submitted without a dialog';
    }

    const message = dialog.message();
    await dialog.accept();
    return message;
  }

  async removeItemByName(productName: string): Promise<void> {
    const productRow = this.element.productByName(productName);
    await productRow.locator('a[onclick^="deleteItem("]').click();
  }

  async openPlaceOrder(): Promise<void> {
    await this.element.placeOrderButton().click();
  }
}
