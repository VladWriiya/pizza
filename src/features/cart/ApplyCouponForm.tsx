'use client';

import { useState } from 'react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import toast from 'react-hot-toast';
import { applyCouponAction } from './actions/apply-coupon.action';
import { useCart } from './hooks/use-cart';
import { useTranslations } from 'next-intl';

export const ApplyCouponForm = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchCartItems } = useCart();
  const t = useTranslations('CheckoutForm');

  const handleApply = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const result = await applyCouponAction(code);
      if (result.success) {
        toast.success(`${t('couponApplied')} ${result.discount} ILS`);
        // Перезагружаем корзину чтобы обновить state с новым couponCode и totalAmount
        await fetchCartItems();
      } else {
        toast.error(result.error || t('couponError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pz-flex pz-gap-2">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={t('promoCodePlaceholder')}
        disabled={loading}
      />
      <Button onClick={handleApply} disabled={loading || !code.trim()}>
        {loading ? '...' : t('apply')}
      </Button>
    </div>
  );
};