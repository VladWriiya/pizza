'use client';

import { useEffect, useState } from 'react';
import { Gift, Check } from 'lucide-react';
import { getLoyaltyInfoAction, type LoyaltyInfo } from '@/app/[locale]/actions/loyalty';
import { LOYALTY_CONFIG } from '@/lib/loyalty-config';
import { Button } from '@/shared/ui/button';
import { Slider } from '@/shared/ui/slider';
import { cn } from '@/lib/utils';

interface UsePointsSectionProps {
  onPointsApply: (points: number, discount: number) => void;
  appliedPoints?: number;
  maxDiscount?: number; // Max discount based on order total
  className?: string;
}

export function UsePointsSection({ onPointsApply, appliedPoints = 0, maxDiscount, className }: UsePointsSectionProps) {
  const [loyaltyInfo, setLoyaltyInfo] = useState<LoyaltyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    async function fetchLoyalty() {
      const result = await getLoyaltyInfoAction();
      if (result.success && result.data) {
        setLoyaltyInfo(result.data);
      }
      setLoading(false);
    }
    fetchLoyalty();
  }, []);

  useEffect(() => {
    if (appliedPoints > 0) {
      setPointsToUse(appliedPoints);
      setIsApplied(true);
    }
  }, [appliedPoints]);

  if (loading || !loyaltyInfo || !loyaltyInfo.canRedeem) {
    return null;
  }

  const maxPointsToUse = (() => {
    let max = loyaltyInfo.points;

    // Cap by max discount (order total minus delivery)
    if (maxDiscount) {
      const maxPointsForDiscount = Math.floor(maxDiscount / LOYALTY_CONFIG.ILS_PER_POINT);
      max = Math.min(max, maxPointsForDiscount);
    }

    return max;
  })();

  const currentDiscount = pointsToUse * LOYALTY_CONFIG.ILS_PER_POINT;

  const handleApply = () => {
    if (pointsToUse >= LOYALTY_CONFIG.MIN_POINTS_TO_REDEEM) {
      onPointsApply(pointsToUse, currentDiscount);
      setIsApplied(true);
    }
  };

  const handleRemove = () => {
    onPointsApply(0, 0);
    setPointsToUse(0);
    setIsApplied(false);
  };

  return (
    <div className={cn('pz-bg-purple-50 pz-rounded-lg pz-p-4', className)}>
      <div className="pz-flex pz-items-center pz-gap-2 pz-mb-3">
        <Gift size={18} className="pz-text-purple-600" />
        <span className="pz-font-semibold pz-text-purple-900">Use Loyalty Points</span>
        <span className="pz-text-sm pz-text-purple-600 pz-ms-auto">
          {loyaltyInfo.points} pts available
        </span>
      </div>

      {isApplied ? (
        <div className="pz-flex pz-items-center pz-justify-between pz-bg-white pz-rounded-lg pz-p-3">
          <div className="pz-flex pz-items-center pz-gap-2">
            <Check size={18} className="pz-text-green-600" />
            <span className="pz-text-green-700 pz-font-medium">
              {pointsToUse} points = -{currentDiscount.toFixed(2)} ₪
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="pz-text-red-600 hover:pz-text-red-700 hover:pz-bg-red-50"
          >
            Remove
          </Button>
        </div>
      ) : (
        <>
          <div className="pz-mb-4">
            <Slider
              value={[pointsToUse]}
              onValueChange={(v) => setPointsToUse(v[0])}
              min={0}
              max={maxPointsToUse}
              step={10}
              className="pz-my-4"
            />
            <div className="pz-flex pz-justify-between pz-text-sm pz-text-purple-700">
              <span>{pointsToUse} points</span>
              <span>-{currentDiscount.toFixed(2)} ₪ discount</span>
            </div>
          </div>

          <Button
            onClick={handleApply}
            disabled={pointsToUse < LOYALTY_CONFIG.MIN_POINTS_TO_REDEEM}
            className="pz-w-full pz-bg-purple-600 hover:pz-bg-purple-700"
          >
            Apply {pointsToUse} Points
          </Button>

          {pointsToUse > 0 && pointsToUse < LOYALTY_CONFIG.MIN_POINTS_TO_REDEEM && (
            <p className="pz-text-xs pz-text-purple-600 pz-mt-2 pz-text-center">
              Minimum {LOYALTY_CONFIG.MIN_POINTS_TO_REDEEM} points required
            </p>
          )}
        </>
      )}
    </div>
  );
}
