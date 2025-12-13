'use client';

import { reorderPromoCardsAction } from '@/features/promo/actions/promo.mutations';
import { PromoCard } from '@prisma/client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';

export const useReorderPromoCards = (
  promoCards: PromoCard[],
  setPromoCards: React.Dispatch<React.SetStateAction<PromoCard[]>>
) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldItems = promoCards;
      const oldIndex = oldItems.findIndex((item) => item.id === active.id);
      const newIndex = oldItems.findIndex((item) => item.id === over.id);
      const newItemsInOrder = arrayMove(oldItems, oldIndex, newIndex);

      const orderedIds = newItemsInOrder.map((item) => item.id);

      setPromoCards(newItemsInOrder);

      toast.promise(
        reorderPromoCardsAction(orderedIds).then((res) => {
          if (res && 'error' in res) {
            throw new Error(res.error || 'Server error');
          }
          return res;
        }),
        {
          loading: 'Saving order...',
          success: 'Order saved!',
          error: (err) => {
            setPromoCards(oldItems);
            return err.message || 'Failed to save order.';
          },
        }
      );
    }
  };

  return {
    handleDragEnd,
  };
};
