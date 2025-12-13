import { PrismaClient, OrderStatus } from '@prisma/client';
import { hashSync } from 'bcrypt';

// Israeli first names
const FIRST_NAMES = [
  'David', 'Sarah', 'Yossi', 'Rachel', 'Moshe', 'Noa', 'Avi', 'Miriam',
  'Daniel', 'Tamar', 'Oren', 'Maya', 'Eli', 'Shira', 'Yonatan', 'Michal',
  'Amir', 'Liat', 'Gal', 'Ayelet', 'Ron', 'Inbar', 'Itay', 'Keren',
  'Noam', 'Sivan', 'Idan', 'Yael', 'Eitan', 'Liron', 'Amit', 'Tali',
  'Ofir', 'Chen', 'Uri', 'Dana', 'Yair', 'Efrat', 'Gilad', 'Hila',
  'Ran', 'Mor', 'Nir', 'Rotem', 'Yuval', 'Lee', 'Tal', 'Shani',
];

// Israeli last names
const LAST_NAMES = [
  'Cohen', 'Levi', 'Mizrachi', 'Peretz', 'Biton', 'Azulay', 'Friedman',
  'Alon', 'Shapiro', 'Ben-David', 'Katz', 'Goldstein', 'Avraham', 'Dahan',
  'Malka', 'Ohayon', 'Hadad', 'Golan', 'Raz', 'Shalom', 'Gabay', 'Mor',
  'Levy', 'Yosef', 'Elkayam', 'Baruch', 'Russo', 'Ohana', 'Ashkenazi', 'Ben-Ami',
];

// Tel Aviv streets
const STREETS = [
  'Rothschild Blvd', 'Dizengoff St', 'Ben Yehuda St', 'Allenby St', 'HaYarkon St',
  'King George St', 'Ibn Gabirol St', 'Shenkin St', 'Nahalat Binyamin St', 'Bograshov St',
  'Frishman St', 'Gordon St', 'Basel St', 'Nordau Blvd', 'Arlozorov St',
  'Kaplan St', 'Weizmann St', 'Jabotinsky St', 'Herzl St', 'Ben Gurion Blvd',
];

// Product cache for order generation - populated from DB
type ProductForOrder = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
};

let cachedProducts: ProductForOrder[] = [];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a date within last N days with peak hour weighting
function generateOrderDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  // 70% chance of peak hours (12-14 or 18-21)
  let hour: number;
  if (Math.random() < 0.7) {
    // Peak hours
    if (Math.random() < 0.4) {
      hour = randomInt(12, 14); // Lunch
    } else {
      hour = randomInt(18, 21); // Dinner
    }
  } else {
    // Off-peak: 10-12 or 15-17 or 22-23
    const offPeak = [10, 11, 15, 16, 17, 22, 23];
    hour = randomElement(offPeak);
  }

  date.setHours(hour, randomInt(0, 59), randomInt(0, 59), 0);
  return date;
}

// Generate order items (1-4 items per order) using real products from DB
function generateOrderItems(): { items: string; totalAmount: number } {
  if (cachedProducts.length === 0) {
    throw new Error('Products must be loaded before generating order items');
  }

  const itemCount = randomInt(1, 4);
  const items: Array<{ id: number; name: string; quantity: number; price: number; imageUrl: string }> = [];
  let totalAmount = 0;
  const usedProductIds = new Set<number>();

  for (let i = 0; i < itemCount; i++) {
    // Avoid duplicate products in same order
    let product: ProductForOrder;
    let attempts = 0;
    do {
      product = randomElement(cachedProducts);
      attempts++;
    } while (usedProductIds.has(product.id) && attempts < 10);

    if (usedProductIds.has(product.id)) continue; // Skip if couldn't find unique product
    usedProductIds.add(product.id);

    const quantity = i === 0 ? 1 : randomInt(1, 2); // First item always 1, others can be 1-2
    const itemTotal = product.price * quantity;
    totalAmount += itemTotal;

    items.push({
      id: product.id,
      name: product.name,
      quantity,
      price: product.price,
      imageUrl: product.imageUrl,
    });
  }

  return { items: JSON.stringify(items), totalAmount };
}

