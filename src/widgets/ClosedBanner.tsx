import { isRestaurantOpenAction } from '@/features/system-settings';
import { Clock } from 'lucide-react';

export async function ClosedBanner() {
  const status = await isRestaurantOpenAction();

  // Don't show if open or if emergency (EmergencyBanner handles that)
  if (status.isOpen || status.reason === 'emergency') {
    return null;
  }

  return (
    <div className="pz-bg-amber-500 pz-text-white pz-py-3 pz-px-4">
      <div className="pz-container pz-mx-auto pz-flex pz-items-center pz-justify-center pz-gap-3 pz-text-center">
        <Clock className="pz-w-5 pz-h-5 pz-flex-shrink-0" />
        <div>
          <span className="pz-font-semibold">{status.message}</span>
          <span className="pz-ms-2 pz-opacity-90">
            — You can browse our menu, but ordering is currently unavailable
          </span>
        </div>
      </div>
    </div>
  );
}
