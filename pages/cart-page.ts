import type { Page } from '@playwright/test';
import { CartPageLocators } from '../locators/cart-page-locator.js';

export class CartPage {
  readonly locators: CartPageLocators;

  constructor(private readonly page: Page) {
    this.locators = new CartPageLocators(page);
  }

  async placeOrderWithDetails(details: {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
  }): Promise<string> {
    await this.locators.placeOrderButton.click();

    await this.locators.nameInput.fill(details.name);
    await this.locators.countryInput.fill(details.country);
    await this.locators.cityInput.fill(details.city);
    await this.locators.cardInput.fill(details.card);
    await this.locators.monthInput.fill(details.month);
    await this.locators.yearInput.fill(details.year);

    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 5_000 })
      .catch(() => null);

    await this.locators.purchaseButton.click();
    const dialog = await dialogPromise;

    if (!dialog) {
      return 'Purchase submitted without a dialog';
    }

    const message = dialog.message();
    await dialog.accept();
    return message;
  }

  async removeItemByName(productName: string): Promise<void> {
    const productRow = this.locators.productByName(productName);
    await productRow.locator('a[onclick^="deleteItem("]').click();
  }

  async openPlaceOrder(): Promise<void> {
    await this.locators.placeOrderButton.click();
  }
}
