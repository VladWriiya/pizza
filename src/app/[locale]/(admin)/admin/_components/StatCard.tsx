import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

export const StatCard = ({ title, value }: StatCardProps) => (
  <div className="pz-bg-white pz-p-6 pz-rounded-lg pz-shadow-sm">
    <h3 className="pz-text-sm pz-text-gray-500">{title}</h3>
    <p className="pz-text-3xl pz-font-bold pz-mt-2">{value}</p>
  </div>
);