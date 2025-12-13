import { test, expect, selectors, waitForPageLoad } from './fixtures';

test.describe('Public Pages', () => {
  test.describe('Home Page', () => {
    test('should load home page with products', async ({ page }) => {
      await page.goto('/en');
      await waitForPageLoad(page);

      // Header should be visible
      await expect(page.locator('header')).toBeVisible();

      // Products should be displayed
      const products = page.locator(selectors.productCard);
      const count = await products.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display product prices', async ({ page }) => {
      await page.goto('/en');
      await waitForPageLoad(page);

      // First product should have a price
      const price = page.locator(selectors.productPrice).first();
      await expect(price).toBeVisible();

      // Price should contain number and ₪
      const priceText = await price.textContent();
      expect(priceText).toMatch(/\d+.*₪/);
    });

    test('should open product modal when clicking product', async ({ page }) => {
      await page.goto('/en');
      await waitForPageLoad(page);

      // Click first product
      const product = page.locator(selectors.productCard).first();
      await product.click();

      // Modal should open
      await expect(page.locator(selectors.productModal)).toBeVisible();

      // Add to cart button should be visible
      await expect(page.locator(selectors.addToCartBtn)).toBeVisible();
    });

    test('should show cart button in header', async ({ page }) => {
      await page.goto('/en');
      await waitForPageLoad(page);

      // Cart button should be visible
      await expect(page.locator(selectors.cartButton)).toBeVisible();

      // Should show count
      await expect(page.locator(selectors.cartCount)).toBeVisible();

      // Should show total
      await expect(page.locator(selectors.cartTotal)).toBeVisible();
    });
  });

  test.describe('Locale Support', () => {
    test('should load Hebrew locale with RTL', async ({ page }) => {
      await page.goto('/he');
      await waitForPageLoad(page);

      // Check RTL direction
      const dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('rtl');

      // Products should still load
      const products = page.locator(selectors.productCard);
      const count = await products.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should load English locale with LTR', async ({ page }) => {
      await page.goto('/en');
      await waitForPageLoad(page);

      // Check LTR direction
      const dir = await page.locator('html').getAttribute('dir');
      expect(dir).toBe('ltr');
    });
  });

  test.describe('Navigation', () => {
    test('should have working logo link', async ({ page }) => {
      await page.goto('/en');
      await waitForPageLoad(page);

      // Click logo
      const logo = page.locator('header a').first();
      await logo.click();

      // Should stay on home page
      await expect(page).toHaveURL(/\/(en|he)?$/);
    });

    test('should handle 404 gracefully', async ({ page }) => {
      await page.goto('/en/nonexistent-page-12345');

      // Should show some page (either 404 or redirect to home)
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
