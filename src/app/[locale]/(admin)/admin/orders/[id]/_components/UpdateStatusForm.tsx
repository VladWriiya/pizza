'use client';

import { updateOrderStatusAction } from '@/app/[locale]/actions/order';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { OrderStatus } from '@prisma/client';
import React, { useState, useTransition } from 'react';
import toast from 'react-hot-toast';

interface Props {
  orderId: number;
  currentStatus: OrderStatus;
}

export const UpdateStatusForm: React.FC<Props> = ({ orderId, currentStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, selectedStatus);
      if (result.success) {
        toast.success('Status updated!');
      } else {
        toast.error('Failed to update status.');
      }
    });
  };

  return (
    <div className="pz-flex pz-items-center pz-gap-4 pz-mt-4">
      <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as OrderStatus)}>
        <SelectTrigger className="pz-w-[200px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(OrderStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onSave} disabled={isPending || selectedStatus === currentStatus}>
        Save Status
      </Button>
    </div>
  );
};