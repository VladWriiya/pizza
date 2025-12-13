import { PrismaClient, OrderStatus } from '@prisma/client';

export async function seedCartsAndOrders(prisma: PrismaClient) {
  console.log('Seeding carts and orders...');

  const userTest = await prisma.user.findUnique({ where: { email: 'user@test.ru' } });
  const adminTest = await prisma.user.findUnique({ where: { email: 'admin@test.ru' } });
  const kitchenUser = await prisma.user.findUnique({ where: { email: 'kitchen@test.ru' } });
  const courierUser = await prisma.user.findUnique({ where: { email: 'courier@test.ru' } });

  if (!userTest || !adminTest) {
    console.error("Test users not found. Skipping seeding of carts and orders.");
    return;
  }

  // Create carts
  await prisma.cart.createMany({
    data: [
      { userId: userTest.id, totalAmount: 0, token: '123' },
      { userId: adminTest.id, totalAmount: 0, token: '1234' },
    ],
  });

  await prisma.cartItem.create({
    data: {
      productItemId: 1,
      cartId: 1,
      quantity: 2,
      ingredients: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      },
    },
  });

  // ============ ORDERS FOR KITCHEN/COURIER TESTING ============
  // Using REAL products from the store

  // CONFIRMED orders (visible in Kitchen "New Orders" column)
  await prisma.order.create({
    data: {
      userId: userTest.id,
      fullName: 'David Cohen',
      email: 'david@test.ru',
      phone: '+972501234567',
      address: 'Rothschild Blvd 45, Tel Aviv',
      totalAmount: 189,
      status: OrderStatus.CONFIRMED,
      token: 'kitchen-new-1',
      items: JSON.stringify([
        { name: 'Pepperoni fresh', quantity: 1, price: 79, details: '30cm, Traditional' },
        { name: 'Banana Milkshake', quantity: 2, price: 55 },
      ]),
      statusHistory: JSON.stringify([
        { status: 'PENDING', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 12 * 60000).toISOString() },
      ]),
    },
  });

  await prisma.order.create({
    data: {
      userId: userTest.id,
      fullName: 'Sarah Levi',
      email: 'sarah@test.ru',
      phone: '+972521234567',
      address: 'Dizengoff St 120, Tel Aviv',
      totalAmount: 245,
      status: OrderStatus.CONFIRMED,
      token: 'kitchen-new-2',
      items: JSON.stringify([
        { name: 'Margarita', quantity: 2, price: 158, details: '40cm, Thin' },
        { name: 'Chicken Nuggets', quantity: 1, price: 35 },
        { name: 'Classic Milkshake 👶', quantity: 2, price: 52 },
      ]),
      statusHistory: JSON.stringify([
        { status: 'PENDING', timestamp: new Date(Date.now() - 8 * 60000).toISOString() },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
      ]),
    },
  });

  await prisma.order.create({
    data: {
      fullName: 'Michael Brown',
      email: 'michael@test.ru',
      phone: '+972531234567',
      address: 'Ben Yehuda St 78, Tel Aviv',
      totalAmount: 156,
      status: OrderStatus.CONFIRMED,
      token: 'kitchen-new-3',
      items: JSON.stringify([
        { name: 'Hawaiian', quantity: 1, price: 99, details: '30cm, Traditional' },
        { name: 'Oven baked potatoes with sauce 🌱', quantity: 1, price: 57 },
      ]),
      statusHistory: JSON.stringify([
        { status: 'PENDING', timestamp: new Date(Date.now() - 3 * 60000).toISOString() },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 1 * 60000).toISOString() },
      ]),
    },
  });

  // PREPARING orders (visible in Kitchen "Preparing" column)
  await prisma.order.create({
    data: {
      userId: adminTest.id,
      fullName: 'Anna Katz',
      email: 'anna@test.ru',
      phone: '+972541234567',
      address: 'Allenby St 55, Tel Aviv',
      totalAmount: 312,
      status: OrderStatus.PREPARING,
      token: 'kitchen-prep-1',
      kitchenUserId: kitchenUser?.id,
      prepStartedAt: new Date(Date.now() - 10 * 60000),
      prepEstimatedMinutes: 25,
      items: JSON.stringify([
        { name: 'Four Cheese', quantity: 2, price: 218, details: '40cm, Traditional' },
        { name: 'Caesar Salad', quantity: 1, price: 45 },
        { name: 'Caramel Apple Milkshake', quantity: 2, price: 49 },
      ]),
      statusHistory: JSON.stringify([
        { status: 'PENDING', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 22 * 60000).toISOString() },
        { status: 'PREPARING', timestamp: new Date(Date.now() - 10 * 60000).toISOString(), userId: kitchenUser?.id },
      ]),
      comment: 'Extra cheese please! No onions.',
    },
  });

  await prisma.order.create({
    data: {
      fullName: 'Tom Wilson',
      email: 'tom@test.ru',
      phone: '+972551234567',
      address: 'HaYarkon St 200, Tel Aviv',
      totalAmount: 178,
      status: OrderStatus.PREPARING,
      token: 'kitchen-prep-2',
      kitchenUserId: kitchenUser?.id,
      prepStartedAt: new Date(Date.now() - 18 * 60000),
      prepEstimatedMinutes: 20,
      items: JSON.stringify([
        { name: 'Teriyaki', quantity: 1, price: 109, details: '30cm, Thin' },
        { name: 'Dodster', quantity: 1, price: 42 },
        { name: 'Oreo Cookie Milkshake', quantity: 1, price: 27 },
      ]),
      statusHistory: JSON.stringify([
        { status: 'PENDING', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 28 * 60000).toISOString() },
        { status: 'PREPARING', timestamp: new Date(Date.now() - 18 * 60000).toISOString(), userId: kitchenUser?.id },
      ]),
    },
  });

  // READY orders (visible in Kitchen "Ready" + Courier "Available")
  await prisma.order.create({
    data: {
      userId: userTest.id,
      fullName: 'Emma Davis',
      email: 'emma@test.ru',
      phone: '+972561234567',
      address: 'King George St 30, Tel Aviv',
      totalAmount: 267,
      status: OrderStatus.READY,
      token: 'courier-ready-1',
      kitchenUserId: kitchenUser?.id,
      prepStartedAt: new Date(Date.now() - 35 * 60000),
      prepEstimatedMinutes: 25,
      items: JSON.stringify([
        { name: 'Pesto', quantity: 1, price: 119, details: '40cm, Thin' },
        { name: 'Vegetable Mix Salad', quantity: 2, price: 98 },
        { name: 'Americano coffee', quantity: 2, price: 50 },
      ]),
      statusHistory: JSON.stringify([
        { status: 'PENDING', timestamp: new Date(Date.now() - 50 * 60000).toISOString() },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 48 * 60000).toISOString() },
        { status: 'PREPARING', timestamp: new Date(Date.now() - 35 * 60000).toISOString() },
        { status: 'READY', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
      ]),
    },
  });

  await prisma.order.create({
    data: {
      fullName: 'Daniel Green',
      email: 'daniel@test.ru',
      phone: '+972571234567',
      address: 'Ibn Gabirol St 85, Tel Aviv',
      totalAmount: 145,
      status: OrderStatus.READY,
      token: 'courier-ready-2',
      kitchenUserId: kitchenUser?.id,
      prepStartedAt: new Date(Date.now() - 40 * 60000),
      prepEstimatedMinutes: 20,
      items: JSON.stringify([
        { name: 'Julienne', quantity: 1, price: 89, details: '30cm, Traditional' },
        { name: 'Danwich ham and cheese', quantity: 1, price: 32 },
        { name: 'Irish Cappuccino', quantity: 1, price: 24 },
      ]),
      statusHistory: JSON.stringify([
        { status: 'PENDING', timestamp: new Date(Date.now() - 55 * 60000).toISOString() },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 52 * 60000).toISOString() },
        { status: 'PREPARING', timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
        { status: 'READY', timestamp: new Date(Date.now() - 8 * 60000).toISOString() },
      ]),
      comment: 'Please ring doorbell twice',
    },
  });

  await prisma.order.create({
    data: {
      fullName: 'Rachel Gold',
      email: 'rachel@test.ru',
      phone: '+972581234567',
      address: 'Shenkin St 15, Tel Aviv',
      totalAmount: 198,
      status: OrderStatus.READY,
      token: 'courier-ready-3',
      kitchenUserId: kitchenUser?.id,
      prepStartedAt: new Date(Date.now() - 30 * 60000),
      prepEstimatedMinutes: 22,
      items: JSON.stringify([
        { name: 'Choriso fresh', quantity: 1, price: 129, details: '30cm, Traditional' },
        { name: 'Spicy Dodster 🌶️🌶️', quantity: 1, price: 38 },
        { name: 'Coffee Latte', quantity: 1, price: 31 },
      ]),
      statusHistory: JSON.stringify([
        { status: 'PENDING', timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 42 * 60000).toISOString() },
        { status: 'PREPARING', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
        { status: 'READY', timestamp: new Date(Date.now() - 2 * 60000).toISOString() },
      ]),
    },
  });

  // DELIVERING order (visible in Courier "My Active Deliveries")
  await prisma.order.create({
    data: {
      userId: userTest.id,
      fullName: 'Jake Miller',
      email: 'jake@test.ru',
      phone: '+972591234567',
      address: 'Nahalat Binyamin St 42, Tel Aviv',
      totalAmount: 289,
      status: OrderStatus.DELIVERING,
      token: 'courier-delivering-1',
      kitchenUserId: kitchenUser?.id,
      prepStartedAt: new Date(Date.now() - 60 * 60000),
      prepEstimatedMinutes: 25,
      courierUserId: courierUser?.id,
      deliveryStartedAt: new Date(Date.now() - 15 * 60000),
      deliveryEstimatedMinutes: 30,
      items: JSON.stringify([
        { name: 'Cheesy', quantity: 1, price: 139, details: '40cm, Traditional' },
        { name: 'Chicken Nuggets', quantity: 1, price: 65 },
        { name: 'Pasta Carbonara', quantity: 1, price: 45 },
        { name: 'Coffee Coconut Latte', quantity: 2, price: 40 },
      ]),
      statusHistory: JSON.stringify([
        { status: 'PENDING', timestamp: new Date(Date.now() - 75 * 60000).toISOString() },
        { status: 'CONFIRMED', timestamp: new Date(Date.now() - 72 * 60000).toISOString() },
        { status: 'PREPARING', timestamp: new Date(Date.now() - 60 * 60000).toISOString() },
        { status: 'READY', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
        { status: 'DELIVERING', timestamp: new Date(Date.now() - 15 * 60000).toISOString(), userId: courierUser?.id },
      ]),
      comment: 'Apartment 5B, code: 1234',
    },
  });

  // ============ LEGACY ORDERS (history) ============
  await prisma.order.createMany({
    data: [
      {
        userId: userTest.id,
        fullName: 'User Test',
        email: 'user@test.ru',
        phone: '+111111',
        address: '1 Main St',
        totalAmount: 430,
        status: OrderStatus.DELIVERED,
        token: 'token1',
        items: JSON.stringify([
          { name: 'Pepperoni fresh', quantity: 1, price: 250 },
          { name: 'Chicken Nuggets', quantity: 2, price: 90 },
        ]),
      },
      {
        userId: adminTest.id,
        fullName: 'Admin Admin',
        email: 'admin@test.ru',
        phone: '+222222',
        address: '2 Admin Ave',
        totalAmount: 420,
        status: OrderStatus.DELIVERED,
        token: 'token3',
        items: JSON.stringify([
          { name: 'Choriso fresh', quantity: 1, price: 220 },
          { name: 'Coffee Latte', quantity: 10, price: 20 },
        ]),
      },
      {
        fullName: 'Guest One',
        email: 'guest1@test.ru',
        phone: '+333333',
        address: '3 Guest Blvd',
        totalAmount: 80,
        status: OrderStatus.CANCELLED,
        token: 'token4',
        items: JSON.stringify([
          { name: 'Irish Cappuccino', quantity: 2, price: 40 },
        ]),
      },
    ],
  });

  console.log('Carts and orders seeded.');
}