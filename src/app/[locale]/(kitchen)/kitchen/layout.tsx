import React from 'react';
import { Link } from '@/i18n/navigation';
import { Heading } from '@/shared/Heading';
import { ChefHat, LogOut } from 'lucide-react';

const KitchenHeader: React.FC = () => {
  return (
    <header className="pz-bg-orange-600 pz-text-white pz-p-4 pz-shadow-md">
      <div className="pz-flex pz-items-center pz-justify-between pz-max-w-[1800px] pz-mx-auto">
        <div className="pz-flex pz-items-center pz-gap-3">
          <ChefHat size={32} />
          <Heading level="1" className="pz-text-white pz-text-2xl">
            Kitchen Dashboard
          </Heading>
        </div>
        <Link
          href="/"
          className="pz-flex pz-items-center pz-gap-2 pz-bg-orange-700 pz-px-4 pz-py-2 pz-rounded-lg hover:pz-bg-orange-800 pz-transition"
        >
          <LogOut size={20} />
          Exit
        </Link>
      </div>
    </header>
  );
};

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pz-min-h-screen pz-bg-gray-100">
      <KitchenHeader />
      <div className="pz-p-6 pz-max-w-[1800px] pz-mx-auto">
        {children}
      </div>
    </main>
  );
}
