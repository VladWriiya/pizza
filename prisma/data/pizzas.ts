import { Prisma } from '@prisma/client';

/**
 * Pizza Seed Data with baseIngredients
 *
 * baseIngredientIds = removable ingredients (user can toggle off)
 * description = full text including non-removable (sauce, base mozzarella)
 * ingredients = extra ingredients available for purchase
 */

// Ingredient IDs reference (20 ingredients total, no Ham/Garlic)
const ING = {
  CHEESE_BORDER: 1,
  CREAMY_MOZZARELLA: 2,
  CHEDDAR_PARMESAN: 3,
  JALAPENO: 4,
  CHICKEN: 5,
  MUSHROOMS: 6,
  PEPPERONI: 7,
  CHORIZO: 8,
  PICKLES: 9,
  TOMATOES: 10,
  RED_ONION: 11,
  PINEAPPLE: 12,
  ITALIAN_HERBS: 13,
  SWEET_PEPPER: 14,
  FETA: 15,
  MEATBALLS: 16,
  BEEF: 17,
  BEEF_SAUSAGE: 18,
  SHRIMP: 19,
  BLUE_CHEESE: 20,
};

// All available extra ingredients (all 20)
const ALL_EXTRAS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export interface PizzaData {
  name: string;
  imageUrl: string;
  translations: Prisma.JsonObject;
  description: Prisma.JsonObject;
  marketingDescription: Prisma.JsonObject;
  baseIngredientIds: number[];
  ingredientIds: number[];
}

