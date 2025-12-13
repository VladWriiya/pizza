'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateSystemSettingsAction } from '@/features/system-settings';

interface Props {
  openTime: string;
  closeTime: string;
  lastOrderTime: string;
}

export function OperatingHoursForm({ openTime, closeTime, lastOrderTime }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(openTime);
  const [close, setClose] = useState(closeTime);
  const [lastOrder, setLastOrder] = useState(lastOrderTime);

  const hasChanges = open !== openTime || close !== closeTime || lastOrder !== lastOrderTime;

  async function handleSave() {
    setIsLoading(true);
    try {
      const result = await updateSystemSettingsAction({
        openTime: open,
        closeTime: close,
        lastOrderTime: lastOrder,
      });

      if (result.success) {
        toast.success('Operating hours updated');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pz-bg-white pz-border pz-rounded-xl pz-p-6">
      <div className="pz-flex pz-items-center pz-gap-2 pz-mb-4">
        <Clock className="pz-w-5 pz-h-5 pz-text-gray-600" />
        <h3 className="pz-text-lg pz-font-semibold">Operating Hours</h3>
      </div>

      <div className="pz-grid pz-grid-cols-3 pz-gap-4">
        <div>
          <label className="pz-block pz-text-sm pz-text-gray-500 pz-mb-1">Open Time</label>
          <input
            type="time"
            value={open}
            onChange={(e) => setOpen(e.target.value)}
            className="pz-w-full pz-border pz-rounded-lg pz-px-3 pz-py-2"
          />
        </div>
        <div>
          <label className="pz-block pz-text-sm pz-text-gray-500 pz-mb-1">Close Time</label>
          <input
            type="time"
            value={close}
            onChange={(e) => setClose(e.target.value)}
            className="pz-w-full pz-border pz-rounded-lg pz-px-3 pz-py-2"
          />
        </div>
        <div>
          <label className="pz-block pz-text-sm pz-text-gray-500 pz-mb-1">Last Order</label>
          <input
            type="time"
            value={lastOrder}
            onChange={(e) => setLastOrder(e.target.value)}
            className="pz-w-full pz-border pz-rounded-lg pz-px-3 pz-py-2"
          />
        </div>
      </div>

      {hasChanges && (
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="pz-mt-4 pz-flex pz-items-center pz-gap-2 pz-bg-blue-600 pz-text-white pz-px-4 pz-py-2 pz-rounded-lg pz-font-medium hover:pz-bg-blue-700 pz-transition disabled:pz-opacity-50"
        >
          <Save className="pz-w-4 pz-h-4" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  );
}
