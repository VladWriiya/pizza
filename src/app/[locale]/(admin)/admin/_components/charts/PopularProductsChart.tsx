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
import type { PopularProductData } from '@/app/[locale]/actions/dashboard';

interface PopularProductsChartProps {
  data: PopularProductData[];
}

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

export function PopularProductsChart({ data }: PopularProductsChartProps) {
  // Truncate long names
  const formattedData = data.map((item) => ({
    ...item,
    shortName: item.name.length > 15 ? item.name.slice(0, 15) + '...' : item.name,
  }));

  return (
    <ChartCard title="Top Products">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12 }} stroke="#888" allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="shortName"
            tick={{ fontSize: 11 }}
            stroke="#888"
            width={100}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [value, 'Sold']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {formattedData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
