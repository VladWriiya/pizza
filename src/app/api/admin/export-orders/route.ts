import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '../../../../../prisma/prisma-client';
import { OrderStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') as OrderStatus | 'ALL' | null;
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  // Build where clause
  const where: Record<string, unknown> = {};

  if (status && status !== 'ALL') {
    where.status = status;
  }

  if (from || to) {
    where.createdAt = {};
    if (from) {
      (where.createdAt as Record<string, Date>).gte = new Date(from);
    }
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      (where.createdAt as Record<string, Date>).lte = toDate;
    }
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { email: true, fullName: true },
      },
    },
  });

  // Generate CSV
  const headers = [
    'Order ID',
    'Date',
    'Time',
    'Customer Name',
    'Email',
    'Phone',
    'Address',
    'Items',
    'Total (ILS)',
    'Status',
    'Payment ID',
    'Demo',
  ];

  const rows = orders.map(order => {
    const items = JSON.parse(order.items as string);
    const itemsSummary = items
      .map((item: { quantity: number; name: string }) => `${item.quantity}x ${item.name}`)
      .join('; ');

    const date = new Date(order.createdAt);

    return [
      order.id,
      date.toLocaleDateString('en-GB'),
      date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      order.fullName,
      order.email,
      order.phone,
      `"${order.address.replace(/"/g, '""')}"`, // Escape quotes in address
      `"${itemsSummary.replace(/"/g, '""')}"`,
      order.totalAmount,
      order.status,
      order.paymentId || '',
      order.isDemo ? 'Yes' : 'No',
    ];
  });

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  // Generate filename with date range
  const now = new Date();
  let filename = `orders-${now.toISOString().split('T')[0]}`;
  if (status && status !== 'ALL') {
    filename += `-${status.toLowerCase()}`;
  }
  filename += '.csv';

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