export const pizzasData: PizzaData[] = [
  // ==========================================
  // EXISTING PIZZAS
  // ==========================================
  {
    name: 'Pepperoni Fresh',
    imageUrl: '/products/pizzas/pepperoni-fresh.webp',
    translations: { en: { name: 'Pepperoni Fresh' }, he: { name: 'פפרוני פרש' } },
    description: {
      en: 'tomato sauce, mozzarella',
      he: 'רוטב עגבניות, מוצרלה',
    },
    marketingDescription: {
      en: 'A timeless classic that conquered the world — spicy pepperoni on a pillow of melted mozzarella with fresh tomatoes',
      he: 'קלאסיקה נצחית שכבשה את העולם — פפרוני חריף על מצע מוצרלה נמסה עם עגבניות טריות',
    },
    baseIngredientIds: [ING.PEPPERONI, ING.TOMATOES],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Cheesy',
    imageUrl: '/products/pizzas/cheesy.webp',
    translations: { en: { name: 'Cheesy' }, he: { name: 'גבינתית' } },
    description: {
      en: 'alfredo sauce, mozzarella',
      he: 'רוטב אלפרדו, מוצרלה',
    },
    marketingDescription: {
      en: "A cheese lover's dream — creamy mozzarella meets rich cheddar and aged parmesan in perfect harmony",
      he: "חלום של חובבי גבינות — מוצרלה קרמית פוגשת צ'דר עשיר ופרמזן מיושן בהרמוניה מושלמת",
    },
    baseIngredientIds: [ING.CHEDDAR_PARMESAN],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Chorizo Fresh',
    imageUrl: '/products/pizzas/chorizo-fresh.webp',
    translations: { en: { name: 'Chorizo Fresh' }, he: { name: 'צ׳וריסו פרש' } },
    description: {
      en: 'tomato sauce, mozzarella',
      he: 'רוטב עגבניות, מוצרלה',
    },
    marketingDescription: {
      en: 'Bold Spanish flavors — spicy beef chorizo with sweet peppers on our signature tomato sauce',
      he: "טעמים ספרדיים נועזים — צ'וריסו בקר חריף עם פלפלים מתוקים על רוטב העגבניות שלנו",
    },
    baseIngredientIds: [ING.CHORIZO, ING.SWEET_PEPPER],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Teriyaki',
    imageUrl: '/products/pizzas/teriyaki.avif',
    translations: { en: { name: 'Teriyaki' }, he: { name: 'טריאקי' } },
    description: {
      en: 'alfredo sauce, teriyaki sauce, mozzarella',
      he: 'רוטב אלפרדו, רוטב טריאקי, מוצרלה',
    },
    marketingDescription: {
      en: 'East meets West — tender chicken glazed in sweet teriyaki with caramelized onions and peppers',
      he: 'מזרח פוגש מערב — עוף רך בזיגוג טריאקי מתוק עם בצל מקורמל ופלפלים',
    },
    baseIngredientIds: [ING.CHICKEN, ING.RED_ONION, ING.SWEET_PEPPER],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Four Cheese',
    imageUrl: '/products/pizzas/four-cheese.avif',
    translations: { en: { name: 'Four Cheese' }, he: { name: 'ארבע גבינות' } },
    description: {
      en: 'alfredo sauce, mozzarella',
      he: 'רוטב אלפרדו, מוצרלה',
    },
    marketingDescription: {
      en: 'Four artisan cheeses unite — mozzarella, cheddar, parmesan, and blue cheese create an unforgettable symphony',
      he: "ארבע גבינות איכותיות מתאחדות — מוצרלה, צ'דר, פרמזן וגבינה כחולה יוצרים סימפוניה בלתי נשכחת",
    },
    baseIngredientIds: [ING.CHEDDAR_PARMESAN, ING.BLUE_CHEESE],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Pesto',
    imageUrl: '/products/pizzas/pesto.avif',
    translations: { en: { name: 'Pesto' }, he: { name: 'פסטו' } },
    description: {
      en: 'alfredo sauce, pesto sauce, mozzarella',
      he: 'רוטב אלפרדו, רוטב פסטו, מוצרלה',
    },
    marketingDescription: {
      en: 'Aromatic Italian herbs — generous chicken with fragrant basil pesto, feta cubes, and sun-ripened tomatoes',
      he: 'ארומט של עשבי תיבול איטלקיים — עוף נדיב עם פסטו בזיליקום ריחני, קוביות פטה ועגבניות בשלות',
    },
    baseIngredientIds: [ING.CHICKEN, ING.FETA, ING.TOMATOES],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Julienne',
    imageUrl: '/products/pizzas/julienne.avif',
    translations: { en: { name: 'Julienne' }, he: { name: 'ז׳וליין' } },
    description: {
      en: 'alfredo sauce, mozzarella',
      he: 'רוטב אלפרדו, מוצרלה',
    },
    marketingDescription: {
      en: 'French elegance on Italian dough — chicken and mushrooms in a velvety cream sauce with three cheeses',
      he: 'אלגנטיות צרפתית על בצק איטלקי — עוף ופטריות ברוטב שמנת קטיפתי עם שלוש גבינות',
    },
    baseIngredientIds: [ING.CHEDDAR_PARMESAN, ING.CHICKEN, ING.MUSHROOMS, ING.RED_ONION],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Hawaiian',
    imageUrl: '/products/pizzas/hawaiian.avif',
    translations: { en: { name: 'Hawaiian' }, he: { name: 'הוואית' } },
    description: {
      en: 'alfredo sauce, mozzarella',
      he: 'רוטב אלפרדו, מוצרלה',
    },
    marketingDescription: {
      en: 'Tropical paradise — juicy chicken meets sweet pineapple for a taste of island sunshine',
      he: 'גן עדן טרופי — עוף עסיסי פוגש אננס מתוק לטעם של שמש אקזוטית',
    },
    baseIngredientIds: [ING.CHICKEN, ING.PINEAPPLE],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Margarita',
    imageUrl: '/products/pizzas/margarita.avif',
    translations: { en: { name: 'Margarita' }, he: { name: 'מרגריטה' } },
    description: {
      en: 'tomato sauce, mozzarella',
      he: 'רוטב עגבניות, מוצרלה',
    },
    marketingDescription: {
      en: 'The original queen of pizza — simple, elegant, perfect. Fresh tomatoes, mozzarella, and Italian herbs',
      he: 'מלכת הפיצה המקורית — פשוטה, אלגנטית, מושלמת. עגבניות טריות, מוצרלה ותבלינים איטלקיים',
    },
    baseIngredientIds: [ING.TOMATOES, ING.ITALIAN_HERBS],
    ingredientIds: ALL_EXTRAS,
  },

  // ==========================================
  // NEW PIZZAS
  // ==========================================
  {
    name: 'Garlic Chicken',
    imageUrl: '/products/pizzas/garlic-chicken.avif',
    translations: { en: { name: 'Garlic Chicken' }, he: { name: 'עוף שום' } },
    description: {
      en: 'alfredo sauce, mozzarella',
      he: 'רוטב אלפרדו, מוצרלה',
    },
    marketingDescription: {
      en: 'Aromatic indulgence — tender chicken with roasted garlic and fresh tomatoes on creamy alfredo',
      he: 'פינוק ארומטי — עוף רך עם שום קלוי ועגבניות טריות על אלפרדו קרמי',
    },
    baseIngredientIds: [ING.CHICKEN, ING.TOMATOES],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Double Chicken',
    imageUrl: '/products/pizzas/double-chicken.avif',
    translations: { en: { name: 'Double Chicken' }, he: { name: 'עוף כפול' } },
    description: {
      en: 'alfredo sauce, mozzarella',
      he: 'רוטב אלפרדו, מוצרלה',
    },
    marketingDescription: {
      en: 'For serious chicken lovers — double portion of tender, seasoned chicken on velvety cream sauce',
      he: 'לחובבי עוף רציניים — מנה כפולה של עוף רך ומתובל על רוטב שמנת קטיפתי',
    },
    baseIngredientIds: [ING.CHICKEN],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Shrimp Pesto',
    imageUrl: '/products/pizzas/shrimp-pesto.avif',
    translations: { en: { name: 'Shrimp Pesto' }, he: { name: 'שרימפס פסטו' } },
    description: {
      en: 'tomato sauce, pesto sauce, mozzarella',
      he: 'רוטב עגבניות, רוטב פסטו, מוצרלה',
    },
    marketingDescription: {
      en: 'Mediterranean luxury — succulent shrimp with aromatic pesto, mushrooms, and Italian herbs',
      he: 'יוקרה ים תיכונית — שרימפס עסיסי עם פסטו ארומטי, פטריות ועשבי תיבול איטלקיים',
    },
    baseIngredientIds: [ING.SHRIMP, ING.TOMATOES, ING.MUSHROOMS, ING.ITALIAN_HERBS],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Chill Grill',
    imageUrl: '/products/pizzas/chill-grill.avif',
    translations: { en: { name: 'Chill Grill' }, he: { name: 'צ׳יל גריל' } },
    description: {
      en: 'alfredo sauce, grill sauce, mozzarella',
      he: 'רוטב אלפרדו, רוטב גריל, מוצרלה',
    },
    marketingDescription: {
      en: 'Smoky satisfaction — grilled chicken with tangy pickles, red onion, and our signature grill sauce',
      he: 'סיפוק מעושן — עוף על הגריל עם מלפפונים חמוצים, בצל סגול ורוטב הגריל שלנו',
    },
    baseIngredientIds: [ING.CHICKEN, ING.PICKLES, ING.RED_ONION],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Arriva',
    imageUrl: '/products/pizzas/arriva.avif',
    translations: { en: { name: 'Arriva' }, he: { name: 'אריבה' } },
    description: {
      en: 'burger sauce, ranch sauce, mozzarella',
      he: 'רוטב בורגר, רוטב ראנץ׳, מוצרלה',
    },
    marketingDescription: {
      en: 'Fiesta on a pizza — chicken and chorizo with zesty burger sauce, fresh veggies, and cool ranch',
      he: "פיאסטה על פיצה — עוף וצ'וריסו עם רוטב בורגר, ירקות טריים ורוטב ראנץ' מרענן",
    },
    baseIngredientIds: [ING.CHICKEN, ING.CHORIZO, ING.SWEET_PEPPER, ING.RED_ONION, ING.TOMATOES],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Sweet Chili Shrimp',
    imageUrl: '/products/pizzas/sweet-chili-shrimp.avif',
    translations: { en: { name: 'Sweet Chili Shrimp' }, he: { name: 'שרימפס צ׳ילי מתוק' } },
    description: {
      en: 'alfredo sauce, sweet chili sauce, mozzarella',
      he: 'רוטב אלפרדו, רוטב צ׳ילי מתוק, מוצרלה',
    },
    marketingDescription: {
      en: 'Sweet heat from the sea — plump shrimp with tropical pineapple in an irresistible sweet chili glaze',
      he: "חום מתוק מהים — שרימפס שמנמן עם אננס טרופי בזיגוג צ'ילי מתוק שאי אפשר לעמוד בפניו",
    },
    baseIngredientIds: [ING.SHRIMP, ING.PINEAPPLE, ING.SWEET_PEPPER],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Cheesy Chicken',
    imageUrl: '/products/pizzas/cheesy-chicken.avif',
    translations: { en: { name: 'Cheesy Chicken' }, he: { name: 'עוף גבינתי' } },
    description: {
      en: 'alfredo sauce, cheese sauce, mozzarella',
      he: 'רוטב אלפרדו, רוטב גבינה, מוצרלה',
    },
    marketingDescription: {
      en: 'Ultimate comfort food — double chicken smothered in three melted cheeses with tomatoes',
      he: 'אוכל נוחות אולטימטיבי — עוף כפול מכוסה בשלוש גבינות נמסות עם עגבניות',
    },
    baseIngredientIds: [ING.CHEDDAR_PARMESAN, ING.CHICKEN, ING.TOMATOES],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Diablo',
    imageUrl: '/products/pizzas/diablo.avif',
    translations: { en: { name: 'Diablo' }, he: { name: 'דיאבלו' } },
    description: {
      en: 'tomato sauce, BBQ sauce, mozzarella',
      he: 'רוטב עגבניות, רוטב ברביקיו, מוצרלה',
    },
    marketingDescription: {
      en: 'Dare to try — fiery chorizo and beef with jalapeños, a blazing challenge for heat seekers',
      he: 'אתגר ללוהטים — צ\'וריסו ובקר לוהטים עם חלפיניו, אתגר בוער לאוהבי חריף',
    },
    baseIngredientIds: [ING.CHORIZO, ING.BEEF, ING.JALAPENO, ING.TOMATOES, ING.SWEET_PEPPER, ING.RED_ONION],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Double Pepperoni',
    imageUrl: '/products/pizzas/double-pepperoni.avif',
    translations: { en: { name: 'Double Pepperoni' }, he: { name: 'פפרוני כפול' } },
    description: {
      en: 'tomato sauce, mozzarella',
      he: 'רוטב עגבניות, מוצרלה',
    },
    marketingDescription: {
      en: "Twice the legend — double layer of our signature spicy pepperoni for those who can't get enough",
      he: 'פי שניים מהאגדה — שכבה כפולה של הפפרוני החריף שלנו למי שלא יכול להפסיק',
    },
    baseIngredientIds: [ING.PEPPERONI],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Veggie & Mushrooms',
    imageUrl: '/products/pizzas/veggie-mushrooms.avif',
    translations: { en: { name: 'Veggie & Mushrooms' }, he: { name: 'ירקות ופטריות' } },
    description: {
      en: 'tomato sauce, mozzarella',
      he: 'רוטב עגבניות, מוצרלה',
    },
    marketingDescription: {
      en: 'Garden fresh — earthy mushrooms with colorful peppers, tomatoes, onion, and tangy feta',
      he: 'טריות מהגינה — פטריות עם פלפלים צבעוניים, עגבניות, בצל ופטה חמצמצה',
    },
    baseIngredientIds: [ING.MUSHROOMS, ING.TOMATOES, ING.SWEET_PEPPER, ING.RED_ONION, ING.FETA, ING.ITALIAN_HERBS],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Spicy Sausage',
    imageUrl: '/products/pizzas/spicy-sausage.avif',
    translations: { en: { name: 'Spicy Sausage' }, he: { name: 'נקניקיות חריפות' } },
    description: {
      en: 'tomato sauce, mozzarella',
      he: 'רוטב עגבניות, מוצרלה',
    },
    marketingDescription: {
      en: 'Bold and hearty — chunky beef sausages with red onion on classic tomato sauce',
      he: 'נועז ומשביע — נקניקיות בקר עסיסיות עם בצל סגול על רוטב עגבניות קלאסי',
    },
    baseIngredientIds: [ING.BEEF_SAUSAGE, ING.RED_ONION],
    ingredientIds: ALL_EXTRAS,
  },
  {
    name: 'Pepperoni Classic',
    imageUrl: '/products/pizzas/pepperoni-classic.avif',
    translations: { en: { name: 'Pepperoni Classic' }, he: { name: 'פפרוני קלאסי' } },
    description: {
      en: 'tomato sauce, mozzarella',
      he: 'רוטב עגבניות, מוצרלה',
    },
    marketingDescription: {
      en: 'Pure simplicity — just pepperoni and mozzarella the way it was meant to be',
      he: 'פשטות טהורה — רק פפרוני ומוצרלה כמו שזה צריך להיות',
    },
    baseIngredientIds: [ING.PEPPERONI],
    ingredientIds: ALL_EXTRAS,
  },
];

