'use client';

import { useState } from 'react';
import { Gift, Plus, Minus, History, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { adminAdjustPointsAction, getAdminLoyaltyHistoryAction } from '@/app/[locale]/actions/loyalty';
import { LOYALTY_CONFIG } from '@/lib/loyalty-config';
import { LoyaltyTransactionType } from '@prisma/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface LoyaltyManagementProps {
  userId: number;
  currentPoints: number;
}

const transactionTypeLabels: Record<LoyaltyTransactionType, string> = {
  EARNED_ORDER: 'Order',
  SPENT_DISCOUNT: 'Redeemed',
  ADMIN_ADJUSTMENT: 'Adjustment',
  BONUS: 'Bonus',
  EXPIRED: 'Expired',
};

export function LoyaltyManagement({ userId, currentPoints }: LoyaltyManagementProps) {
  const router = useRouter();
  const [points, setPoints] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{
    id: number;
    points: number;
    type: LoyaltyTransactionType;
    description: string | null;
    createdAt: Date;
  }[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const handleAdjust = async (isAdd: boolean) => {
    const pointsNum = parseInt(points, 10);
    if (isNaN(pointsNum) || pointsNum <= 0) {
      toast.error('Enter a valid number of points');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    setLoading(true);
    try {
      const adjustment = isAdd ? pointsNum : -pointsNum;
      const result = await adminAdjustPointsAction(userId, adjustment, reason.trim());

      if (result.success) {
        toast.success(`Points ${isAdd ? 'added' : 'deducted'} successfully`);
        setPoints('');
        setReason('');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to adjust points');
      }
    } catch {
      toast.error('Failed to adjust points');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    if (history.length > 0) {
      setShowHistory(!showHistory);
      return;
    }

    setLoadingHistory(true);
    try {
      const result = await getAdminLoyaltyHistoryAction(userId);
      if (result.success) {
        setHistory(result.transactions);
      }
      setShowHistory(true);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-6">
      <div className="pz-flex pz-items-center pz-justify-between pz-mb-4">
        <h3 className="pz-font-semibold pz-text-lg pz-flex pz-items-center pz-gap-2">
          <Gift size={20} className="pz-text-purple-600" />
          Loyalty Points
        </h3>
        <div className="pz-text-2xl pz-font-bold pz-text-purple-600">
          {currentPoints} pts
        </div>
      </div>

      <div className="pz-text-sm pz-text-gray-500 pz-mb-4">
        Worth {(currentPoints * LOYALTY_CONFIG.ILS_PER_POINT).toFixed(2)} ₪
      </div>

      {/* Adjustment Form */}
      <div className="pz-space-y-3 pz-border-t pz-pt-4">
        <div className="pz-flex pz-gap-2">
          <Input
            type="number"
            placeholder="Points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            min={1}
            className="pz-w-24"
          />
          <Input
            placeholder="Reason for adjustment"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="pz-flex-1"
          />
        </div>
        <div className="pz-flex pz-gap-2">
          <Button
            variant="outline"
            onClick={() => handleAdjust(true)}
            disabled={loading}
            className="pz-flex-1 pz-text-green-600 pz-border-green-200 hover:pz-bg-green-50"
          >
            <Plus size={16} className="pz-me-1" />
            Add
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAdjust(false)}
            disabled={loading}
            className="pz-flex-1 pz-text-red-600 pz-border-red-200 hover:pz-bg-red-50"
          >
            <Minus size={16} className="pz-me-1" />
            Deduct
          </Button>
        </div>
      </div>

      {/* History Toggle */}
      <button
        onClick={loadHistory}
        className="pz-w-full pz-mt-4 pz-pt-4 pz-border-t pz-text-sm pz-text-gray-500 hover:pz-text-gray-700 pz-flex pz-items-center pz-justify-center pz-gap-2"
      >
        {loadingHistory ? (
          <Loader2 size={14} className="pz-animate-spin" />
        ) : (
          <History size={14} />
        )}
        {showHistory ? 'Hide History' : 'View History'}
      </button>

      {/* History List */}
      {showHistory && history.length > 0 && (
        <div className="pz-mt-4 pz-space-y-2 pz-max-h-64 pz-overflow-y-auto">
          {history.map((tx) => (
            <div
              key={tx.id}
              className="pz-flex pz-items-center pz-justify-between pz-text-sm pz-bg-gray-50 pz-rounded-lg pz-px-3 pz-py-2"
            >
              <div>
                <p className="pz-font-medium">{tx.description || transactionTypeLabels[tx.type]}</p>
                <p className="pz-text-xs pz-text-gray-500">
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`pz-font-semibold ${tx.points > 0 ? 'pz-text-green-600' : 'pz-text-red-600'}`}>
                {tx.points > 0 ? '+' : ''}{tx.points}
              </span>
            </div>
          ))}
        </div>
      )}

      {showHistory && history.length === 0 && (
        <p className="pz-text-center pz-text-sm pz-text-gray-400 pz-mt-4">
          No transaction history
        </p>
      )}
    </div>
  );
}
