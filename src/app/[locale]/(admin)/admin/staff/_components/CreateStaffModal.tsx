'use client';

import { useState } from 'react';
import { UserRole } from '@prisma/client';
import { createStaffAction } from '@/app/[locale]/actions/staff';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { UserPlus, Shield, ChefHat, Bike } from 'lucide-react';
import toast from 'react-hot-toast';

const staffRoles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
  { value: 'ADMIN', label: 'Admin', icon: <Shield size={16} /> },
  { value: 'KITCHEN', label: 'Kitchen', icon: <ChefHat size={16} /> },
  { value: 'COURIER', label: 'Courier', icon: <Bike size={16} /> },
];

export function CreateStaffModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'KITCHEN' as UserRole,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    const result = await createStaffAction(formData);
    setLoading(false);

    if (result.success) {
      toast.success('Staff member created successfully');
      setOpen(false);
      setFormData({ fullName: '', email: '', password: '', role: 'KITCHEN' });
    } else {
      toast.error(result.error || 'Failed to create staff member');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="pz-flex pz-items-center pz-gap-2">
          <UserPlus size={18} />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="pz-bg-white pz-max-w-md">
        <DialogHeader>
          <DialogTitle>Create Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="pz-space-y-4 pz-mt-4">
          <div>
            <label className="pz-block pz-text-sm pz-font-medium pz-text-gray-700 pz-mb-1">
              Full Name
            </label>
            <Input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="pz-block pz-text-sm pz-font-medium pz-text-gray-700 pz-mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="pz-block pz-text-sm pz-font-medium pz-text-gray-700 pz-mb-1">
              Password
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="pz-block pz-text-sm pz-font-medium pz-text-gray-700 pz-mb-1">
              Role
            </label>
            <Select
              value={formData.role}
              onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}
            >
              <SelectTrigger className="pz-w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="pz-bg-white pz-border pz-shadow-lg">
                {staffRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    <span className="pz-flex pz-items-center pz-gap-2">
                      {role.icon}
                      {role.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pz-flex pz-gap-3 pz-pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="pz-flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="pz-flex-1">
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
