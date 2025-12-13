'use client';

import React from 'react';

interface DemoScenarioCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onActivate: () => Promise<void>;
  isLoading: boolean;
  variant?: 'default' | 'warning' | 'danger';
}

export function DemoScenarioCard({
  title,
  description,
  icon,
  buttonText,
  onActivate,
  isLoading,
  variant = 'default',
}: DemoScenarioCardProps) {
  const variantStyles = {
    default: 'pz-bg-blue-50 pz-border-blue-200 hover:pz-bg-blue-100',
    warning: 'pz-bg-yellow-50 pz-border-yellow-200 hover:pz-bg-yellow-100',
    danger: 'pz-bg-red-50 pz-border-red-200 hover:pz-bg-red-100',
  };

  const buttonStyles = {
    default: 'pz-bg-blue-600 hover:pz-bg-blue-700',
    warning: 'pz-bg-yellow-600 hover:pz-bg-yellow-700',
    danger: 'pz-bg-red-600 hover:pz-bg-red-700',
  };

  return (
    <div
      className={`pz-rounded-lg pz-border-2 pz-p-6 pz-transition-colors ${variantStyles[variant]}`}
    >
      <div className="pz-flex pz-items-start pz-gap-4">
        <div className="pz-text-3xl">{icon}</div>
        <div className="pz-flex-1">
          <h3 className="pz-font-semibold pz-text-lg pz-mb-2">{title}</h3>
          <p className="pz-text-sm pz-text-gray-600 pz-mb-4">{description}</p>
          <button
            onClick={onActivate}
            disabled={isLoading}
            className={`pz-px-4 pz-py-2 pz-text-white pz-rounded-md pz-font-medium pz-transition-colors disabled:pz-opacity-50 disabled:pz-cursor-not-allowed ${buttonStyles[variant]}`}
          >
            {isLoading ? 'Loading...' : buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
