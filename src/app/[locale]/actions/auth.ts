'use server';

import { hashSync } from 'bcrypt';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prisma-client';
// import { sendVerificationEmailAction } from './email-verification';

export async function registerUser(body: Omit<Prisma.UserCreateInput, 'verified'>) {
  const existingUser = await prisma.user.findUnique({
    where: { email: body.email.toLowerCase().trim() },
  });

  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const createdUser = await prisma.user.create({
    data: {
      fullName: body.fullName,
      email: body.email.toLowerCase().trim(),
      password: hashSync(body.password, 10),
      // Note: For demo purposes, we auto-verify. In production, remove this line
      // and uncomment sendVerificationEmailAction below
      verified: new Date(),
    },
  });

  // In production, send verification email:
  // await sendVerificationEmailAction(createdUser.id);

  return createdUser;
}
