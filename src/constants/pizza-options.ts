export const PizzaSizes = {
  20: 'Small',
  30: 'Medium',
  40: 'Large',
} as const;

export const PizzaDoughs = {
  1: 'Traditional',
  2: 'Thin',
} as const;

export const SIZES_DATA = Object.entries(PizzaSizes).map(([value, name]) => ({ name, value }));
export const DOUGHS_DATA = Object.entries(PizzaDoughs).map(([value, name]) => ({ name, value }));

export type PizzaSize = keyof typeof PizzaSizes;
export type PizzaDoughType = keyof typeof PizzaDoughs;
