'use client';

import { useState } from 'react';
import { Phone, User, MapPin } from 'lucide-react';

interface CustomerDetailsProps {
  fullName: string;
  phone: string;
  address: string;
}

export function CustomerDetails({ fullName, phone, address }: CustomerDetailsProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="pz-px-4 pz-pb-2">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="pz-text-sm pz-text-blue-600 hover:pz-underline"
      >
        {showDetails ? 'Hide details' : 'Show customer details'}
      </button>
      {showDetails && (
        <div className="pz-mt-2 pz-space-y-1 pz-text-sm pz-text-gray-600">
          <div className="pz-flex pz-items-center pz-gap-2">
            <User size={14} />
            <span>{fullName}</span>
          </div>
          <div className="pz-flex pz-items-center pz-gap-2">
            <Phone size={14} />
            <a href={`tel:${phone}`} className="pz-text-blue-600 hover:pz-underline">
              {phone}
            </a>
          </div>
          <div className="pz-flex pz-items-center pz-gap-2">
            <MapPin size={14} />
            <span>{address}</span>
          </div>
        </div>
      )}
    </div>
  );
}
