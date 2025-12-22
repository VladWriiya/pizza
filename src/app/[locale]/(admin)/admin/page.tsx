import React from 'react';
import {
  getDashboardStatsAction,
  getDashboardAlertsAction,
  getOrdersWaitingForCourierAction,
} from '../../actions/dashboard';
import {
  getOrdersPerDayAction,
  getPopularProductsAction,
  getPeakHoursAction,
} from '../../actions/analytics.actions';
import { Heading } from '@/shared/Heading';
import { StatCard } from './_components/StatCard';
import { RecentOrders } from './_components/RecentOrders';
import { HighLoadAlert } from './_components/HighLoadAlert';
import { AlertsPanel } from './_components/AlertsPanel/AlertsPanel';
import { OrderStatusBars } from './_components/OrderStatusBars/OrderStatusBars';
import { DashboardClientWrapper } from './_components/DashboardClientWrapper';
import {
  OrdersChart,
  RevenueChart,
  PopularProductsChart,
  PeakHoursChart,
} from './_components/charts';

export default async function DashboardPage() {
  const [stats, alerts, waitingForCourier, ordersPerDay, popularProducts, peakHours] =
    await Promise.all([
      getDashboardStatsAction(),
      getDashboardAlertsAction(),
      getOrdersWaitingForCourierAction(),
      getOrdersPerDayAction(7),
      getPopularProductsAction(5),
      getPeakHoursAction(),
    ]);

  if (!stats) {
    return <div>Failed to load dashboard data.</div>;
  }

  return (
    <DashboardClientWrapper
      alertsCount={alerts.length}
      waitingForCourierOrders={waitingForCourier}
    >
      <Heading level="1">Dashboard</Heading>

      <div className="pz-mt-6">
        <AlertsPanel alerts={alerts} />
      </div>

      <HighLoadAlert activeOrdersCount={stats.activeOrdersCount} />

      <OrderStatusBars ordersByStatus={stats.ordersByStatus} />

      <div className="pz-grid pz-grid-cols-1 md:pz-grid-cols-2 lg:pz-grid-cols-4 pz-gap-6 pz-mt-8">
        <StatCard title="Total Revenue" value={`${stats.totalRevenue} ILS`} />
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Revenue Today" value={`${stats.todaysRevenue} ILS`} />
        <StatCard title="Orders Today" value={stats.todaysOrders} />
      </div>

      {/* Analytics Charts */}
      <div className="pz-grid pz-grid-cols-1 lg:pz-grid-cols-2 pz-gap-6 pz-mt-8">
        <OrdersChart data={ordersPerDay} />
        <RevenueChart data={ordersPerDay} />
        <PopularProductsChart data={popularProducts} />
        <PeakHoursChart data={peakHours} />
      </div>

      <RecentOrders orders={stats.recentOrders} />
    </DashboardClientWrapper>
  );
}
