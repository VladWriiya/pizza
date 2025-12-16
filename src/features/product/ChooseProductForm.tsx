'use client';

import React from 'react';
import { useRouter } from '@/i18n/navigation';
import { cn, getPriceDisplay } from "@/lib/utils";
import { useProductForm } from "@/features/product/hooks/use-product-form";
import { Heading } from '@/shared/Heading';
import { Button } from "@/shared/ui/button";
import toast from 'react-hot-toast';
import {  AddToCartPayload } from '@/store/cart.store';
import { useTranslations, useLocale } from 'next-intl';
import { ProductWithDetails } from '@/lib/prisma-types';
import { ProductImage } from './ProductImage';
import { PizzaOptions } from './PizzaOptions';
import { BaseIngredientToggle } from '@/entities/product/BaseIngredientToggle';
import { useCart } from '../cart/hooks/use-cart';
import { X } from 'lucide-react';

interface ChooseProductFormProps {
    product: ProductWithDetails;
    className?: string;
    onClose?: () => void;
}

export const ChooseProductForm = ({ product, className, onClose }: ChooseProductFormProps) => {
    const t = useTranslations('ProductModal');
    const locale = useLocale();
    const { addCartItem, loading } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const isPizza = product.items.some(item => !!item.pizzaType);

    const {
        size, setSize,
        doughType, setDoughType,
        selectedIngredients, toggleIngredient,
        removedIngredients, toggleRemovedIngredient,
        availableSizes,
        detailsText, totalPrice,
        doughOptions,
        allIngredients,
        baseIngredients,
    } = useProductForm(product.items, product.ingredients, product.baseIngredients);

    const handleAddToCart = async () => {
        // Prevent double-click
        if (isSubmitting) return;

        const selectedVariant = isPizza
            ? product.items.find(item => item.size === size && item.pizzaType === doughType)
            : product.items[0];

        if (!selectedVariant) {
            return toast.error("Variant not found.");
        }

        const payload: AddToCartPayload = {
            productItemId: selectedVariant.id,
            ingredients: isPizza ? Array.from(selectedIngredients) : undefined,
            removedIngredients: isPizza && removedIngredients.size > 0
                ? Array.from(removedIngredients)
                : undefined,
        };

        setIsSubmitting(true);
        try {
            await addCartItem(payload);
            toast.success(`${translatedName} added to the cart!`);
            router.back();
        } catch {
            toast.error('Could not add item to the cart.');
            setIsSubmitting(false);
        }
    };

    type TranslationsType = { [key: string]: { name?: string } } | null;
    const translatedName = (product.translations as TranslationsType)?.[locale]?.name || product.name;

    // Technical description (ingredient list)
    const techDescription = product.description as { en?: string; he?: string } | null;
    const translatedDescription = techDescription?.[locale as 'en' | 'he'] || '';

    // Marketing description for simple products
    const marketingDesc = product.marketingDescription as { en?: string; he?: string } | null;
    const translatedMarketingDescription = marketingDesc?.[locale as 'en' | 'he'] || '';

    // Discount calculation
    const displayPrice = isPizza ? totalPrice : product.items[0]?.price || 0;
    const priceInfo = getPriceDisplay(displayPrice, product.discountPercent);

    return (
        <div className={cn(className, 'pz-flex pz-flex-col md:pz-flex-row pz-h-full pz-overflow-auto md:pz-overflow-hidden')} data-testid="product-modal">
            {/* Image section */}
            <div className="pz-flex pz-shrink-0 pz-h-[250px] sm:pz-h-[300px] md:pz-h-full md:pz-flex-1 pz-items-center pz-justify-center pz-bg-white pz-relative">
                <ProductImage isPizza={isPizza} imageUrl={product.imageUrl} name={translatedName} size={size} />
            </div>
            {/* Content section */}
            <div className="pz-relative pz-w-full md:pz-w-[490px] pz-bg-[#f7f6f5] pz-p-4 md:pz-p-7 pz-flex pz-flex-col md:pz-overflow-y-auto">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="pz-absolute pz-top-4 pz-right-4 pz-rounded-full pz-p-1 pz-opacity-70 hover:pz-opacity-100 pz-transition-opacity"
                    >
                        <X className="pz-w-5 pz-h-5" />
                    </button>
                )}
                <Heading level="2" className="pz-font-extrabold pz-mb-1 pz-pr-8">{translatedName}</Heading>
                {isPizza && <p className="pz-text-gray-500">{detailsText}</p>}

                {/* Description for simple products (not pizza) */}
                {!isPizza && (
                    <div className="pz-mt-3">
                        {translatedMarketingDescription && (
                            <p className="pz-text-base pz-text-gray-700 pz-italic pz-leading-relaxed pz-mb-2">
                                {translatedMarketingDescription}
                            </p>
                        )}
                        {translatedDescription && (
                            <p className="pz-text-sm pz-text-gray-500">
                                {translatedDescription}
                            </p>
                        )}
                    </div>
                )}

                {/* Description with base sauces/cheese + clickable removable ingredients */}
                {isPizza && (
                    <p className="pz-text-lg pz-text-gray-600 pz-italic pz-mt-2 pz-leading-relaxed">
                        {translatedDescription}
                        {baseIngredients.length > 0 && (
                            <>
                                {translatedDescription ? ', ' : ''}
                                {baseIngredients.map((ingredient, index) => {
                                    const rawName = (ingredient.translations as TranslationsType)?.[locale]?.name || ingredient.name;
                                    const ingredientName = rawName.charAt(0).toLowerCase() + rawName.slice(1);
                                    return (
                                        <React.Fragment key={ingredient.id}>
                                            <BaseIngredientToggle
                                                name={ingredientName}
                                                isRemoved={removedIngredients.has(ingredient.id)}
                                                onClick={() => toggleRemovedIngredient(ingredient.id)}
                                            />
                                            {index < baseIngredients.length - 1 && ', '}
                                        </React.Fragment>
                                    );
                                })}
                            </>
                        )}
                    </p>
                )}

                {isPizza && (
                    <PizzaOptions
                        locale={locale}
                        ingredients={allIngredients}
                        availableSizes={availableSizes}
                        doughOptions={doughOptions}
                        selectedIngredients={selectedIngredients}
                        size={size}
                        doughType={doughType}
                        onSizeChange={setSize}
                        onDoughChange={setDoughType}
                        onToggleIngredient={toggleIngredient}
                    />
                )}
                
                {/* Price section with discount - sticky on mobile */}
                <div className="pz-mt-auto pz-space-y-3 pz-sticky pz-bottom-0 pz-bg-[#f7f6f5] pz-pt-4 pz-pb-2 md:pz-pb-0 pz-z-10">
                    {priceInfo.hasDiscount && (
                        <div className="pz-flex pz-items-center pz-gap-3">
                            <span className="pz-bg-red-500 pz-text-white pz-text-sm pz-font-bold pz-px-3 pz-py-1 pz-rounded">
                                -{priceInfo.discountPercent}%
                            </span>
                            <span className="pz-line-through pz-text-gray-400 pz-text-lg">
                                {priceInfo.original} ₪
                            </span>
                            <span className="pz-text-primary pz-font-bold pz-text-2xl">
                                {priceInfo.discounted} ₪
                            </span>
                        </div>
                    )}
                    <Button
                        loading={loading || isSubmitting}
                        onClick={handleAddToCart}
                        data-testid="add-to-cart"
                        className="pz-h-[55px] pz-px-10 pz-text-base pz-rounded-[18px] pz-w-full">
                        {priceInfo.hasDiscount ? (
                            t('addToCart', { price: priceInfo.discounted })
                        ) : (
                            t('addToCart', { price: displayPrice })
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};