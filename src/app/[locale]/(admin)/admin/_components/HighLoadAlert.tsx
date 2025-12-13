'use client';

import { useTransition } from 'react';
import { Flame, Power } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { activateEmergencyClosureAction } from '@/features/system-settings';
import toast from 'react-hot-toast';

interface Props {
  activeOrdersCount: number;
  threshold?: number;
}

export function HighLoadAlert({ activeOrdersCount, threshold = 30 }: Props) {
  const [isPending, startTransition] = useTransition();

  // Only show when load is high
  if (activeOrdersCount < threshold) {
    return null;
  }

  const handleEmergencyClose = () => {
    startTransition(async () => {
      const result = await activateEmergencyClosureAction({
        reason: 'High Load',
        message: 'We are experiencing high demand. Please try again later.',
        until: new Date(Date.now() + 30 * 60 * 1000), // 30 min
      });
      if (result.success) {
        toast.success('Order intake paused');
      } else {
        toast.error(result.error || 'Failed to close');
      }
    });
  };

  const severity = activeOrdersCount >= 100 ? 'critical' : 'warning';
  const bgColor = severity === 'critical' ? 'pz-bg-red-50 pz-border-red-500' : 'pz-bg-orange-50 pz-border-orange-500';
  const iconBg = severity === 'critical' ? 'pz-bg-red-500' : 'pz-bg-orange-500';
  const textColor = severity === 'critical' ? 'pz-text-red-800' : 'pz-text-orange-800';
  const subTextColor = severity === 'critical' ? 'pz-text-red-700' : 'pz-text-orange-700';

  return (
    <div className={`${bgColor} pz-border-2 pz-rounded-xl pz-p-4 pz-mb-6`}>
      <div className="pz-flex pz-items-start pz-gap-3">
        <div className={`${iconBg} pz-p-2 pz-rounded-lg pz-shrink-0`}>
          <Flame className="pz-w-5 pz-h-5 pz-text-white" />
        </div>
        <div className="pz-flex-1">
          <h3 className={`pz-font-bold ${textColor}`}>
            {severity === 'critical' ? 'Critical Load!' : 'High Load Warning'}
          </h3>
          <p className={`pz-text-sm ${subTextColor} pz-mt-1`}>
            {activeOrdersCount} active orders in the system.
            {severity === 'critical' && ' Consider pausing order intake.'}
          </p>
        </div>
      </div>

      <div className="pz-mt-4 pz-ps-11">
        <Button
          onClick={handleEmergencyClose}
          disabled={isPending}
          variant="destructive"
        >
          <Power className="pz-w-4 pz-h-4 pz-me-2" />
          {isPending ? 'Closing...' : 'Pause Order Intake'}
        </Button>
      </div>
    </div>
  );
}
