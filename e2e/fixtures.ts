import { test as base, expect, Page } from '@playwright/test';

// Test user credentials (from seeded database - prisma/seeds/users.ts)
export const TEST_USER = {
  email: 'user@test.ru',
  password: '123456',
};

export const TEST_ADMIN = {
  email: 'admin@test.ru',
  password: '123456',
};

// Selectors - centralized for easy maintenance
export const selectors = {
  // Product
  productCard: '[data-testid="product-card"]',
  productPrice: '[data-testid="product-price"]',
  productModal: '[data-testid="product-modal"]',
  addToCartBtn: '[data-testid="add-to-cart"]',

  // Cart button in header
  cartButton: '[data-testid="cart-button"]',
  cartTotal: '[data-testid="cart-total"]',
  cartCount: '[data-testid="cart-count"]',

  // Cart drawer
  cartDrawer: '[data-testid="cart-drawer"]',
  cartDrawerTotal: '[data-testid="cart-drawer-total"]',
  cartEmpty: '[data-testid="cart-empty"]',
  cartItem: '[data-testid="cart-item"]',

  // Count buttons
  countPlus: '[data-testid="count-plus"]',
  countMinus: '[data-testid="count-minus"]',
  countValue: '[data-testid="count-value"]',
};

// Extended test with common utilities
export const test = base.extend<{
  homePage: void;
}>({
  homePage: async ({ page }, use) => {
    await page.goto('/en');
    await waitForPageLoad(page);
    await use();
  },
});

export { expect };

// Helper to wait for page to be fully loaded
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

// Helper to clear cart (clear cookies)
export async function clearCart(page: Page) {
  await page.context().clearCookies();
}

// Helper to open first product modal
export async function openProductModal(page: Page) {
  const productCard = page.locator(selectors.productCard).first();
  await productCard.click();
  await page.waitForSelector(selectors.productModal, { timeout: 5000 });
}

// Helper to add first product to cart and close modal
export async function addProductToCart(page: Page) {
  await openProductModal(page);
  const addBtn = page.locator(selectors.addToCartBtn);
  await addBtn.click();
  // Wait for modal to close (router.back())
  await page.waitForSelector(selectors.productModal, { state: 'hidden', timeout: 5000 });
}

// Helper to open cart drawer
export async function openCartDrawer(page: Page) {
  const cartBtn = page.locator(selectors.cartButton);
  await cartBtn.click();
  await page.waitForSelector(selectors.cartDrawer, { timeout: 5000 });
}

// Helper to get cart count from header button
export async function getCartCount(page: Page): Promise<number> {
  const countEl = page.locator(selectors.cartCount);
  const text = await countEl.textContent();
  return parseInt(text || '0', 10);
}

// Helper to get cart total from header button
export async function getCartTotal(page: Page): Promise<number> {
  const totalEl = page.locator(selectors.cartTotal);
  const text = await totalEl.textContent();
  // Extract number from "123 ₪"
  const match = text?.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// Helper to get cart item count in drawer
export async function getCartItemCount(page: Page): Promise<number> {
  const items = page.locator(selectors.cartItem);
  return await items.count();
}

// Helper to increase quantity of first cart item
export async function increaseFirstItemQuantity(page: Page) {
  const plusBtn = page.locator(selectors.cartItem).first().locator(selectors.countPlus);
  await plusBtn.click();
  await page.waitForTimeout(500); // Wait for update
}

// Helper to decrease quantity of first cart item
export async function decreaseFirstItemQuantity(page: Page) {
  const minusBtn = page.locator(selectors.cartItem).first().locator(selectors.countMinus);
  await minusBtn.click();
  await page.waitForTimeout(500);
}

// Helper to get first item quantity in cart drawer
export async function getFirstItemQuantity(page: Page): Promise<number> {
  const countEl = page.locator(selectors.cartItem).first().locator(selectors.countValue);
  const text = await countEl.textContent();
  return parseInt(text || '1', 10);
}
