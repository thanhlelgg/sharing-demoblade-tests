import { CommonBaseLocator } from './common-base-locator.js';

import type { Locator } from '@playwright/test';

export class LoginPageLocators extends CommonBaseLocator {
  get signUpModal(): Locator {
    return this.page.locator('#signInModal');
  }

  get loginLink(): Locator {
    return this.page.getByRole('link', { name: 'Log in', exact: true });
  }

  get loginUsernameInput(): Locator {
    return this.page.locator('#loginusername');
  }

  get loginPasswordInput(): Locator {
    return this.page.locator('#loginpassword');
  }

  get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Log in', exact: true });
  }

  get signUpLink(): Locator {
    return this.page.getByRole('link', { name: 'Sign up', exact: true });
  }

  get signUpUsernameInput(): Locator {
    return this.page.locator('#sign-username');
  }

  get signUpPasswordInput(): Locator {
    return this.page.locator('#sign-password');
  }

  get signUpButton(): Locator {
    return this.page.getByRole('button', { name: 'Sign up', exact: true });
  }
}
