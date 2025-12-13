'use client';

import { useCart } from './use-cart';
import { useRouter } from '@/i18n/navigation';
import toast from 'react-hot-toast';
import { AddToCartPayload } from '@/store/cart.store';
import { ProductWithDetails } from '@/lib/prisma-types';
import { useLocale } from 'next-intl';

export const useAddToCart = () => {
    const { addCartItem, loading } = useCart();
    const router = useRouter();
    const locale = useLocale();

    const handleAddToCart = async (
        product: Pick<ProductWithDetails, 'name' | 'translations'>,
        payload: Omit<AddToCartPayload, 'productItemId'> & { productItemId?: number },
    ) => {
        if (!payload.productItemId) {
            toast.error("Variant not found.");
            return;
        }

        const translations = product.translations as { [key: string]: { name?: string } } | null;
        const translatedName = translations?.[locale]?.name || product.name;

        try {
            await addCartItem(payload as AddToCartPayload);
            toast.success(`${translatedName} added to the cart!`);
            router.back();
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : '';
            if (errorMessage.startsWith('CART_LIMIT_EXCEEDED:')) {
                const limit = errorMessage.split(':')[1];
                toast.error(`Maximum ${limit} items per order`);
            } else {
                toast.error('Could not add item to the cart.');
            }
        }
    };

    return {
        handleAddToCart,
        loading,
    };
};