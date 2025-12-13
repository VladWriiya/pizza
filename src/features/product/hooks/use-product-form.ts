'use client';

import { useState, useEffect, useMemo, useCallback } from "react";
import type { ProductItem, Ingredient } from "@prisma/client";
import { useSet } from "react-use";
import { type PizzaSize, type PizzaDoughType } from "@/constants/pizza-options";
import { getAvailableSizes } from "@/lib/pizza-utils";
import { useTranslations } from "next-intl";

export const useProductForm = (
    productItems: ProductItem[],
    allIngredients: Ingredient[],
    baseIngredients: Ingredient[] = []
) => {
    const t = useTranslations('ProductModal');
    const tSizes = useTranslations('ProductModal.sizes');
    const tDoughs = useTranslations('ProductModal.doughs');

    const initialItem = productItems.length > 0 ? productItems[0] : null;

    const [size, setSize] = useState<PizzaSize>(initialItem?.size as PizzaSize || 30);
    const [doughType, setDoughType] = useState<PizzaDoughType>(initialItem?.pizzaType as PizzaDoughType || 1);
    const [selectedIngredients, { toggle: toggleIngredient }] = useSet(new Set<number>());
    const [removedIngredients, { toggle: toggleRemovedIngredient }] = useSet(new Set<number>());

    const translatedDoughOptions = useMemo(() => [
        { name: tDoughs('1'), value: '1' },
        { name: tDoughs('2'), value: '2' },
    ], [tDoughs]);
    
    const availableSizes = useMemo(() => {
        const sizesData = [
            { name: tSizes('20'), value: '20' },
            { name: tSizes('30'), value: '30' },
            { name: tSizes('40'), value: '40' },
        ];
        return getAvailableSizes(doughType, productItems, sizesData);
    }, [doughType, productItems, tSizes]);

    useEffect(() => {
        const isCurrentSizeAvailable = availableSizes.find(s => Number(s.value) === size && !s.disabled);
        if (!isCurrentSizeAvailable) {
            const firstAvailableSize = availableSizes.find(s => !s.disabled);
            if (firstAvailableSize) {
                setSize(Number(firstAvailableSize.value) as PizzaSize);
            }
        }
    }, [doughType, size, availableSizes]);

    const calculatePrice = useCallback(() => {
        if (!initialItem) return 0;
        const basePrice = productItems.find(item => item.pizzaType === doughType && item.size === size)?.price || 0;
        const ingredientsPrice = Array.from(selectedIngredients).reduce((acc, id) => {
            const ingredient = allIngredients.find(ing => ing.id === id && ing.isAvailable); // <-- Проверяем доступность здесь
            return acc + (ingredient?.price || 0);
        }, 0);
        return basePrice + ingredientsPrice;
    }, [size, doughType, selectedIngredients, productItems, allIngredients, initialItem]);

    const detailsText = useMemo(() => t('detailsText', {
        size,
        dough: tDoughs(String(doughType) as "1" | "2"),
    }), [size, doughType, t, tDoughs]);
    
    const totalPrice = calculatePrice();

    // Filter out base ingredients from extras list
    const baseIngredientIds = useMemo(() => new Set(baseIngredients.map(i => i.id)), [baseIngredients]);
    const extraIngredients = useMemo(
        () => allIngredients.filter(i => !baseIngredientIds.has(i.id)),
        [allIngredients, baseIngredientIds]
    );

    return {
        size, setSize,
        doughType, setDoughType,
        selectedIngredients, toggleIngredient,
        removedIngredients, toggleRemovedIngredient,
        availableSizes,
        doughOptions: translatedDoughOptions,
        detailsText, totalPrice,
        allIngredients: extraIngredients,
        baseIngredients,
    };
};