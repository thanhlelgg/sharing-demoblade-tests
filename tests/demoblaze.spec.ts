import { expect, test } from '@playwright/test';

import { CartPage } from '../pages/cart-page.js';
import { HomePage } from '../pages/home-page.js';
import { LoginPage } from '../pages/login-page.js';
import { demoBlazeData, getUniqueUserName } from '../test-data/demo-data.js';

test.describe('Demoblaze login and cart flows', () => {
  test('[LOGIN-01] @ui @regression should sign up and login with valid credentials', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const uniqueUser = getUniqueUserName();

    await homePage.openHomePage();
    await loginPage.signUp(uniqueUser, demoBlazeData.validPassword);
    await loginPage.login(uniqueUser, demoBlazeData.validPassword);

    await expect(homePage.locators.welcomeUserLabel).toContainText(
      `Welcome ${uniqueUser}`,
    );
    await expect(homePage.locators.logoutLink).toBeVisible();
  });

  test('[LOGIN-02] @ui @regression should reject invalid login credentials with an alert', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.openHomePage();

    const dialogMessage = await loginPage.openLoginAndSubmit(
      demoBlazeData.invalidUser.username,
      demoBlazeData.invalidUser.password,
    );

    expect(dialogMessage).toMatch(/User does not exist|Wrong password/i);
    await expect(homePage.locators.loginLink).toBeVisible();
  });

  test('[CART-03] @ui @regression should add a product to the cart and place an order', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);
    const uniqueUser = getUniqueUserName();

    await homePage.openHomePage();
    await loginPage.signUp(uniqueUser, demoBlazeData.validPassword);
    await loginPage.login(uniqueUser, demoBlazeData.validPassword);
    await homePage.addProductByName(demoBlazeData.product.name);

    await homePage.goToCart();
    await expect(page).toHaveURL(/cart\.html/);
    await expect(
      cartPage.locators.productByName(demoBlazeData.product.name),
    ).toBeVisible();

    const purchaseMessage = await cartPage.placeOrderWithDetails({
      name: demoBlazeData.order.customerName,
      country: demoBlazeData.order.customerCountry,
      city: demoBlazeData.order.customerCity,
      card: demoBlazeData.order.cardNumber,
      month: demoBlazeData.order.month,
      year: demoBlazeData.order.year,
    });

    expect(purchaseMessage).toMatch(
      /Thank you for your purchase!|Purchase submitted without a dialog/i,
    );
    await expect(cartPage.locators.purchaseSuccessMessage).toBeVisible({
      timeout: 15_000,
    });
  });

  test('[CART-06] @ui @regression @known-bug should display an error when checking out after removing all cart items', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);
    const uniqueUser = getUniqueUserName();

    await homePage.openHomePage();
    await loginPage.signUp(uniqueUser, demoBlazeData.validPassword);
    await loginPage.login(uniqueUser, demoBlazeData.validPassword);
    await homePage.addProductByName(demoBlazeData.product.name);

    await homePage.goToCart();
    await expect(
      cartPage.locators.productByName(demoBlazeData.product.name),
    ).toBeVisible();

    await cartPage.removeItemByName(demoBlazeData.product.name);
    await expect(
      cartPage.locators.productByName(demoBlazeData.product.name),
    ).toHaveCount(0);

    await cartPage.openPlaceOrder();

    // Failed because of bug, this should not show success message
    await expect(cartPage.locators.purchaseSuccessMessage).toBeHidden();

    // BUG: If no validation appears here, checkout is incorrectly allowing an
    // empty cart and this step should be treated as a product defect.
    await expect(cartPage.locators.emptyCartErrorMessage).toBeVisible({
      timeout: 15_000,
    });
  });
});
