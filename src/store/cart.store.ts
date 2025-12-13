'use client';

import { create } from 'zustand';
import { transformCartData } from '@/lib/cart-helpers';
import type { TransformedCartItem } from '@/lib/cart-helpers';
import {
  addCartItemAction,
  getCartAction,
  removeCartItemAction,
  updateCartItemQuantityAction,
} from '@/app/[locale]/actions/cart';

export interface AddToCartPayload {
  productItemId: number;
  ingredients?: number[];
  removedIngredients?: number[];
}

export interface CartState {
  items: TransformedCartItem[];
  totalAmount: number;
  couponCode: string | null;
  loading: boolean;
  error: boolean | null;
  cartLimitError: string | null;

  fetchCartItems: (locale: string, tDoughs: (key: string) => string) => Promise<void>;
  addCartItem: (payload: AddToCartPayload, locale: string, tDoughs: (key: string) => string) => Promise<void>;
  updateItemQuantity: (id: number, quantity: number, locale: string, tDoughs: (key: string) => string) => Promise<void>;
  removeCartItem: (id: number, locale: string, tDoughs: (key: string) => string) => Promise<void>;
  clearCart: () => void;
  clearCartLimitError: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,
  couponCode: null,
  loading: true,
  error: null,
  cartLimitError: null,

  fetchCartItems: async (locale, tDoughs) => {
    try {
      set({ loading: true, error: null });
      const data = await getCartAction();
      set(transformCartData(data, locale, tDoughs));
    } catch (e) {
      console.error(e);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  addCartItem: async (payload, locale, tDoughs) => {
    try {
      set({ loading: true, error: null });
      const data = await addCartItemAction(payload);
      set(transformCartData(data, locale, tDoughs));
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '';
      if (errorMessage.startsWith('CART_LIMIT_EXCEEDED:')) {
        const limit = errorMessage.split(':')[1];
        set({ error: true, cartLimitError: `Maximum ${limit} items per order` });
      } else {
        console.error(e);
        set({ error: true });
      }
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  updateItemQuantity: async (id, quantity, locale, tDoughs) => {
    try {
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? { ...item, disabled: true } : item)),
      }));
      const data = await updateCartItemQuantityAction(id, quantity);
      set(transformCartData(data, locale, tDoughs));
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : '';
      if (errorMessage.startsWith('CART_LIMIT_EXCEEDED:')) {
        const limit = errorMessage.split(':')[1];
        set({ cartLimitError: `Maximum ${limit} items per order` });
      } else {
        console.error(e);
        set({ error: true });
      }
    } finally {
      set((state) => ({ items: state.items.map((item) => ({ ...item, disabled: false })) }));
    }
  },

  removeCartItem: async (id, locale, tDoughs) => {
    try {
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? { ...item, disabled: true } : item)),
      }));
      const data = await removeCartItemAction(id);
      set(transformCartData(data, locale, tDoughs));
    } catch (e) {
      console.error(e);
      set({ error: true });
    } finally {
        set((state) => ({ items: state.items.map((item) => ({ ...item, disabled: false })) }));
    }
  },

  clearCart: () => set({ items: [], totalAmount: 0, couponCode: null, cartLimitError: null }),
  clearCartLimitError: () => set({ cartLimitError: null }),
}));