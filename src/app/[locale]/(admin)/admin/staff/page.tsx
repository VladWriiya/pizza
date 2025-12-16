import { Heading } from '@/shared/Heading';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStaffAction, getStaffStatsAction, type StaffFilters } from '@/app/[locale]/actions/staff';
import { StaffTable } from './_components/StaffTable';
import { StaffSearch } from './_components/StaffSearch';
import { RoleFilter } from './_components/RoleFilter';
import { CreateStaffModal } from './_components/CreateStaffModal';
import { UserRole } from '@prisma/client';
import { Shield, ChefHat, Bike, Users } from 'lucide-react';

interface Props {
  searchParams?: {
    query?: string;
    role?: string;
  };
}

export default async function StaffPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  const filters: StaffFilters = {
    query: searchParams?.query,
    role: (searchParams?.role as UserRole | 'ALL' | 'STAFF') || 'STAFF',
  };

  const [users, stats] = await Promise.all([
    getStaffAction(filters),
    getStaffStatsAction(),
  ]);

  return (
    <div>
      <div className="pz-flex pz-items-center pz-justify-between pz-mb-6">
        <Heading level="1">Staff Management</Heading>
        <CreateStaffModal />
      </div>

      <div className="pz-grid pz-grid-cols-4 pz-gap-4 pz-mb-6">
        <div className="pz-bg-purple-50 pz-rounded-xl pz-p-4 pz-flex pz-items-center pz-gap-3">
          <div className="pz-w-10 pz-h-10 pz-rounded-full pz-bg-purple-100 pz-flex pz-items-center pz-justify-center">
            <Shield size={20} className="pz-text-purple-600" />
          </div>
          <div>
            <p className="pz-text-sm pz-text-purple-600 pz-font-medium">Admins</p>
            <p className="pz-text-2xl pz-font-bold pz-text-purple-700">{stats.admins}</p>
          </div>
        </div>
        <div className="pz-bg-orange-50 pz-rounded-xl pz-p-4 pz-flex pz-items-center pz-gap-3">
          <div className="pz-w-10 pz-h-10 pz-rounded-full pz-bg-orange-100 pz-flex pz-items-center pz-justify-center">
            <ChefHat size={20} className="pz-text-orange-600" />
          </div>
          <div>
            <p className="pz-text-sm pz-text-orange-600 pz-font-medium">Kitchen</p>
            <p className="pz-text-2xl pz-font-bold pz-text-orange-700">{stats.kitchen}</p>
          </div>
        </div>
        <div className="pz-bg-green-50 pz-rounded-xl pz-p-4 pz-flex pz-items-center pz-gap-3">
          <div className="pz-w-10 pz-h-10 pz-rounded-full pz-bg-green-100 pz-flex pz-items-center pz-justify-center">
            <Bike size={20} className="pz-text-green-600" />
          </div>
          <div>
            <p className="pz-text-sm pz-text-green-600 pz-font-medium">Couriers</p>
            <p className="pz-text-2xl pz-font-bold pz-text-green-700">{stats.couriers}</p>
          </div>
        </div>
        <div className="pz-bg-gray-50 pz-rounded-xl pz-p-4 pz-flex pz-items-center pz-gap-3">
          <div className="pz-w-10 pz-h-10 pz-rounded-full pz-bg-gray-200 pz-flex pz-items-center pz-justify-center">
            <Users size={20} className="pz-text-gray-600" />
          </div>
          <div>
            <p className="pz-text-sm pz-text-gray-600 pz-font-medium">Total Users</p>
            <p className="pz-text-2xl pz-font-bold pz-text-gray-700">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-6">
        <div className="pz-flex pz-items-center pz-justify-between pz-mb-6">
          <RoleFilter stats={stats} />
          <StaffSearch />
        </div>

        <StaffTable users={users} currentUserId={Number(session?.user?.id)} />
      </div>
    </div>
  );
}
