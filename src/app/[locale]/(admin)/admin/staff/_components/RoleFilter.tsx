'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { Shield, ChefHat, Bike, User, Users } from 'lucide-react';

type FilterValue = UserRole | 'ALL' | 'STAFF';

interface RoleFilterProps {
  stats: {
    admins: number;
    kitchen: number;
    couriers: number;
    users: number;
    total: number;
  };
}

const filters: { value: FilterValue; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'STAFF', label: 'Staff', icon: <Users size={16} />, color: 'pz-bg-blue-500' },
  { value: 'ALL', label: 'All', icon: <Users size={16} />, color: 'pz-bg-gray-500' },
  { value: 'ADMIN', label: 'Admin', icon: <Shield size={16} />, color: 'pz-bg-purple-500' },
  { value: 'KITCHEN', label: 'Kitchen', icon: <ChefHat size={16} />, color: 'pz-bg-orange-500' },
  { value: 'COURIER', label: 'Courier', icon: <Bike size={16} />, color: 'pz-bg-green-500' },
  { value: 'USER', label: 'User', icon: <User size={16} />, color: 'pz-bg-gray-400' },
];

export function RoleFilter({ stats }: RoleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRole = (searchParams.get('role') as FilterValue) || 'STAFF';

  const getCount = (value: FilterValue) => {
    switch (value) {
      case 'ALL':
        return stats.total;
      case 'STAFF':
        return stats.admins + stats.kitchen + stats.couriers;
      case 'ADMIN':
        return stats.admins;
      case 'KITCHEN':
        return stats.kitchen;
      case 'COURIER':
        return stats.couriers;
      case 'USER':
        return stats.users;
    }
  };

  const handleFilter = (value: FilterValue) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'STAFF') {
      params.delete('role');
    } else {
      params.set('role', value);
    }
    router.push(`/admin/staff?${params.toString()}`);
  };

  return (
    <div className="pz-flex pz-gap-2 pz-flex-wrap">
      {filters.map((filter) => {
        const isActive = currentRole === filter.value;
        const count = getCount(filter.value);

        return (
          <button
            key={filter.value}
            onClick={() => handleFilter(filter.value)}
            className={`pz-flex pz-items-center pz-gap-2 pz-px-3 pz-py-1.5 pz-rounded-full pz-text-sm pz-font-medium pz-transition ${
              isActive
                ? `${filter.color} pz-text-white`
                : 'pz-bg-gray-100 pz-text-gray-600 hover:pz-bg-gray-200'
            }`}
          >
            {filter.icon}
            {filter.label}
            <span
              className={`pz-px-1.5 pz-py-0.5 pz-rounded-full pz-text-xs ${
                isActive ? 'pz-bg-white/20' : 'pz-bg-gray-200'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
