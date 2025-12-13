import React from 'react';

export function DemoInfoBox() {
  return (
    <div className="pz-bg-blue-50 pz-border-2 pz-border-blue-200 pz-rounded-lg pz-p-4">
      <h4 className="pz-font-semibold pz-text-blue-800 pz-mb-2">About Demo Mode</h4>
      <ul className="pz-text-sm pz-text-blue-700 pz-space-y-1">
        <li>- All demo data is marked with [DEMO] prefix and purple badges</li>
        <li>- Demo data auto-expires after 5 minutes</li>
        <li>- Demo orders are excluded from real statistics</li>
        <li>- Use &quot;Reset All Demo Data&quot; for instant cleanup</li>
      </ul>
    </div>
  );
}
