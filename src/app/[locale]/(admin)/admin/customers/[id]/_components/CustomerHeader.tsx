import { User, Mail, Calendar } from 'lucide-react';
import type { CustomerDetail } from '@/app/[locale]/actions/customer';

interface CustomerHeaderProps {
  customer: CustomerDetail;
}

export function CustomerHeader({ customer }: CustomerHeaderProps) {
  return (
    <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-6 pz-mb-6">
      <div className="pz-flex pz-items-start pz-gap-4">
        <div className="pz-w-16 pz-h-16 pz-bg-primary/10 pz-rounded-full pz-flex pz-items-center pz-justify-center">
          <User className="pz-w-8 pz-h-8 pz-text-primary" />
        </div>
        <div>
          <h2 className="pz-text-2xl pz-font-bold pz-text-gray-900">{customer.fullName}</h2>
          <div className="pz-flex pz-items-center pz-gap-4 pz-mt-2 pz-text-gray-600">
            <span className="pz-flex pz-items-center pz-gap-1">
              <Mail className="pz-w-4 pz-h-4" />
              {customer.email}
            </span>
            <span className="pz-flex pz-items-center pz-gap-1">
              <Calendar className="pz-w-4 pz-h-4" />
              Member since {new Date(customer.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
