'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderFormSchema, OrderFormValues } from '@/lib/schemas/order-form-schema';
import type { CartWithRelations } from '@/lib/prisma-types';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useCart } from '@/features/cart/hooks/use-cart';
import { PriceDetails } from '@/entities/order/CheckoutSidebar';
import { calculateFinalOrderAmountAction } from '@/app/[locale]/actions/order';

interface Props {
  cart: CartWithRelations;
  initialPriceDetails: PriceDetails;
}

export const useOrderForm = ({ cart, initialPriceDetails }: Props) => {
  const { data: session } = useSession();
  const { items: cartItems, updateItemQuantity, removeCartItem } = useCart();

  const [priceDetails, setPriceDetails] = useState<PriceDetails>(initialPriceDetails);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      apartment: '',
      comment: '',
    },
  });

  useEffect(() => {
    if (session?.user) {
      const [firstName, ...lastNameParts] = session.user.name?.split(' ') || [];
      const lastName = lastNameParts.join(' ');

      form.reset({
        ...form.getValues(),
        firstName: firstName,
        lastName: lastName,
        email: session.user.email || '',
      });
    }
  }, [session, form]);

  const refreshPriceDetails = async () => {
    const token = cart.token;
    const newDetails = await calculateFinalOrderAmountAction(token);
    setPriceDetails(newDetails);
  };

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    try {
      if (quantity === 0) {
        await removeCartItem(id);
      } else {
        await updateItemQuantity(id, quantity);
      }
      await refreshPriceDetails();
    } catch {
      toast.error('Failed to update item.');
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await removeCartItem(id);
      await refreshPriceDetails();
    } catch {
      toast.error('Failed to remove item.');
    }
  };
  
  return {
    form,
    cartItems,
    priceDetails,
    handleUpdateQuantity,
    handleRemoveItem,
  };
};