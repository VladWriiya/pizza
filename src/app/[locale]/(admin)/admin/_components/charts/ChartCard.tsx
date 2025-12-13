'use client';

import type { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-6">
      <h3 className="pz-text-lg pz-font-semibold pz-text-gray-800 pz-mb-4">{title}</h3>
      <div className="pz-h-64">{children}</div>
    </div>
  );
}
