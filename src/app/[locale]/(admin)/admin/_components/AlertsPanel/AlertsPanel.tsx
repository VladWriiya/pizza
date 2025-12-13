import { Bell, CheckCircle } from 'lucide-react';
import { AlertItem } from './AlertItem';
import type { DashboardAlert } from './types';

interface AlertsPanelProps {
  alerts: DashboardAlert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="pz-bg-green-50 pz-border pz-border-green-200 pz-rounded-lg pz-p-4 pz-flex pz-items-center pz-gap-3">
        <CheckCircle className="pz-w-5 pz-h-5 pz-text-green-600" />
        <span className="pz-text-green-800 pz-font-medium">All clear — no issues requiring attention</span>
      </div>
    );
  }

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;

  return (
    <div className="pz-bg-white pz-rounded-lg pz-shadow-sm pz-p-4 pz-mb-6">
      <div className="pz-flex pz-items-center pz-justify-between pz-mb-4">
        <div className="pz-flex pz-items-center pz-gap-2">
          <Bell className="pz-w-5 pz-h-5 pz-text-gray-600" />
          <h2 className="pz-font-semibold pz-text-lg">Requires Attention</h2>
          <span className="pz-bg-gray-200 pz-text-gray-700 pz-px-2 pz-py-0.5 pz-rounded-full pz-text-sm pz-font-medium">
            {alerts.length}
          </span>
        </div>
        <div className="pz-flex pz-gap-2">
          {criticalCount > 0 && (
            <span className="pz-bg-red-100 pz-text-red-700 pz-px-2 pz-py-0.5 pz-rounded pz-text-xs pz-font-medium">
              {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="pz-bg-orange-100 pz-text-orange-700 pz-px-2 pz-py-0.5 pz-rounded pz-text-xs pz-font-medium">
              {warningCount} warning
            </span>
          )}
        </div>
      </div>
      <div className="pz-space-y-2 pz-max-h-64 pz-overflow-y-auto">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}
