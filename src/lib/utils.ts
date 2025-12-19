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

/**
 * Safely parse JSON with type validation
 * Returns fallback value if parsing fails or result is not of expected type
 */
export function safeJsonParse<T>(
  value: unknown,
  fallback: T,
  validator?: (parsed: unknown) => parsed is T
): T {
  try {
    if (typeof value !== 'string') {
      if (validator && validator(value)) {
        return value;
      }
      return fallback;
    }

    const parsed = JSON.parse(value);

    if (validator) {
      return validator(parsed) ? parsed : fallback;
    }

    return parsed as T;
  } catch {
    return fallback;
  }
}

/**
 * Type guard for arrays
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
