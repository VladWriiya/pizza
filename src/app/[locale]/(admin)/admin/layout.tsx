import React from 'react';
import { Link } from '@/i18n/navigation';
import { Heading } from '@/shared/Heading';


const AdminSidebar: React.FC = () => {
  return (
    <aside className="pz-w-[280px] pz-h-screen pz-bg-gray-100 pz-p-6">
      <Heading level="2" className="pz-mb-8">
        Admin Panel
      </Heading>
      <nav>
        <ul className="pz-space-y-4">
          <li>
            <Link href="/admin" className="pz-font-bold hover:pz-text-primary pz-transition">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className="pz-font-bold hover:pz-text-primary pz-transition">
              Products
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="pz-font-bold hover:pz-text-primary pz-transition">
              Orders
            </Link>
          </li>
          <li>
            <Link href="/admin/customers" className="pz-font-bold hover:pz-text-primary pz-transition">
              Customers
            </Link>
          </li>
          <li>
            <Link href="/admin/staff" className="pz-font-bold hover:pz-text-primary pz-transition">
              Staff
            </Link>
          </li>
          <li>
            <Link href="/admin/categories" className="pz-font-bold hover:pz-text-primary pz-transition">
              Categories
            </Link>
          </li>
          <li>
            <Link href="/admin/ingredients" className="pz-font-bold hover:pz-text-primary pz-transition">
              Ingredients
            </Link>
          </li>
          <li>
            <Link href="/admin/coupons" className="pz-font-bold hover:pz-text-primary pz-transition">
              Coupons
            </Link>
          </li>
          <li>
            <Link href="/admin/promos" className="pz-font-bold hover:pz-text-primary pz-transition">
              Promo Cards
            </Link>
          </li>
          <li>
            <Link href="/admin/settings" className="pz-font-bold hover:pz-text-primary pz-transition">
              Settings
            </Link>
          </li>
          <li>
            <Link href="/admin/demo" className="pz-font-bold hover:pz-text-primary pz-transition pz-flex pz-items-center pz-gap-2">
              Demo Mode
              <span className="pz-px-2 pz-py-0.5 pz-bg-purple-100 pz-text-purple-800 pz-rounded pz-text-xs">
                NEW
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pz-min-h-screen">
      <div className="pz-flex">
        <AdminSidebar />
        <div className="pz-flex-1 pz-p-10">{children}</div>
      </div>
    </main>
  );
}
