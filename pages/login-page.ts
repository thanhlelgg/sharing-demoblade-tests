import { LoginPageLocators } from '../locators/login-page-locator.js';

import type { Page } from '@playwright/test';

export class LoginPage {
  readonly locators: LoginPageLocators;

  constructor(private readonly page: Page) {
    this.locators = new LoginPageLocators(page);
  }

  async signUp(username: string, password: string): Promise<void> {
    await this.locators.signUpLink.click();
    await this.locators.signUpUsernameInput.fill(username);
    await this.locators.signUpPasswordInput.fill(password);

    const dialogPromise = this.page.waitForEvent('dialog');
    await this.locators.signUpButton.click();

    const dialog = await dialogPromise;
    await dialog.accept();
    await this.locators.signUpModal.waitFor({ state: 'hidden' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.locators.loginLink.click();
    await this.locators.loginUsernameInput.fill(username);
    await this.locators.loginPasswordInput.fill(password);
    await this.locators.loginButton.click();
  }

  async openLoginAndSubmit(
    username: string,
    password: string,
  ): Promise<string> {
    await this.locators.loginLink.click();
    await this.locators.loginUsernameInput.fill(username);
    await this.locators.loginPasswordInput.fill(password);

    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 5_000 })
      .catch(() => null);

    await this.locators.loginButton.click();
    const dialog = await dialogPromise;

    if (!dialog) {
      return 'No alert displayed';
    }

    const message = dialog.message();
    await dialog.dismiss();
    return message;
  }
}
