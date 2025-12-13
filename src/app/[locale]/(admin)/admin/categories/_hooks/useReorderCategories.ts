'use client';

import { updateCategoriesOrderAction } from '@/features/category/actions/reorder-categories.action';
import { Category } from '@prisma/client';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import toast from 'react-hot-toast';

export const useReorderCategories = (
  categories: Category[],
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>
) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldItems = categories;
      const oldIndex = oldItems.findIndex((item) => item.id === active.id);
      const newIndex = oldItems.findIndex((item) => item.id === over.id);
      const newItemsInOrder = arrayMove(oldItems, oldIndex, newIndex);

      const updatedItemsForServer = newItemsInOrder.map((item, index) => ({
        id: item.id,
        sortIndex: index,
      }));

      setCategories(newItemsInOrder);

      toast.promise(
        updateCategoriesOrderAction(updatedItemsForServer).then((res) => {
          if (res && !res.success) {
            throw new Error(res.error || 'Server error');
          }
          return res;
        }),
        {
          loading: 'Saving order...',
          success: 'Order saved!',
          error: (err) => {
            setCategories(oldItems);
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