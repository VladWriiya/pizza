import { Prisma, PrismaClient } from '@prisma/client';
import { categories } from '../data/categories';
import { ingredients } from '../data/ingredients';
import { products } from '../data/products';
import { pizzasData, pizzaVariants } from '../data/pizzas';

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const generateProductItem = ({
  productId,
  pizzaType,
  size,
}: {
  productId: number;
  pizzaType?: number;
  size?: number;
}) => {
  // Price based on size for pizzas
  let price: number;
  if (size === 20) price = randomNumber(35, 45);
  else if (size === 30) price = randomNumber(55, 70);
  else if (size === 40) price = randomNumber(80, 100);
  else price = randomNumber(20, 50); // non-pizza items

  return {
    productId,
    price,
    pizzaType,
    size,
  } as Prisma.ProductItemUncheckedCreateInput;
};

export async function seedProductsAndIngredients(prisma: PrismaClient) {
  console.log('Seeding content...');

  // 1. Create categories
  for (const categoryData of categories) {
    await prisma.category.create({
      data: {
        name: categoryData.name,
        sortIndex: categories.indexOf(categoryData),
        translations: categoryData.translations as Prisma.JsonObject,
      },
    });
  }

  // 2. Create all ingredients (including 5 new ones)
  await prisma.ingredient.createMany({
    data: ingredients.map(({ id, ...rest }) => rest) as any,
  });

  // 3. Create non-pizza products
  for (const productData of products) {
    await prisma.product.create({
      data: {
        name: productData.name,
        imageUrl: productData.imageUrl,
        categoryId: productData.categoryId,
        translations: productData.translations as Prisma.JsonObject,
        description: (productData as any).description as Prisma.JsonObject,
        marketingDescription: (productData as any).marketingDescription as Prisma.JsonObject,
      },
    });
  }

  // 4. Create pizzas with baseIngredients and descriptions
  const createdPizzas: { id: number; pizzaIndex: number }[] = [];

  for (let i = 0; i < pizzasData.length; i++) {
    const pizzaData = pizzasData[i];

    const pizza = await prisma.product.create({
      data: {
        name: pizzaData.name,
        imageUrl: pizzaData.imageUrl,
        categoryId: 1, // pizza category
        translations: pizzaData.translations,
        description: pizzaData.description,
        marketingDescription: pizzaData.marketingDescription,
        // Extra ingredients (for adding to pizza)
        ingredients: {
          connect: pizzaData.ingredientIds.map((id) => ({ id })),
        },
        // Base ingredients (removable by customer)
        baseIngredients: {
          connect: pizzaData.baseIngredientIds.map((id) => ({ id })),
        },
      },
    });

    createdPizzas.push({ id: pizza.id, pizzaIndex: i });
  }

  // 5. Create ProductItems for simple products
  const createdSimpleProducts = await prisma.product.findMany({
    where: { categoryId: { not: 1 } },
  });

  // 6. Create ProductItems for pizzas based on variant configs
  const productItems: Prisma.ProductItemUncheckedCreateInput[] = [];

  for (const config of pizzaVariants) {
    const pizza = createdPizzas.find((p) => p.pizzaIndex === config.pizzaIndex);
    if (!pizza) continue;

    for (const variant of config.variants) {
      productItems.push(
        generateProductItem({
          productId: pizza.id,
          pizzaType: variant.pizzaType,
          size: variant.size,
        })
      );
    }
  }

  // Add simple product items
  for (const product of createdSimpleProducts) {
    productItems.push(generateProductItem({ productId: product.id }));
  }

  await prisma.productItem.createMany({ data: productItems });

  console.log(`Content seeded: ${pizzasData.length} pizzas, ${createdSimpleProducts.length} simple products, ${ingredients.length} ingredients`);
}
