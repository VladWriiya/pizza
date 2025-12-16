import React from 'react';
import { Pizza } from 'lucide-react';

interface EmptyFilterResultsProps {
  message: string;
}

export const EmptyFilterResults = ({ message }: EmptyFilterResultsProps) => {
  return (
    <div className="pz-flex pz-flex-col pz-items-center pz-justify-center pz-py-16">
      <div className="pz-w-28 pz-h-28 pz-rounded-full pz-bg-orange-100 pz-flex pz-items-center pz-justify-center pz-mb-5">
        <Pizza className="pz-w-14 pz-h-14 pz-text-orange-400" />
      </div>
      <p className="pz-text-center pz-text-orange-600 pz-text-lg pz-font-medium">{message}</p>
    </div>
  );
};
