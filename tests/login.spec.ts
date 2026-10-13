import { expect, test } from '@playwright/test';

import { HomePage } from '../pages/home-page.js';
import { LoginPage } from '../pages/login-page.js';
import { demoBlazeData, getUniqueUserName } from '../test-data/demo-data.js';

test.describe('Demoblaze login flows', () => {
  test('[LOGIN-01] @ui @regression should sign up and login with valid credentials', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const uniqueUser = getUniqueUserName();

    await test.step('Open the home page', async () => {
      await homePage.openHomePage();
    });

    await test.step('Sign up with a unique user', async () => {
      await loginPage.signUp(uniqueUser, demoBlazeData.validPassword);
    });

    await test.step('Log in with the same credentials', async () => {
      await loginPage.login(uniqueUser, demoBlazeData.validPassword);
    });

    await test.step('Verify the user is logged in', async () => {
      await expect(homePage.element.welcomeUserLabel()).toContainText(
        `Welcome ${uniqueUser}`,
      );
      await expect(homePage.element.logoutLink()).toBeVisible();
    });
  });

  test('[LOGIN-02] @ui @regression should reject invalid login credentials with an alert', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await test.step('Open the home page', async () => {
      await homePage.openHomePage();
    });

    const dialogMessage = await test.step('Submit invalid login credentials', async () => {
      return await loginPage.openLoginAndSubmit(
        demoBlazeData.invalidUser.username,
        demoBlazeData.invalidUser.password,
      );
    });

    await test.step('Verify the error message and login state', async () => {
      expect(dialogMessage).toMatch(/User does not exist|Wrong password/i);
      await expect(homePage.element.loginLink()).toBeVisible();
    });
  });
});
