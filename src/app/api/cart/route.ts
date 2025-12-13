
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getOrCreateCart, updateCartTotals } from '../../../lib/cart-utils';
import { prisma } from '../../../../prisma/prisma-client';

interface AddToCartPayload {
  productItemId: number;
  ingredients?: number[];
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('cartToken')?.value;
    if (!token) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    const cart = await prisma.cart.findFirst({
      where: { token },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
          include: {
            productItem: { include: { product: true } },
            ingredients: true,
          },
        },
      },
    });

    return NextResponse.json(cart);
  } catch (error) {
    console.error('[CART_GET] Server error:', error);
    return NextResponse.json({ message: 'Failed to get cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get('cartToken')?.value;

    if (!token) {
      token = crypto.randomUUID();
    }

    const cart = await getOrCreateCart(token);

    const data = (await req.json()) as AddToCartPayload;

    const sortedIngredientIds = data.ingredients?.sort((a: number, b: number) => a - b) || [];
    
    const candidates = await prisma.cartItem.findMany({
        where: {
            cartId: cart.id,
            productItemId: data.productItemId,
        },
        include: {
            ingredients: {
                select: { id: true }
            }
        }
    });

    const findCartItemFinal = candidates.find(item => {
        const itemIngredientIds = item.ingredients.map((ing) => ing.id).sort((a: number, b: number) => a - b);

        if (itemIngredientIds.length !== sortedIngredientIds.length) {
            return false;
        }

        return itemIngredientIds.every((id: number, index: number) => id === sortedIngredientIds[index]);
    });

    if (findCartItemFinal) {
      await prisma.cartItem.update({
        where: { id: findCartItemFinal.id, },
        data: { quantity: { increment: 1 }, },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productItemId: data.productItemId,
          quantity: 1,
          ingredients: { connect: sortedIngredientIds.map((id: number) => ({ id })) },
        },
      });
    }

    const updatedCart = await updateCartTotals(token);

    const resp = NextResponse.json(updatedCart);
    resp.cookies.set('cartToken', token);
    return resp;
    
  } catch (error) {
    console.error('[CART_POST] Server error:', error);
    return NextResponse.json({ message: 'Failed to create cart item' }, { status: 500 });
  }
}