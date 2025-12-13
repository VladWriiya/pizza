'use client';

import { AlertTriangle } from 'lucide-react';

const CLOSURE_REASONS = [
  'Equipment failure',
  'Staff shortage',
  'Weather emergency',
  'Power outage',
  'Health & Safety',
  'Other',
];

interface Props {
  reason: string;
  setReason: (v: string) => void;
  message: string;
  setMessage: (v: string) => void;
  until: string;
  setUntil: (v: string) => void;
  confirmed: boolean;
  setConfirmed: (v: boolean) => void;
  isLoading: boolean;
  onActivate: () => void;
  onCancel: () => void;
}

export function EmergencyActivateForm({
  reason, setReason,
  message, setMessage,
  until, setUntil,
  confirmed, setConfirmed,
  isLoading,
  onActivate,
  onCancel,
}: Props) {
  const isValid = reason && message && confirmed;

  return (
    <div className="pz-bg-orange-50 pz-border-2 pz-border-orange-400 pz-rounded-xl pz-p-6">
      <h3 className="pz-text-xl pz-font-bold pz-text-orange-700 pz-mb-4">
        Activate Emergency Closure
      </h3>

      <div className="pz-space-y-4">
        <div>
          <label className="pz-block pz-text-sm pz-font-medium pz-mb-1">Reason *</label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="pz-w-full pz-border pz-rounded-lg pz-px-3 pz-py-2"
          >
            <option value="">Select reason...</option>
            {CLOSURE_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="pz-block pz-text-sm pz-font-medium pz-mb-1">Message to customers *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="We are temporarily closed due to..."
            className="pz-w-full pz-border pz-rounded-lg pz-px-3 pz-py-2 pz-min-h-[80px]"
          />
        </div>

        <div>
          <label className="pz-block pz-text-sm pz-font-medium pz-mb-1">Expected reopening (optional)</label>
          <input
            type="datetime-local"
            value={until}
            onChange={(e) => setUntil(e.target.value)}
            className="pz-w-full pz-border pz-rounded-lg pz-px-3 pz-py-2"
          />
        </div>

        <div className="pz-flex pz-items-start pz-gap-2 pz-bg-red-100 pz-p-3 pz-rounded-lg">
          <input
            type="checkbox"
            id="confirm"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="pz-mt-1"
          />
          <label htmlFor="confirm" className="pz-text-sm pz-text-red-700">
            I understand this will <strong>block ALL new orders</strong> until deactivated.
          </label>
        </div>

        <div className="pz-flex pz-gap-3">
          <button
            onClick={onActivate}
            disabled={isLoading || !isValid}
            className="pz-flex pz-items-center pz-gap-2 pz-bg-red-600 pz-text-white pz-px-6 pz-py-3 pz-rounded-lg pz-font-medium hover:pz-bg-red-700 pz-transition disabled:pz-opacity-50"
          >
            <AlertTriangle className="pz-w-5 pz-h-5" />
            {isLoading ? 'Activating...' : 'Activate Emergency Closure'}
          </button>
          <button
            onClick={onCancel}
            className="pz-px-6 pz-py-3 pz-border pz-rounded-lg hover:pz-bg-gray-50 pz-transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
