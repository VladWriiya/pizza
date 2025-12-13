export const products = [
  // ==========================================
  // DINNER (categoryId: 2) — Omelettes, Pasta, Salads
  // ==========================================
  {
    name: 'Omelette with pepperoni',
    imageUrl: '/products/dinner/omelette-pepperoni.avif',
    categoryId: 2,
    translations: {
      en: { name: 'Omelette with pepperoni' },
      he: { name: 'חביתה עם פפרוני' },
    },
    marketingDescription: {
      en: 'Fluffy eggs meet spicy pepperoni — a protein-packed breakfast that means business',
      he: 'ביצים אווריריות פוגשות פפרוני חריף — ארוחת בוקר עשירה בחלבון שמתחילה את היום נכון',
    },
    description: {
      en: 'Eggs, pepperoni, mozzarella, herbs',
      he: 'ביצים, פפרוני, מוצרלה, עשבי תיבול',
    },
  },
  {
    name: 'Omelette with tomatoes',
    imageUrl: '/products/dinner/omelette-tomatoes.avif',
    categoryId: 2,
    translations: {
      en: { name: 'Omelette with tomatoes' },
      he: { name: 'חביתה עם עגבניות' },
    },
    marketingDescription: {
      en: 'Garden-fresh tomatoes folded into golden eggs — simple, wholesome, delicious',
      he: 'עגבניות טריות מהגינה עטופות בביצים זהובות — פשוט, בריא, טעים',
    },
    description: {
      en: 'Eggs, fresh tomatoes, herbs, olive oil',
      he: 'ביצים, עגבניות טריות, עשבי תיבול, שמן זית',
    },
  },
  {
    name: 'Pasta Pesto',
    imageUrl: '/products/dinner/pasta-pesto.avif',
    categoryId: 2,
    translations: {
      en: { name: 'Pasta Pesto' },
      he: { name: 'פסטה פסטו' },
    },
    marketingDescription: {
      en: 'Al dente pasta tossed in aromatic basil pesto — a taste of Italian summers',
      he: 'פסטה אל-דנטה ברוטב פסטו בזיליקום ארומטי — טעם של קיץ איטלקי',
    },
    description: {
      en: 'Penne pasta, basil pesto, parmesan, pine nuts, olive oil',
      he: 'פסטה פנה, פסטו בזיליקום, פרמזן, צנוברים, שמן זית',
    },
  },
  {
    name: 'Pasta Carbonara',
    imageUrl: '/products/dinner/pasta-carbonara.avif',
    categoryId: 2,
    translations: {
      en: { name: 'Pasta Carbonara' },
      he: { name: 'פסטה קרבונרה' },
    },
    marketingDescription: {
      en: 'Creamy Roman classic — silky egg sauce with crispy bits in every bite',
      he: 'קלאסיקה רומאית קרמית — רוטב ביצים משיי עם פריכות בכל ביס',
    },
    description: {
      en: 'Penne pasta, cream sauce, egg yolk, parmesan, black pepper',
      he: 'פסטה פנה, רוטב שמנת, חלמון ביצה, פרמזן, פלפל שחור',
    },
  },
  {
    name: 'Vegetable Mix Salad',
    imageUrl: '/products/dinner/vegetable-mix-salad.avif',
    categoryId: 2,
    translations: {
      en: { name: 'Vegetable Mix Salad' },
      he: { name: 'סלט ירקות מיקס' },
    },
    marketingDescription: {
      en: 'Rainbow of fresh vegetables — crisp, colorful, and bursting with vitamins',
      he: 'קשת של ירקות טריים — פריכים, צבעוניים ומלאי ויטמינים',
    },
    description: {
      en: 'Lettuce, tomatoes, cucumbers, peppers, carrots, olive oil dressing',
      he: 'חסה, עגבניות, מלפפונים, פלפלים, גזר, רוטב שמן זית',
    },
  },
  {
    name: 'Caesar Salad',
    imageUrl: '/products/dinner/caesar-salad.avif',
    categoryId: 2,
    translations: {
      en: { name: 'Caesar Salad' },
      he: { name: 'סלט קיסר' },
    },
    marketingDescription: {
      en: 'The legendary salad — crisp romaine, shaved parmesan, and our secret Caesar dressing',
      he: 'הסלט האגדי — חסה רומית פריכה, פרמזן מגורר ורוטב הקיסר הסודי שלנו',
    },
    description: {
      en: 'Romaine lettuce, parmesan, croutons, Caesar dressing, chicken',
      he: 'חסה רומית, פרמזן, קרוטונים, רוטב קיסר, עוף',
    },
  },

  // ==========================================
  // SNACKS (categoryId: 3)
  // ==========================================
  {
    name: 'Danwich ham and cheese',
    imageUrl: '/products/snacks/danwich.webp',
    categoryId: 3,
    translations: {
      en: { name: 'Danwich ham and cheese' },
      he: { name: "דנוויץ' עם בשר וגבינה" },
    },
    marketingDescription: {
      en: 'Hot-pressed perfection — melted cheese and savory meat in a crispy golden wrap',
      he: 'שלמות לחוצה בחום — גבינה נמסה ובשר עסיסי בעטיפה פריכה וזהובה',
    },
    description: {
      en: 'Flatbread, ham, mozzarella, sauce',
      he: 'לחם שטוח, בשר, מוצרלה, רוטב',
    },
  },
  {
    name: 'Chicken Nuggets',
    imageUrl: '/products/snacks/chicken-nuggets.avif',
    categoryId: 3,
    translations: {
      en: { name: 'Chicken Nuggets' },
      he: { name: 'נאגטס עוף' },
    },
    marketingDescription: {
      en: 'Crispy on the outside, tender on the inside — dip into your favorite sauce',
      he: 'פריכים מבחוץ, רכים מבפנים — לטבול ברוטב האהוב עליכם',
    },
    description: {
      en: 'Chicken breast, crispy breading, served with sauce',
      he: 'חזה עוף, ציפוי פריך, מוגש עם רוטב',
    },
  },
  {
    name: 'Oven baked potatoes with sauce 🌱',
    imageUrl: '/products/snacks/baked-potatoes.webp',
    categoryId: 3,
    translations: {
      en: { name: 'Oven baked potatoes with sauce 🌱' },
      he: { name: 'תפוחי אדמה אפויים בתנור עם רוטב 🌱' },
    },
    marketingDescription: {
      en: 'Golden wedges baked to perfection — crispy edges, fluffy centers, 100% plant-based',
      he: 'קציצות זהובות אפויות לשלמות — קצוות פריכים, פנים רכים, 100% טבעוני',
    },
    description: {
      en: 'Potatoes, herbs, spices, dipping sauce',
      he: 'תפוחי אדמה, עשבי תיבול, תבלינים, רוטב לטבילה',
    },
  },
  {
    name: 'Dodster',
    imageUrl: '/products/snacks/dodster.webp',
    categoryId: 3,
    translations: {
      en: { name: 'Dodster' },
      he: { name: 'דודסטר' },
    },
    marketingDescription: {
      en: 'Our signature wrap — warm tortilla stuffed with chicken, veggies, and secret sauce',
      he: 'הראפ המיוחד שלנו — טורטייה חמה במילוי עוף, ירקות והרוטב הסודי',
    },
    description: {
      en: 'Tortilla, chicken, tomatoes, lettuce, signature sauce',
      he: 'טורטייה, עוף, עגבניות, חסה, רוטב הבית',
    },
  },
  {
    name: 'Spicy Dodster 🌶️🌶️',
    imageUrl: '/products/snacks/spicy-dodster.webp',
    categoryId: 3,
    translations: {
      en: { name: 'Spicy Dodster 🌶️🌶️' },
      he: { name: 'דודסטר חריף 🌶️🌶️' },
    },
    marketingDescription: {
      en: 'Turn up the heat — our classic Dodster with a fiery kick for spice lovers',
      he: 'מעלים את החום — הדודסטר הקלאסי שלנו עם בעיטה חריפה לאוהבי תבלינים',
    },
    description: {
      en: 'Tortilla, spicy chicken, jalapeños, tomatoes, hot sauce',
      he: 'טורטייה, עוף חריף, חלפיניו, עגבניות, רוטב חריף',
    },
  },

  // ==========================================
  // COCKTAILS / MILKSHAKES (categoryId: 4)
  // ==========================================
  {
    name: 'Banana Milkshake',
    imageUrl: '/products/drinks/banana-milkshake.avif',
    categoryId: 4,
    translations: {
      en: { name: 'Banana Milkshake' },
      he: { name: 'מילקשייק בננה' },
    },
    marketingDescription: {
      en: 'Creamy banana bliss — real bananas blended with vanilla ice cream',
      he: 'אושר בננה קרמי — בננות אמיתיות מעורבבות עם גלידת וניל',
    },
    description: {
      en: 'Fresh banana, vanilla ice cream, milk, whipped cream',
      he: 'בננה טרייה, גלידת וניל, חלב, קצפת',
    },
  },
  {
    name: 'Caramel Apple Milkshake',
    imageUrl: '/products/drinks/caramel-apple-milkshake.avif',
    categoryId: 4,
    translations: {
      en: { name: 'Caramel Apple Milkshake' },
      he: { name: 'מילקשייק תפוח וקרמל' },
    },
    marketingDescription: {
      en: 'Autumn in a glass — sweet apple meets buttery caramel swirls',
      he: 'סתיו בכוס — תפוח מתוק פוגש מערבולות קרמל חמאתי',
    },
    description: {
      en: 'Apple, caramel sauce, vanilla ice cream, milk, whipped cream',
      he: 'תפוח, רוטב קרמל, גלידת וניל, חלב, קצפת',
    },
  },
  {
    name: 'Oreo Cookie Milkshake',
    imageUrl: '/products/drinks/oreo-milkshake.avif',
    categoryId: 4,
    translations: {
      en: { name: 'Oreo Cookie Milkshake' },
      he: { name: 'מילקשייק עוגיות אוראו' },
    },
    marketingDescription: {
      en: 'Cookie monster approved — crushed Oreos in a thick, creamy shake',
      he: 'מאושר על ידי מפלצת העוגיות — אוראו כתוש במילקשייק סמיך וקרמי',
    },
    description: {
      en: 'Oreo cookies, vanilla ice cream, milk, chocolate drizzle',
      he: 'עוגיות אוראו, גלידת וניל, חלב, שוקולד',
    },
  },
  {
    name: 'Classic Milkshake 👶',
    imageUrl: '/products/drinks/classic-milkshake.avif',
    categoryId: 4,
    translations: {
      en: { name: 'Classic Milkshake 👶' },
      he: { name: 'מילקשייק קלאסי 👶' },
    },
    marketingDescription: {
      en: 'Timeless vanilla — pure, simple, and loved by all ages',
      he: 'וניל נצחי — טהור, פשוט ואהוב בכל הגילאים',
    },
    description: {
      en: 'Vanilla ice cream, milk, whipped cream',
      he: 'גלידת וניל, חלב, קצפת',
    },
  },

  // ==========================================
  // COFFEE (categoryId: 5)
  // ==========================================
  {
    name: 'Irish Cappuccino',
    imageUrl: '/products/coffee/irish-cappuccino.avif',
    categoryId: 5,
    translations: {
      en: { name: 'Irish Cappuccino' },
      he: { name: "קפוצ'ינו אירי" },
    },
    marketingDescription: {
      en: "A touch of Irish magic — velvety cappuccino with a whisper of cream liqueur flavor",
      he: "נגיעה של קסם אירי — קפוצ'ינו קטיפתי עם לחישה של טעם ליקר שמנת",
    },
    description: {
      en: 'Espresso, steamed milk, Irish cream syrup, foam',
      he: "אספרסו, חלב מוקצף, סירופ אייריש קרים, קצף",
    },
  },
  {
    name: 'Coffee Caramel Cappuccino',
    imageUrl: '/products/coffee/caramel-cappuccino.webp',
    categoryId: 5,
    translations: {
      en: { name: 'Coffee Caramel Cappuccino' },
      he: { name: "קפוצ'ינו קרמל" },
    },
    marketingDescription: {
      en: 'Sweet meets bold — rich espresso crowned with golden caramel swirls',
      he: 'מתוק פוגש נועז — אספרסו עשיר מוכתר במערבולות קרמל זהובות',
    },
    description: {
      en: 'Espresso, steamed milk, caramel sauce, foam',
      he: 'אספרסו, חלב מוקצף, רוטב קרמל, קצף',
    },
  },
  {
    name: 'Coffee Coconut Latte',
    imageUrl: '/products/coffee/coconut-latte.webp',
    categoryId: 5,
    translations: {
      en: { name: 'Coffee Coconut Latte' },
      he: { name: 'לאטה קוקוס' },
    },
    marketingDescription: {
      en: 'Tropical escape — smooth latte with exotic coconut undertones',
      he: 'בריחה טרופית — לאטה חלק עם נימות קוקוס אקזוטיות',
    },
    description: {
      en: 'Espresso, coconut milk, coconut syrup',
      he: 'אספרסו, חלב קוקוס, סירופ קוקוס',
    },
  },
  {
    name: 'Americano coffee',
    imageUrl: '/products/coffee/americano.webp',
    categoryId: 5,
    translations: {
      en: { name: 'Americano coffee' },
      he: { name: 'קפה אמריקנו' },
    },
    marketingDescription: {
      en: 'Pure and strong — bold espresso stretched with hot water for a clean finish',
      he: 'טהור וחזק — אספרסו נועז מדולל במים חמים לסיום נקי',
    },
    description: {
      en: 'Double espresso, hot water',
      he: 'אספרסו כפול, מים חמים',
    },
  },
  {
    name: 'Coffee Latte',
    imageUrl: '/products/coffee/latte.webp',
    categoryId: 5,
    translations: {
      en: { name: 'Coffee Latte' },
      he: { name: 'קפה לאטה' },
    },
    marketingDescription: {
      en: 'Silky smooth — espresso gently embraced by steamed milk',
      he: 'חלק כמשי — אספרסו מחובק בעדינות בחלב מוקצף',
    },
    description: {
      en: 'Espresso, steamed milk, light foam',
      he: 'אספרסו, חלב מוקצף, קצף קל',
    },
  },
];
