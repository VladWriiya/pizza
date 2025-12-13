import { Heading } from '@/shared/Heading';
import { getSystemSettingsAction } from '@/features/system-settings';
import { EmergencyClosurePanel } from './_components/EmergencyClosurePanel';
import { OperatingHoursForm } from './_components/OperatingHoursForm';
import { LimitsForm } from './_components/LimitsForm';

export default async function SettingsPage() {
  const result = await getSystemSettingsAction();

  if (!result.success || !result.settings) {
    return (
      <div className="pz-text-center pz-py-10">
        <p className="pz-text-red-500">Failed to load settings</p>
      </div>
    );
  }

  const { settings } = result;

  return (
    <div>
      <Heading level="1">System Settings</Heading>

      <div className="pz-mt-8 pz-space-y-6">
        <EmergencyClosurePanel settings={settings} />

        <OperatingHoursForm
          openTime={settings.openTime}
          closeTime={settings.closeTime}
          lastOrderTime={settings.lastOrderTime}
        />

        <LimitsForm
          maxCartItems={settings.maxCartItems}
          maxOrdersPerHour={settings.maxOrdersPerHour}
          maxActiveOrders={settings.maxActiveOrders}
        />
      </div>
    </div>
  );
}
