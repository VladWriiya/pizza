import React from 'react';
import { prisma } from '../../../../../../prisma/prisma-client';
import { Heading } from '@/shared/Heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Check, X } from 'lucide-react';
import { DeleteCouponButton } from './_components/DeleteCouponButton';
import { EditCouponDialog } from './_components/EditCouponDialog';
import { CouponForm } from './_components/CouponForm';


export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <Heading level="1">Coupons ({coupons.length})</Heading>
      <div className="pz-mt-8 pz-grid pz-grid-cols-3 pz-gap-8">
        <div className="pz-col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="pz-text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="pz-font-mono">{coupon.code}</TableCell>
                  <TableCell>
                    {coupon.discount}
                    {coupon.discountType === 'PERCENTAGE' ? '%' : ' ILS'}
                  </TableCell>
                  <TableCell>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : '—'}</TableCell>
                  <TableCell>
                    {coupon.isActive ? <Check className="pz-text-green-500" /> : <X className="pz-text-red-500" />}
                  </TableCell>
                  <TableCell className="pz-text-right pz-space-x-2">
                    <EditCouponDialog coupon={coupon} />
                    <DeleteCouponButton couponId={coupon.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <CouponForm />
        </div>
      </div>
    </div>
  );
}