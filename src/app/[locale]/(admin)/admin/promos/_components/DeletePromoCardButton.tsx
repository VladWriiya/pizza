'use client';

import React, { useTransition } from 'react';
import { Button } from '@/shared/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { deletePromoCardAction } from '@/features/promo/actions/promo.mutations';
import toast from 'react-hot-toast';

interface Props {
  promoCardId: number;
  onDeleted: () => void;
}

export const DeletePromoCardButton: React.FC<Props> = ({ promoCardId, onDeleted }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deletePromoCardAction(promoCardId);
      if (result.success) {
        toast.success('Promo card deleted!');
        onDeleted();
      } else {
        toast.error(result.error || 'Failed to delete');
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" disabled={isPending}>
          <Trash2 size={16} className="pz-text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Promo Card?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The promo card will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="pz-bg-red-500 hover:pz-bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
