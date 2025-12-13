'use server';


import { hashSync } from 'bcrypt';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prisma-client';

export async function registerUser(body: Omit<Prisma.UserCreateInput, 'verified'>) {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (user) {
    throw new Error('User with this email already exists.');
  }

  const createdUser = await prisma.user.create({
    data: {
      fullName: body.fullName,
      email: body.email,
      password: hashSync(body.password, 10),
      verified: new Date(),
    },
  });

  return createdUser;
}
