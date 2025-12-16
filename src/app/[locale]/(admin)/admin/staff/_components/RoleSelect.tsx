'use client';

import { useState } from 'react';
import { UserRole } from '@prisma/client';
import { updateUserRoleAction } from '@/app/[locale]/actions/staff';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Shield, ChefHat, Bike, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface RoleSelectProps {
  userId: number;
  currentRole: UserRole;
  disabled?: boolean;
}

const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
  { value: 'ADMIN', label: 'Admin', icon: <Shield size={14} className="pz-text-purple-600" /> },
  { value: 'KITCHEN', label: 'Kitchen', icon: <ChefHat size={14} className="pz-text-orange-600" /> },
  { value: 'COURIER', label: 'Courier', icon: <Bike size={14} className="pz-text-green-600" /> },
  { value: 'USER', label: 'User', icon: <User size={14} className="pz-text-gray-600" /> },
];

export function RoleSelect({ userId, currentRole, disabled }: RoleSelectProps) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(currentRole);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  const handleSelectChange = (newRole: UserRole) => {
    if (newRole === role) return;
    setPendingRole(newRole);
  };

  const handleConfirm = async () => {
    if (!pendingRole) return;

    setLoading(true);
    const result = await updateUserRoleAction(userId, pendingRole);
    setLoading(false);

    if (result.success) {
      setRole(pendingRole);
      toast.success('Role updated successfully');
    } else {
      toast.error(result.error || 'Failed to update role');
    }
    setPendingRole(null);
  };

  const handleCancel = () => {
    setPendingRole(null);
  };

  const currentRoleData = roles.find((r) => r.value === role);
  const pendingRoleData = roles.find((r) => r.value === pendingRole);

  return (
    <>
      <Select value={role} onValueChange={handleSelectChange} disabled={disabled || loading}>
        <SelectTrigger className="pz-w-32">
          <SelectValue>
            <span className="pz-flex pz-items-center pz-gap-2">
              {currentRoleData?.icon}
              {loading ? '...' : currentRoleData?.label}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="pz-bg-white pz-border pz-border-gray-200 pz-shadow-lg">
          {roles.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              <span className="pz-flex pz-items-center pz-gap-2">
                {r.icon}
                {r.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <AlertDialog open={pendingRole !== null} onOpenChange={(open) => !open && handleCancel()}>
        <AlertDialogContent className="pz-bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Change user role?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change this user&apos;s role from{' '}
              <span className="pz-font-semibold">{currentRoleData?.label}</span> to{' '}
              <span className="pz-font-semibold">{pendingRoleData?.label}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
