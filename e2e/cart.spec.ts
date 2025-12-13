import { test, expect, selectors, waitForPageLoad, clearCart, addProductToCart, openCartDrawer, getCartCount, getCartTotal, getCartItemCount, increaseFirstItemQuantity, getFirstItemQuantity } from './fixtures';

test.describe('Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await clearCart(page);
    await page.goto('/en');
    await waitForPageLoad(page);
  });

  test('should show empty cart initially', async ({ page }) => {
    // Cart count should be 0
    const count = await getCartCount(page);
    expect(count).toBe(0);

    // Cart total should be 0
    const total = await getCartTotal(page);
    expect(total).toBe(0);
  });

  test('should add product to cart', async ({ page }) => {
    // Get initial cart count
    const initialCount = await getCartCount(page);
    expect(initialCount).toBe(0);

    // Add product to cart
    await addProductToCart(page);

    // Verify cart count increased
    const newCount = await getCartCount(page);
    expect(newCount).toBe(1);

    // Verify cart total is greater than 0
    const total = await getCartTotal(page);
    expect(total).toBeGreaterThan(0);
  });

  test('should open cart drawer and show item', async ({ page }) => {
    // Add product first
    await addProductToCart(page);

    // Open cart drawer
    await openCartDrawer(page);

    // Verify drawer is visible
    await expect(page.locator(selectors.cartDrawer)).toBeVisible();

    // Verify item is in cart
    const itemCount = await getCartItemCount(page);
    expect(itemCount).toBe(1);

    // Verify cart item is visible
    await expect(page.locator(selectors.cartItem).first()).toBeVisible();
  });

  test('should show empty state in cart drawer', async ({ page }) => {
    // Open cart drawer without adding anything
    await openCartDrawer(page);

    // Verify empty state is shown
    await expect(page.locator(selectors.cartEmpty)).toBeVisible();
  });

  test('should increase item quantity', async ({ page }) => {
    // Add product
    await addProductToCart(page);

    // Open cart drawer
    await openCartDrawer(page);

    // Get initial quantity
    const initialQty = await getFirstItemQuantity(page);
    expect(initialQty).toBe(1);

    // Click plus button
    await increaseFirstItemQuantity(page);

    // Verify quantity increased
    const newQty = await getFirstItemQuantity(page);
    expect(newQty).toBe(2);

    // Verify header cart count updated
    const headerCount = await getCartCount(page);
    expect(headerCount).toBe(2);
  });

  test('should add same product twice - quantity increases', async ({ page }) => {
    // Add product first time
    await addProductToCart(page);
    expect(await getCartCount(page)).toBe(1);

    // Add same product second time
    await addProductToCart(page);

    // Should have quantity 2 (same item), not 2 separate items
    // Note: This depends on your cart logic - adjust if needed
    const count = await getCartCount(page);
    expect(count).toBe(2);
  });

  test('should persist cart after page reload', async ({ page }) => {
    // Add product
    await addProductToCart(page);
    const countBefore = await getCartCount(page);
    const totalBefore = await getCartTotal(page);

    expect(countBefore).toBeGreaterThan(0);
    expect(totalBefore).toBeGreaterThan(0);

    // Reload page
    await page.reload();
    await waitForPageLoad(page);

    // Verify cart persisted
    const countAfter = await getCartCount(page);
    const totalAfter = await getCartTotal(page);

    expect(countAfter).toBe(countBefore);
    expect(totalAfter).toBe(totalBefore);
  });

  test('should display correct total in drawer', async ({ page }) => {
    // Add product
    await addProductToCart(page);

    // Open cart drawer
    await openCartDrawer(page);

    // Get header total
    const headerTotal = await getCartTotal(page);

    // Get drawer total
    const drawerTotalEl = page.locator(selectors.cartDrawerTotal);
    const drawerTotalText = await drawerTotalEl.textContent();
    const drawerTotal = parseInt(drawerTotalText?.match(/(\d+)/)?.[1] || '0', 10);

    // They should match
    expect(drawerTotal).toBe(headerTotal);
  });
});
