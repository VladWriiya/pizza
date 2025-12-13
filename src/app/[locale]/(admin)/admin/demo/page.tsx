import { Heading } from '@/shared/Heading';
import { DemoPanelClient } from './_components/DemoPanelClient';

export default function DemoPage() {
  return (
    <div>
      <div className="pz-flex pz-items-center pz-gap-3 pz-mb-8">
        <Heading level="1">Demo Mode</Heading>
        <span className="pz-px-3 pz-py-1 pz-bg-purple-100 pz-text-purple-800 pz-rounded-full pz-text-sm pz-font-medium">
          For Presentation
        </span>
      </div>

      <p className="pz-text-gray-600 pz-mb-6">
        Use these scenarios to demonstrate edge case handling during project defense.
        All demo data is isolated, visually marked, and auto-cleaned after 5 minutes.
      </p>

      <DemoPanelClient />
    </div>
  );
}
