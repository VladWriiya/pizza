'use client';

import { StaffMember } from '@/app/[locale]/actions/staff';
import { RoleSelect } from './RoleSelect';
import { ChefHat, Bike, Shield, User, Package, Truck } from 'lucide-react';
import { UserRole } from '@prisma/client';

interface StaffTableProps {
  users: StaffMember[];
  currentUserId: number;
}

const roleIcons: Record<UserRole, React.ReactNode> = {
  ADMIN: <Shield size={16} className="pz-text-purple-600" />,
  KITCHEN: <ChefHat size={16} className="pz-text-orange-600" />,
  COURIER: <Bike size={16} className="pz-text-green-600" />,
  USER: <User size={16} className="pz-text-gray-600" />,
};

const roleBgColors: Record<UserRole, string> = {
  ADMIN: 'pz-bg-purple-100',
  KITCHEN: 'pz-bg-orange-100',
  COURIER: 'pz-bg-green-100',
  USER: 'pz-bg-gray-100',
};

export function StaffTable({ users, currentUserId }: StaffTableProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="pz-overflow-x-auto">
      <table className="pz-w-full">
        <thead>
          <tr className="pz-border-b pz-border-gray-200">
            <th className="pz-text-start pz-py-3 pz-px-4 pz-font-semibold pz-text-gray-600">User</th>
            <th className="pz-text-start pz-py-3 pz-px-4 pz-font-semibold pz-text-gray-600">Role</th>
            <th className="pz-text-start pz-py-3 pz-px-4 pz-font-semibold pz-text-gray-600">Stats</th>
            <th className="pz-text-start pz-py-3 pz-px-4 pz-font-semibold pz-text-gray-600">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            return (
              <tr
                key={user.id}
                className={`pz-border-b pz-border-gray-100 hover:pz-bg-gray-50 ${isCurrentUser ? 'pz-bg-purple-50' : ''}`}
              >
                <td className="pz-py-3 pz-px-4">
                  <div className="pz-flex pz-items-center pz-gap-3">
                    <div className={`pz-w-10 pz-h-10 pz-rounded-full ${roleBgColors[user.role]} pz-flex pz-items-center pz-justify-center`}>
                      {roleIcons[user.role]}
                    </div>
                    <div>
                      <p className="pz-font-medium pz-text-gray-900">
                        {user.fullName || 'No name'}
                        {isCurrentUser && (
                          <span className="pz-ml-2 pz-text-xs pz-bg-purple-100 pz-text-purple-700 pz-px-2 pz-py-0.5 pz-rounded">
                            You
                          </span>
                        )}
                      </p>
                      <p className="pz-text-sm pz-text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="pz-py-3 pz-px-4">
                  <RoleSelect userId={user.id} currentRole={user.role} disabled={isCurrentUser} />
                </td>
                <td className="pz-py-3 pz-px-4">
                  <div className="pz-flex pz-items-center pz-gap-4 pz-text-sm">
                    <div className="pz-flex pz-items-center pz-gap-1 pz-text-gray-600" title="Orders placed">
                      <Package size={14} />
                      <span>{user._count.orders}</span>
                    </div>
                    {(user.role === 'KITCHEN' || user.role === 'ADMIN') && (
                      <div className="pz-flex pz-items-center pz-gap-1 pz-text-orange-600" title="Orders prepared">
                        <ChefHat size={14} />
                        <span>{user._count.kitchenOrders}</span>
                      </div>
                    )}
                    {(user.role === 'COURIER' || user.role === 'ADMIN') && (
                      <div className="pz-flex pz-items-center pz-gap-1 pz-text-green-600" title="Orders delivered">
                        <Truck size={14} />
                        <span>{user._count.courierOrders}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="pz-py-3 pz-px-4 pz-text-gray-500 pz-text-sm">{formatDate(user.createdAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="pz-text-center pz-py-12 pz-text-gray-500">No users found</div>
      )}
    </div>
  );
}
