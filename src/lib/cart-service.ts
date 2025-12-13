
import { cookies } from 'next/headers';
import { prisma } from '../../prisma/prisma-client';

export async function mergeGuestCartWithUser(userId: number) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('cartToken')?.value;

  if (!cartToken) {
    return;
  }

  const guestCart = await prisma.cart.findFirst({
    where: { token: cartToken },
    include: {
      items: true,
    },
  });

  if (!guestCart) {
    return;
  }

  const userCart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!userCart) {
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: { userId },
    });

    cookieStore.delete('cartToken');
  } else {
    if (guestCart.items.length > 0) {
      await prisma.cartItem.updateMany({
        where: { cartId: guestCart.id },
        data: { cartId: userCart.id },
      });
    }

    await prisma.cart.delete({
      where: { id: guestCart.id },
    });

    cookieStore.delete('cartToken');
  }
}
