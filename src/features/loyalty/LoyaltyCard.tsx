'use client';

import { useEffect, useState } from 'react';
import { Gift, TrendingUp, TrendingDown, Award, Loader2 } from 'lucide-react';
import { getLoyaltyInfoAction, type LoyaltyInfo } from '@/app/[locale]/actions/loyalty';
import { LOYALTY_CONFIG } from '@/lib/loyalty-config';
import { cn } from '@/lib/utils';

interface LoyaltyCardProps {
  className?: string;
}

export function LoyaltyCard({ className }: LoyaltyCardProps) {
  const [loyaltyInfo, setLoyaltyInfo] = useState<LoyaltyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

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

  if (loading) {
    return (
      <div className={cn('pz-bg-gradient-to-br pz-from-purple-500 pz-to-indigo-600 pz-rounded-xl pz-p-6 pz-text-white', className)}>
        <div className="pz-flex pz-items-center pz-justify-center pz-py-4">
          <Loader2 className="pz-w-6 pz-h-6 pz-animate-spin" />
        </div>
      </div>
    );
  }

  if (!loyaltyInfo) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'EARNED_ORDER' || type === 'BONUS') {
      return <TrendingUp size={14} className="pz-text-green-400" />;
    }
    return <TrendingDown size={14} className="pz-text-red-400" />;
  };

  return (
    <div className={cn('pz-bg-gradient-to-br pz-from-purple-500 pz-to-indigo-600 pz-rounded-xl pz-overflow-hidden', className)}>
      {/* Header */}
      <div className="pz-p-6">
        <div className="pz-flex pz-items-center pz-gap-2 pz-mb-4">
          <Gift className="pz-w-6 pz-h-6 pz-text-yellow-300" />
          <h3 className="pz-text-lg pz-font-semibold pz-text-white">Loyalty Points</h3>
        </div>

        {/* Points Display */}
        <div className="pz-flex pz-items-end pz-gap-2 pz-mb-2">
          <span className="pz-text-4xl pz-font-bold pz-text-white">{loyaltyInfo.points}</span>
          <span className="pz-text-purple-200 pz-pb-1">points</span>
        </div>

        {/* Value */}
        <p className="pz-text-purple-200 pz-text-sm">
          Worth <span className="pz-font-semibold pz-text-white">{loyaltyInfo.pointsValue.toFixed(2)} ₪</span> in discounts
        </p>

        {/* Redeem Status */}
        {loyaltyInfo.canRedeem ? (
          <div className="pz-mt-4 pz-flex pz-items-center pz-gap-2 pz-bg-white/20 pz-rounded-lg pz-px-3 pz-py-2">
            <Award size={16} className="pz-text-yellow-300" />
            <span className="pz-text-sm pz-text-white">You can redeem points at checkout!</span>
          </div>
        ) : (
          <p className="pz-mt-3 pz-text-sm pz-text-purple-200">
            Earn {loyaltyInfo.minPointsToRedeem - loyaltyInfo.points} more points to start redeeming
          </p>
        )}

        {/* Earn Info */}
        <p className="pz-mt-4 pz-text-xs pz-text-purple-200">
          Earn {LOYALTY_CONFIG.POINTS_PER_ILS} point for every ₪1 spent
        </p>
      </div>

      {/* Transaction History Toggle */}
      {loyaltyInfo.recentTransactions.length > 0 && (
        <div className="pz-border-t pz-border-white/20">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="pz-w-full pz-px-6 pz-py-3 pz-text-sm pz-text-purple-200 hover:pz-text-white pz-transition pz-flex pz-items-center pz-justify-between"
          >
            <span>Recent Activity</span>
            <span className="pz-text-xs">{showHistory ? '▲' : '▼'}</span>
          </button>

          {showHistory && (
            <div className="pz-px-6 pz-pb-4 pz-space-y-2 pz-max-h-48 pz-overflow-y-auto">
              {loyaltyInfo.recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="pz-flex pz-items-center pz-justify-between pz-text-sm pz-bg-white/10 pz-rounded-lg pz-px-3 pz-py-2"
                >
                  <div className="pz-flex pz-items-center pz-gap-2">
                    {getTransactionIcon(tx.type)}
                    <div>
                      <p className="pz-text-white pz-text-xs">{tx.description || tx.type}</p>
                      <p className="pz-text-purple-300 pz-text-xs">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <span className={cn(
                    'pz-font-semibold',
                    tx.points > 0 ? 'pz-text-green-300' : 'pz-text-red-300'
                  )}>
                    {tx.points > 0 ? '+' : ''}{tx.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
