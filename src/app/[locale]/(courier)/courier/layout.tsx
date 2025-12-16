import React from 'react';
import { Link } from '@/i18n/navigation';
import { Heading } from '@/shared/Heading';
import { Bike, LogOut } from 'lucide-react';

const CourierHeader: React.FC = () => {
  return (
    <header className="pz-bg-emerald-600 pz-text-white pz-p-3 sm:pz-p-4 pz-shadow-md">
      <div className="pz-flex pz-items-center pz-justify-between pz-max-w-[800px] pz-mx-auto">
        <div className="pz-flex pz-items-center pz-gap-2 sm:pz-gap-3">
          <Bike size={28} className="sm:pz-w-8 sm:pz-h-8" />
          <Heading level="1" className="pz-text-white pz-text-lg sm:pz-text-2xl">
            Courier
          </Heading>
        </div>
        <Link
          href="/"
          className="pz-flex pz-items-center pz-gap-1.5 sm:pz-gap-2 pz-bg-emerald-700 pz-px-3 sm:pz-px-4 pz-py-2 pz-rounded-lg hover:pz-bg-emerald-800 pz-transition pz-text-sm sm:pz-text-base"
        >
          <LogOut size={18} />
          <span className="pz-hidden sm:pz-inline">Exit</span>
        </Link>
      </div>
    </header>
  );
};

export default function CourierLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pz-min-h-screen pz-bg-gray-100">
      <CourierHeader />
      <div className="pz-p-3 sm:pz-p-4 pz-max-w-[800px] pz-mx-auto">
        {children}
      </div>
    </main>
  );
}
