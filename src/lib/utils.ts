import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate discounted price
 * @param price Original price
 * @param discountPercent Discount percentage (e.g., 10 = 10% off)
 * @returns Discounted price rounded to nearest integer
 */
export function calculateDiscountedPrice(price: number, discountPercent: number | null | undefined): number {
  if (!discountPercent || discountPercent <= 0) return price;
  return Math.round(price * (100 - discountPercent) / 100);
}

/**
 * Get price display info for a product
 * @param price Original price
 * @param discountPercent Discount percentage
 * @returns Object with original, discounted prices and hasDiscount flag
 */
export function getPriceDisplay(price: number, discountPercent: number | null | undefined) {
  const hasDiscount = !!discountPercent && discountPercent > 0;
  return {
    original: price,
    discounted: hasDiscount ? calculateDiscountedPrice(price, discountPercent) : price,
    hasDiscount,
    discountPercent: discountPercent || 0,
  };
}
