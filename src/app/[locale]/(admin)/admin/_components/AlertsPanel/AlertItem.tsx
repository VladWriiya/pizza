'use client';

import { Link } from '@/i18n/navigation';
import { AlertTriangle, Clock, Package, Truck } from 'lucide-react';
import type { DashboardAlert } from './types';

interface AlertItemProps {
  alert: DashboardAlert;
}

const ICON_MAP = {
  ready_no_courier: Truck,
  pending_too_long: Clock,
  large_order: Package,
  emergency_ending: AlertTriangle,
};

const SEVERITY_STYLES = {
  critical: {
    bg: 'pz-bg-red-50',
    border: 'pz-border-red-500',
    iconBg: 'pz-bg-red-500',
    text: 'pz-text-red-800',
    desc: 'pz-text-red-700',
  },
  warning: {
    bg: 'pz-bg-orange-50',
    border: 'pz-border-orange-500',
    iconBg: 'pz-bg-orange-500',
    text: 'pz-text-orange-800',
    desc: 'pz-text-orange-700',
  },
  info: {
    bg: 'pz-bg-yellow-50',
    border: 'pz-border-yellow-500',
    iconBg: 'pz-bg-yellow-500',
    text: 'pz-text-yellow-800',
    desc: 'pz-text-yellow-700',
  },
};

export function AlertItem({ alert }: AlertItemProps) {
  const Icon = ICON_MAP[alert.type];
  const styles = SEVERITY_STYLES[alert.severity];

  return (
    <div className={`pz-flex pz-items-center pz-gap-3 pz-p-3 pz-rounded-lg pz-border ${styles.bg} ${styles.border}`}>
      <div className={`pz-p-2 pz-rounded-lg ${styles.iconBg}`}>
        <Icon className="pz-w-4 pz-h-4 pz-text-white" />
      </div>
      <div className="pz-flex-1 pz-min-w-0">
        <p className={`pz-font-semibold pz-text-sm ${styles.text} pz-truncate`}>{alert.title}</p>
        <p className={`pz-text-xs ${styles.desc} pz-truncate`}>{alert.description}</p>
      </div>
      {alert.actionUrl && (
        <Link
          href={alert.actionUrl}
          className={`pz-text-xs pz-font-medium pz-whitespace-nowrap ${styles.text} hover:pz-underline`}
        >
          {alert.actionLabel || 'View'}
        </Link>
      )}
    </div>
  );
}
