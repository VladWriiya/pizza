export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertType =
  | 'ready_no_courier'
  | 'pending_too_long'
  | 'large_order'
  | 'emergency_ending';

export interface DashboardAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  description: string;
  orderId?: number;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: Date;
}
