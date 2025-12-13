'use client';

import { AlertTriangle, Power, Clock } from 'lucide-react';
import { SystemSettings } from './types';

interface Props {
  settings: SystemSettings;
  isLoading: boolean;
  onDeactivate: () => void;
  onExtend: (minutes: number) => void;
}

export function EmergencyActiveCard({ settings, isLoading, onDeactivate, onExtend }: Props) {
  return (
    <div className="pz-bg-red-50 pz-border-2 pz-border-red-500 pz-rounded-xl pz-p-6">
      <div className="pz-flex pz-items-center pz-gap-3 pz-mb-4">
        <div className="pz-bg-red-500 pz-p-2 pz-rounded-lg">
          <AlertTriangle className="pz-w-6 pz-h-6 pz-text-white" />
        </div>
        <div>
          <h3 className="pz-text-xl pz-font-bold pz-text-red-700">Emergency Closure ACTIVE</h3>
          <p className="pz-text-red-600">All new orders are blocked</p>
        </div>
      </div>

      <div className="pz-space-y-2 pz-mb-6 pz-text-sm">
        <p><strong>Reason:</strong> {settings.emergencyClosureReason}</p>
        <p><strong>Message:</strong> {settings.emergencyClosureMessage}</p>
        {settings.emergencyClosureUntil && (
          <p><strong>Expected reopening:</strong> {new Date(settings.emergencyClosureUntil).toLocaleString()}</p>
        )}
        {settings.emergencyClosureActivatedAt && (
          <p><strong>Activated at:</strong> {new Date(settings.emergencyClosureActivatedAt).toLocaleString()}</p>
        )}
      </div>

      <div className="pz-flex pz-gap-3">
        <button
          onClick={() => onExtend(30)}
          disabled={isLoading}
          className="pz-flex pz-items-center pz-gap-2 pz-bg-blue-600 pz-text-white pz-px-4 pz-py-3 pz-rounded-lg pz-font-medium hover:pz-bg-blue-700 pz-transition disabled:pz-opacity-50"
        >
          <Clock className="pz-w-5 pz-h-5" />
          {isLoading ? '...' : 'Extend +30 min'}
        </button>
        <button
          onClick={onDeactivate}
          disabled={isLoading}
          className="pz-flex pz-items-center pz-gap-2 pz-bg-green-600 pz-text-white pz-px-6 pz-py-3 pz-rounded-lg pz-font-medium hover:pz-bg-green-700 pz-transition disabled:pz-opacity-50"
        >
          <Power className="pz-w-5 pz-h-5" />
          {isLoading ? 'Processing...' : 'Deactivate - Reopen'}
        </button>
      </div>
    </div>
  );
}
