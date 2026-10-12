import { HomePageLocators } from '../locators/home-page-locators.js';

import { BasePage } from './base-page.js';

import type { Page } from '@playwright/test';

export class HomePage extends BasePage {
  readonly locators: HomePageLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new HomePageLocators(page);
  }

  async openHomePage(): Promise<void> {
    await this.open('/');
  }

  async goToCart(): Promise<void> {
    await this.locators.cartLink.click();
  }

  async addProductByName(productName: string): Promise<void> {
    const productLink = this.locators.productByName(productName);
    await productLink.first().click();

    const dialogPromise = this.page.waitForEvent('dialog');
    await this.locators.addToCartButton.click();

    const dialog = await dialogPromise;
    await dialog.accept();
  }

  async logout(): Promise<void> {
    await this.locators.logoutLink.click();
  }
}
