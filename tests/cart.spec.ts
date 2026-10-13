import { expect, test } from '@playwright/test';

import { CartPage } from '../pages/cart-page.js';
import { HomePage } from '../pages/home-page.js';
import { LoginPage } from '../pages/login-page.js';
import { demoBlazeData, getUniqueUserName } from '../test-data/demo-data.js';

test.describe('Demoblaze cart flows', () => {
  test('[CART-03] @ui @regression should add a product to the cart and place an order', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);
    const uniqueUser = getUniqueUserName();

    await test.step('Open the home page', async () => {
      await homePage.openHomePage();
    });

    await test.step('Create a new user and sign in', async () => {
      await loginPage.signUp(uniqueUser, demoBlazeData.validPassword);
      await loginPage.login(uniqueUser, demoBlazeData.validPassword);
    });

    await test.step('Add the target product to the cart', async () => {
      await homePage.addProductByName(demoBlazeData.product.name);
    });

    await test.step('Open the cart and confirm the product is present', async () => {
      await homePage.goToCart();
      await expect(page).toHaveURL(/cart\.html/);
      await expect(
        cartPage.element.productByName(demoBlazeData.product.name),
      ).toBeVisible();
    });

    const purchaseMessage = await test.step('Place the order with customer details', async () => {
      return await cartPage.placeOrderWithDetails({
        name: demoBlazeData.order.customerName,
        country: demoBlazeData.order.customerCountry,
        city: demoBlazeData.order.customerCity,
        card: demoBlazeData.order.cardNumber,
        month: demoBlazeData.order.month,
        year: demoBlazeData.order.year,
      });
    });

    await test.step('Verify the purchase flow succeeds', async () => {
      expect(purchaseMessage).toMatch(
        /Thank you for your purchase!|Purchase submitted without a dialog/i,
      );
      await expect(cartPage.element.purchaseSuccessMessage()).toBeVisible({
        timeout: 15_000,
      });
    });
  });

  test('[CART-06] @ui @regression @known-bug should display an error when checking out after removing all cart items', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const cartPage = new CartPage(page);
    const uniqueUser = getUniqueUserName();

    await test.step('Open the home page', async () => {
      await homePage.openHomePage();
    });

    await test.step('Create a new user and sign in', async () => {
      await loginPage.signUp(uniqueUser, demoBlazeData.validPassword);
      await loginPage.login(uniqueUser, demoBlazeData.validPassword);
    });

    await test.step('Add the product to the cart', async () => {
      await homePage.addProductByName(demoBlazeData.product.name);
    });

    await test.step('Open the cart and validate the product is there', async () => {
      await homePage.goToCart();
      await expect(
        cartPage.element.productByName(demoBlazeData.product.name),
      ).toBeVisible();
    });

    await test.step('Remove the only cart item', async () => {
      await cartPage.removeItemByName(demoBlazeData.product.name);
      await expect(
        cartPage.element.productByName(demoBlazeData.product.name),
      ).toHaveCount(0);
    });

    await test.step('Attempt to place an order with an empty cart', async () => {
      await cartPage.openPlaceOrder();

      await expect(cartPage.element.purchaseSuccessMessage()).toBeHidden();
      await expect(cartPage.element.emptyCartErrorMessage()).toBeVisible({
        timeout: 15_000,
      });
    });
  });
});
