import { getSystemSettingsAction } from '@/features/system-settings';
import { AlertTriangle } from 'lucide-react';

export async function EmergencyBanner() {
  const result = await getSystemSettingsAction();

  if (!result.success || !result.settings?.emergencyClosureActive) {
    return null;
  }

  const { emergencyClosureMessage, emergencyClosureUntil, emergencyClosureReason } = result.settings;
  const isDemo = emergencyClosureReason?.startsWith('DEMO:');

  return (
    <div className={`pz-text-white pz-py-3 pz-px-4 ${isDemo ? 'pz-bg-purple-600' : 'pz-bg-red-600'}`}>
      <div className="pz-container pz-mx-auto pz-flex pz-items-center pz-justify-center pz-gap-3 pz-text-center">
        <AlertTriangle className="pz-w-5 pz-h-5 pz-flex-shrink-0" />
        <div>
          {isDemo && (
            <span className="pz-px-2 pz-py-0.5 pz-bg-white pz-text-purple-800 pz-rounded pz-text-xs pz-font-bold pz-me-2">
              DEMO
            </span>
          )}
          <span className="pz-font-semibold">Temporarily Closed</span>
          {emergencyClosureMessage && (
            <span className="pz-mx-2">—</span>
          )}
          {emergencyClosureMessage && (
            <span>{emergencyClosureMessage}</span>
          )}
          {emergencyClosureUntil && (
            <span className="pz-ms-2 pz-opacity-90">
              (Expected reopening: {new Date(emergencyClosureUntil).toLocaleString()})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
