import React from 'react';
import { Link } from '@/i18n/navigation';
import { Heading } from '@/shared/Heading';
import { Bike, LogOut } from 'lucide-react';

const CourierHeader: React.FC = () => {
  return (
    <header className="pz-bg-emerald-600 pz-text-white pz-p-4 pz-shadow-md">
      <div className="pz-flex pz-items-center pz-justify-between pz-max-w-[800px] pz-mx-auto">
        <div className="pz-flex pz-items-center pz-gap-3">
          <Bike size={32} />
          <Heading level="1" className="pz-text-white pz-text-2xl">
            Courier Dashboard
          </Heading>
        </div>
        <Link
          href="/"
          className="pz-flex pz-items-center pz-gap-2 pz-bg-emerald-700 pz-px-4 pz-py-2 pz-rounded-lg hover:pz-bg-emerald-800 pz-transition"
        >
          <LogOut size={20} />
          Exit
        </Link>
      </div>
    </header>
  );
};

export default function CourierLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pz-min-h-screen pz-bg-gray-100">
      <CourierHeader />
      <div className="pz-p-4 pz-max-w-[800px] pz-mx-auto">
        {children}
      </div>
    </main>
  );
}
