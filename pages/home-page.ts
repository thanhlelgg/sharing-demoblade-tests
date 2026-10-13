import { BasePage } from './base-page.js';

import type { Page } from '@playwright/test';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  element = {
    loginLink: () =>
      this.page.getByRole('link', { name: 'Log in', exact: true }),
    logoutLink: () =>
      this.page.getByRole('link', { name: 'Log out', exact: true }),
    cartLink: () => this.page.getByRole('link', { name: 'Cart', exact: true }),
    welcomeUserLabel: () => this.page.locator('#nameofuser'),
    addToCartButton: () =>
      this.page.getByRole('link', { name: 'Add to cart', exact: true }),
    productByName: (name: string) =>
      this.page.locator('.card-title').filter({ hasText: name }).locator('a'),
  };

  async openHomePage(): Promise<void> {
    await this.open('/');
  }

  async goToCart(): Promise<void> {
    await this.element.cartLink().click();
  }

  async addProductByName(productName: string): Promise<void> {
    const productLink = this.element.productByName(productName);
    await productLink.first().click();

    const dialogPromise = this.page.waitForEvent('dialog');
    await this.element.addToCartButton().click();

    const dialog = await dialogPromise;
    await dialog.accept();
  }

  async logout(): Promise<void> {
    await this.element.logoutLink().click();
  }
}