// Pizza variant configurations
export interface PizzaVariantConfig {
  pizzaIndex: number;
  variants: { pizzaType: number; size: number }[];
}

export const pizzaVariants: PizzaVariantConfig[] = [
  // Pepperoni Fresh - all variants
  { pizzaIndex: 0, variants: [{ pizzaType: 1, size: 20 }, { pizzaType: 2, size: 30 }, { pizzaType: 2, size: 40 }] },
  // Cheesy - all variants
  { pizzaIndex: 1, variants: [{ pizzaType: 1, size: 20 }, { pizzaType: 1, size: 30 }, { pizzaType: 1, size: 40 }, { pizzaType: 2, size: 20 }, { pizzaType: 2, size: 30 }, { pizzaType: 2, size: 40 }] },
  // Chorizo Fresh
  { pizzaIndex: 2, variants: [{ pizzaType: 1, size: 20 }, { pizzaType: 2, size: 30 }, { pizzaType: 2, size: 40 }] },
  // Teriyaki
  { pizzaIndex: 3, variants: [{ pizzaType: 1, size: 20 }, { pizzaType: 2, size: 20 }, { pizzaType: 2, size: 30 }, { pizzaType: 2, size: 40 }] },
  // Four Cheese - all variants
  { pizzaIndex: 4, variants: [{ pizzaType: 1, size: 20 }, { pizzaType: 1, size: 30 }, { pizzaType: 1, size: 40 }, { pizzaType: 2, size: 20 }, { pizzaType: 2, size: 30 }, { pizzaType: 2, size: 40 }] },
  // Pesto - thin only
  { pizzaIndex: 5, variants: [{ pizzaType: 2, size: 20 }, { pizzaType: 2, size: 30 }, { pizzaType: 2, size: 40 }] },
  // Julienne - medium and large only
  { pizzaIndex: 6, variants: [{ pizzaType: 1, size: 30 }, { pizzaType: 1, size: 40 }, { pizzaType: 2, size: 30 }, { pizzaType: 2, size: 40 }] },
  // Hawaiian - traditional only
  { pizzaIndex: 7, variants: [{ pizzaType: 1, size: 20 }, { pizzaType: 1, size: 30 }, { pizzaType: 1, size: 40 }] },
  // Margarita - all variants
  { pizzaIndex: 8, variants: [{ pizzaType: 1, size: 20 }, { pizzaType: 1, size: 30 }, { pizzaType: 1, size: 40 }, { pizzaType: 2, size: 20 }, { pizzaType: 2, size: 30 }, { pizzaType: 2, size: 40 }] },
  // New pizzas (9-20) - all get full variants
  ...Array.from({ length: 12 }, (_, i) => ({
    pizzaIndex: 9 + i,
    variants: [
      { pizzaType: 1, size: 20 }, { pizzaType: 1, size: 30 }, { pizzaType: 1, size: 40 },
      { pizzaType: 2, size: 20 }, { pizzaType: 2, size: 30 }, { pizzaType: 2, size: 40 },
    ],
  })),
];
