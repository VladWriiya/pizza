'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChartCard } from './ChartCard';
import type { PeakHourData } from '@/app/[locale]/actions/analytics.actions';

interface PeakHoursChartProps {
  data: PeakHourData[];
}

// Peak hours are 12-14 and 18-21
const isPeakHour = (hour: number) =>
  (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 21);

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  // Only show working hours (10-23)
  const filteredData = data
    .filter((item) => item.hour >= 10 && item.hour <= 23)
    .map((item) => ({
      ...item,
      displayHour: `${item.hour}:00`,
      isPeak: isPeakHour(item.hour),
    }));

  return (
    <ChartCard title="Orders by Hour">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="displayHour" tick={{ fontSize: 10 }} stroke="#888" />
          <YAxis tick={{ fontSize: 12 }} stroke="#888" allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [value, 'Orders']}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isPeak ? '#f97316' : '#fdba74'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
