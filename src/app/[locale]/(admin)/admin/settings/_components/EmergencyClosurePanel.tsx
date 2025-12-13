'use client';

import { PowerOff } from 'lucide-react';
import { useEmergencyClosure } from './useEmergencyClosure';
import { EmergencyActiveCard } from './EmergencyActiveCard';
import { EmergencyActivateForm } from './EmergencyActivateForm';
import { SystemSettings } from './types';

interface EmergencyClosurePanelProps {
  settings: SystemSettings;
}

export function EmergencyClosurePanel({ settings }: EmergencyClosurePanelProps) {
  const {
    isLoading,
    showForm,
    setShowForm,
    reason, setReason,
    message, setMessage,
    until, setUntil,
    confirmed, setConfirmed,
    handleActivate,
    handleDeactivate,
    handleExtend,
  } = useEmergencyClosure();

  if (settings.emergencyClosureActive) {
    return (
      <EmergencyActiveCard
        settings={settings}
        isLoading={isLoading}
        onDeactivate={handleDeactivate}
        onExtend={handleExtend}
      />
    );
  }

  if (showForm) {
    return (
      <EmergencyActivateForm
        reason={reason}
        setReason={setReason}
        message={message}
        setMessage={setMessage}
        until={until}
        setUntil={setUntil}
        confirmed={confirmed}
        setConfirmed={setConfirmed}
        isLoading={isLoading}
        onActivate={handleActivate}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="pz-bg-gray-50 pz-border pz-rounded-xl pz-p-6">
      <div className="pz-flex pz-items-center pz-justify-between">
        <div>
          <h3 className="pz-text-lg pz-font-semibold">Emergency Closure</h3>
          <p className="pz-text-gray-600 pz-text-sm">Block all new orders in case of emergency</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="pz-flex pz-items-center pz-gap-2 pz-bg-red-600 pz-text-white pz-px-4 pz-py-2 pz-rounded-lg pz-font-medium hover:pz-bg-red-700 pz-transition"
        >
          <PowerOff className="pz-w-4 pz-h-4" />
          Activate
        </button>
      </div>
    </div>
  );
}
