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
    // Get current item - price is per unit (not multiplied by quantity)
    const currentItems = useCartStore.getState().items;
    const targetItem = currentItems.find((item) => item.id === id);

    if (!targetItem) return;

    // price in TransformedCartItem is unit price (per 1 item)
    const unitPrice = targetItem.price;
    const quantityDiff = quantity - targetItem.quantity;

    // Optimistic update: immediately update UI
    // Note: price stays the same (it's unit price), only quantity changes
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? { ...item, quantity, disabled: true }
          : item
      ),
      totalAmount: state.totalAmount + unitPrice * quantityDiff,
    }));

    try {
      const data = await updateCartItemQuantityAction(id, quantity);
      // Only update this specific item from server response, preserve other items' current state
      const serverCart = transformCartData(data, locale, tDoughs);
      set((state) => ({
        items: state.items.map((item) => {
          if (item.id === id) {
            const serverItem = serverCart.items.find((si) => si.id === id);
            return serverItem ? { ...serverItem, disabled: false } : { ...item, disabled: false };
          }
          return item;
        }),
        totalAmount: serverCart.totalAmount,
      }));
    } catch (e) {
      // Rollback only this item on error
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? { ...item, quantity: targetItem.quantity, disabled: false }
            : item
        ),
        totalAmount: state.totalAmount - unitPrice * quantityDiff,
      }));

      const errorMessage = e instanceof Error ? e.message : '';
      if (errorMessage.startsWith('CART_LIMIT_EXCEEDED:')) {
        const limit = errorMessage.split(':')[1];
        set({ cartLimitError: `Maximum ${limit} items per order` });
      } else {
        console.error(e);
        set({ error: true });
      }
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