// Generate status history for an order
function generateStatusHistory(status: OrderStatus, createdAt: Date): string {
  const history: Array<{ status: string; timestamp: string }> = [];
  let currentTime = new Date(createdAt);

  history.push({ status: 'PENDING', timestamp: currentTime.toISOString() });

  if (status === OrderStatus.CANCELLED) {
    currentTime = new Date(currentTime.getTime() + randomInt(5, 30) * 60000);
    history.push({ status: 'CANCELLED', timestamp: currentTime.toISOString() });
    return JSON.stringify(history);
  }

  // CONFIRMED
  currentTime = new Date(currentTime.getTime() + randomInt(2, 10) * 60000);
  history.push({ status: 'CONFIRMED', timestamp: currentTime.toISOString() });

  if (status === OrderStatus.CONFIRMED) return JSON.stringify(history);

  // PREPARING
  currentTime = new Date(currentTime.getTime() + randomInt(1, 5) * 60000);
  history.push({ status: 'PREPARING', timestamp: currentTime.toISOString() });

  if (status === OrderStatus.PREPARING) return JSON.stringify(history);

  // READY
  currentTime = new Date(currentTime.getTime() + randomInt(15, 30) * 60000);
  history.push({ status: 'READY', timestamp: currentTime.toISOString() });

  if (status === OrderStatus.READY) return JSON.stringify(history);

  // DELIVERING
  currentTime = new Date(currentTime.getTime() + randomInt(2, 10) * 60000);
  history.push({ status: 'DELIVERING', timestamp: currentTime.toISOString() });

  if (status === OrderStatus.DELIVERING) return JSON.stringify(history);

  // DELIVERED
  currentTime = new Date(currentTime.getTime() + randomInt(15, 45) * 60000);
  history.push({ status: 'DELIVERED', timestamp: currentTime.toISOString() });

  return JSON.stringify(history);
}

export async function seedCustomerUsers(prisma: PrismaClient) {
  console.log('Seeding customer users (50)...');

  const customers = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < 50; i++) {
    const firstName = randomElement(FIRST_NAMES);
    const lastName = randomElement(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;

    // Generate unique email
    let email: string;
    let counter = 0;
    do {
      const suffix = counter > 0 ? counter : '';
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@example.com`;
      counter++;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    customers.push({
      fullName,
      email,
      password: hashSync('123456', 10),
      verified: new Date(Date.now() - randomInt(1, 90) * 24 * 60 * 60 * 1000), // Verified 1-90 days ago
      role: 'USER' as const,
    });
  }

  await prisma.user.createMany({ data: customers });
  console.log('Customer users seeded.');
}

export async function seedHistoricalOrders(prisma: PrismaClient) {
  console.log('Seeding historical orders (200+)...');

  // Load products with prices from ProductItem (for simple products, use Product price)
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true,
      items: {
        select: { price: true },
        take: 1,
        orderBy: { price: 'asc' },
      },
    },
  });

  // Build product cache with prices
  cachedProducts = products
    .filter(p => p.items.length > 0)
    .map(p => ({
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      price: p.items[0].price,
    }));

  if (cachedProducts.length === 0) {
    console.error('No products found with prices. Skipping historical orders.');
    return;
  }

  console.log(`Loaded ${cachedProducts.length} products for order generation.`);

  // Get all customer users (exclude admin, kitchen, courier)
  const customers = await prisma.user.findMany({
    where: { role: 'USER' },
    select: { id: true, fullName: true, email: true },
  });

  if (customers.length === 0) {
    console.error('No customer users found. Skipping historical orders.');
    return;
  }

  const orders = [];

  for (let i = 0; i < 220; i++) {
    const daysAgo = randomInt(0, 30);
    const createdAt = generateOrderDate(daysAgo);

    // Status distribution: 85% DELIVERED, 10% CANCELLED, 5% other active statuses
    let status: OrderStatus;
    const rand = Math.random();
    if (rand < 0.85) {
      status = OrderStatus.DELIVERED;
    } else if (rand < 0.95) {
      status = OrderStatus.CANCELLED;
    } else {
      // Recent orders can be in active states
      if (daysAgo <= 1) {
        status = randomElement([OrderStatus.CONFIRMED, OrderStatus.PREPARING, OrderStatus.READY]);
      } else {
        status = OrderStatus.DELIVERED;
      }
    }

    const customer = randomElement(customers);
    const { items, totalAmount } = generateOrderItems();
    const street = randomElement(STREETS);
    const buildingNum = randomInt(1, 200);
    const phone = `+9725${randomInt(0, 9)}${randomInt(1000000, 9999999)}`;

    orders.push({
      userId: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      phone,
      address: `${street} ${buildingNum}, Tel Aviv`,
      totalAmount,
      status,
      token: `hist-${i}-${Date.now()}`,
      items,
      statusHistory: generateStatusHistory(status, createdAt),
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Batch insert for performance
  await prisma.order.createMany({ data: orders });
  console.log(`Historical orders seeded (${orders.length}).`);
}
