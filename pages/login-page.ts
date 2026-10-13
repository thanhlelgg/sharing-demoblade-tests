import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  element = {
    signUpModal: () => this.page.locator('#signInModal'),
    loginLink: () =>
      this.page.getByRole('link', { name: 'Log in', exact: true }),
    loginUsernameInput: () => this.page.locator('#loginusername'),
    loginPasswordInput: () => this.page.locator('#loginpassword'),
    loginButton: () =>
      this.page.getByRole('button', { name: 'Log in', exact: true }),
    signUpLink: () =>
      this.page.getByRole('link', { name: 'Sign up', exact: true }),
    signUpUsernameInput: () => this.page.locator('#sign-username'),
    signUpPasswordInput: () => this.page.locator('#sign-password'),
    signUpButton: () =>
      this.page.getByRole('button', { name: 'Sign up', exact: true }),
  };

  async signUp(username: string, password: string): Promise<void> {
    await this.element.signUpLink().click();
    await this.element.signUpUsernameInput().fill(username);
    await this.element.signUpPasswordInput().fill(password);

    const dialogPromise = this.page.waitForEvent('dialog');
    await this.element.signUpButton().click();

    const dialog = await dialogPromise;
    await dialog.accept();
    await this.element.signUpModal().waitFor({ state: 'hidden' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.element.loginLink().click();
    await this.element.loginUsernameInput().fill(username);
    await this.element.loginPasswordInput().fill(password);
    await this.element.loginButton().click();
  }

  async openLoginAndSubmit(
    username: string,
    password: string,
  ): Promise<string> {
    await this.element.loginLink().click();
    await this.element.loginUsernameInput().fill(username);
    await this.element.loginPasswordInput().fill(password);

    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 5_000 })
      .catch(() => null);

    await this.element.loginButton().click();
    const dialog = await dialogPromise;

    if (!dialog) {
      return 'No alert displayed';
    }

    const message = dialog.message();
    await dialog.dismiss();
    return message;
  }
}
