'use client';

import React from 'react';

interface ActionResult {
  type: 'success' | 'error';
  message: string;
}

interface DemoResultBannerProps {
  result: ActionResult | null;
  onClear: () => void;
}

export function DemoResultBanner({ result, onClear }: DemoResultBannerProps) {
  if (!result) return null;

  const isSuccess = result.type === 'success';

  return (
    <div
      className={`pz-p-4 pz-rounded-lg pz-border-2 ${
        isSuccess
          ? 'pz-bg-green-50 pz-border-green-300 pz-text-green-800'
          : 'pz-bg-red-50 pz-border-red-300 pz-text-red-800'
      }`}
    >
      <div className="pz-flex pz-items-center pz-justify-between">
        <span>{result.message}</span>
        <button
          onClick={onClear}
          className="pz-text-gray-500 hover:pz-text-gray-700"
        >
          x
        </button>
      </div>
    </div>
  );
}
