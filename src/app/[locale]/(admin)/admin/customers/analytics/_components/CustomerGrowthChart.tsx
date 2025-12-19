'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface CustomerGrowthChartProps {
  data: { month: string; newCustomers: number; returningCustomers: number }[];
}

export function CustomerGrowthChart({ data }: CustomerGrowthChartProps) {
  return (
    <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-6">
      <h3 className="pz-text-lg pz-font-semibold pz-text-gray-800 pz-mb-4">
        Customer Growth (Last 6 Months)
      </h3>
      <div className="pz-h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#888" />
            <YAxis tick={{ fontSize: 12 }} stroke="#888" allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar
              dataKey="newCustomers"
              name="New Customers"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="returningCustomers"
              name="Returning"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
