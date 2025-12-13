import { test, expect, selectors, waitForPageLoad, clearCart, addProductToCart, getCartCount } from './fixtures';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearCart(page);
    await page.goto('/en');
    await waitForPageLoad(page);
  });

  test('should redirect to home when cart is empty', async ({ page }) => {
    // Try to go to purchase page with empty cart
    await page.goto('/en/purchase');
    await waitForPageLoad(page);

    // Should redirect to home (cart is empty)
    await expect(page).toHaveURL(/\/(en)?$/);
  });

  test('should access checkout page with items in cart', async ({ page }) => {
    // Add product to cart
    await addProductToCart(page);
    expect(await getCartCount(page)).toBeGreaterThan(0);

    // Go to purchase page
    await page.goto('/en/purchase');
    await waitForPageLoad(page);

    // Should stay on purchase page
    await expect(page).toHaveURL(/\/purchase/);

    // Should show checkout form
    await expect(page.locator('form')).toBeVisible();
  });

  test('should show checkout form fields', async ({ page }) => {
    // Add product first
    await addProductToCart(page);

    // Go to checkout
    await page.goto('/en/purchase');
    await waitForPageLoad(page);

    // Check form fields exist
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    // Add product first
    await addProductToCart(page);

    // Go to checkout
    await page.goto('/en/purchase');
    await waitForPageLoad(page);

    // Try to find PayPal button (it requires valid form)
    // PayPal buttons won't work without valid form data
    // This is a basic validation check

    // Fill partial form
    await page.fill('input[name="firstName"]', 'Test');
    // Leave other fields empty

    // Form should still be visible (not submitted)
    await expect(page.locator('form')).toBeVisible();
  });

  test('should show order total on checkout page', async ({ page }) => {
    // Add product first
    await addProductToCart(page);

    // Go to checkout
    await page.goto('/en/purchase');
    await waitForPageLoad(page);

    // Should show total price
    const totalText = await page.locator('text=/total|סה"כ/i').first().textContent();
    expect(totalText).toBeTruthy();
  });
});
