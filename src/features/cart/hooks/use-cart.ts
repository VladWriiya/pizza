'use client';

import { useEffect, useCallback } from 'react';
import { useCartStore, AddToCartPayload } from '@/store/cart.store';
import { useLocale, useTranslations } from 'next-intl';

export const useCart = () => {
  const locale = useLocale();
  const tDoughs = useTranslations('ProductModal.doughs');
  const cartState = useCartStore();

  const { fetchCartItems } = cartState;

  useEffect(() => {
    fetchCartItems(locale, tDoughs);
  }, [fetchCartItems, locale, tDoughs]);

  const addCartItem = useCallback(
    (payload: AddToCartPayload) => {
      return cartState.addCartItem(payload, locale, tDoughs);
    },
    [cartState, locale, tDoughs]
  );

  const updateItemQuantity = useCallback(
    (id: number, quantity: number) => {
      return cartState.updateItemQuantity(id, quantity, locale, tDoughs);
    },
    [cartState, locale, tDoughs]
  );

  const removeCartItem = useCallback(
    (id: number) => {
      return cartState.removeCartItem(id, locale, tDoughs);
    },
    [cartState, locale, tDoughs]
  );

  const refetchCart = useCallback(() => {
    return cartState.fetchCartItems(locale, tDoughs);
  }, [cartState, locale, tDoughs]);

  return {
    ...cartState,
    addCartItem,
    updateItemQuantity,
    removeCartItem,
    fetchCartItems: refetchCart,
  };
};