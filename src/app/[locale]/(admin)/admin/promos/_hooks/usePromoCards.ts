'use client';

import { getPromoCardsAction } from '@/features/promo/actions/promo.mutations';
import { PromoCard } from '@prisma/client';
import { useEffect, useState } from 'react';

export const usePromoCards = () => {
  const [promoCards, setPromoCards] = useState<PromoCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPromoCards = () => {
    setLoading(true);
    getPromoCardsAction().then((data) => {
      setPromoCards(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchPromoCards();
  }, []);

  return {
    promoCards,
    setPromoCards,
    loading,
    fetchPromoCards,
  };
};
