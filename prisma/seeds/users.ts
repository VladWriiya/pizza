import { hashSync } from 'bcrypt';
import { PrismaClient } from '@prisma/client';



export async function seedUsers(prisma: PrismaClient) {
  console.log('Seeding users...');
  await prisma.user.createMany({
    data: [
      {
        fullName: 'User Test',
        email: 'user@test.ru',
        password: hashSync('123456', 10),
        verified: new Date(),
        role: 'USER',
      },
      {
        fullName: 'Admin Admin',
        email: 'admin@test.ru',
        password: hashSync('123456', 10),
        verified: new Date(),
        role: 'ADMIN',
      },
      {
        fullName: 'Kitchen Staff',
        email: 'kitchen@test.ru',
        password: hashSync('123456', 10),
        verified: new Date(),
        role: 'KITCHEN',
      },
      {
        fullName: 'Courier Driver',
        email: 'courier@test.ru',
        password: hashSync('123456', 10),
        verified: new Date(),
        role: 'COURIER',
      },
    ],
  });
  console.log('Users seeded.');
}