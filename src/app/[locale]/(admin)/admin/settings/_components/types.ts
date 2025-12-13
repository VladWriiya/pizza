export interface SystemSettings {
  id: number;
  openTime: string;
  closeTime: string;
  lastOrderTime: string;
  timezone: string;
  emergencyClosureActive: boolean;
  emergencyClosureReason: string | null;
  emergencyClosureMessage: string | null;
  emergencyClosureUntil: Date | null;
  emergencyClosureActivatedBy: number | null;
  emergencyClosureActivatedAt: Date | null;
  maxCartItems: number;
  maxOrdersPerHour: number;
  maxActiveOrders: number;
}
