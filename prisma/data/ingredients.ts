export const ingredients = [
  {
    name: 'Cheese border',
    price: 7,
    imageUrl: '/ingredients/cheese-border.png',
    translations: {
      en: { name: 'Cheese border' },
      he: { name: 'קראסט גבינה' },
    },
  },
  {
    name: 'Creamy mozzarella',
    price: 7,
    imageUrl: '/ingredients/creamy-mozzarella.png',
    translations: {
      en: { name: 'Creamy mozzarella' },
      he: { name: 'מוצרלה קרמית' },
    },
  },
  {
    name: 'Cheddar and Parmesan cheeses',
    price: 7,
    imageUrl: '/ingredients/cheddar-parmesan.png',
    translations: {
      en: { name: 'Cheddar and Parmesan cheeses' },
      he: { name: 'גבינות צ\'דר ופרמזן' },
    },
  },
  {
    name: 'Hot Jalapeno Pepper',
    price: 5,
    imageUrl: '/ingredients/jalapeno.png',
    translations: {
      en: { name: 'Hot Jalapeno Pepper' },
      he: { name: 'פלפל חלפיניו חריף' },
    },
  },
  {
    name: 'Tender Chicken',
    price: 9,
    imageUrl: '/ingredients/chicken.png',
    translations: {
      en: { name: 'Tender Chicken' },
      he: { name: 'עוף רך' },
    },
  },
  {
    name: 'Champignons',
    price: 5,
    imageUrl: '/ingredients/mushrooms.png',
    translations: {
      en: { name: 'Champignons' },
      he: { name: 'שמפיניון' },
    },
  },
  {
    name: 'Spicy pepperoni',
    price: 7,
    imageUrl: '/ingredients/pepperoni.png',
    translations: {
      en: { name: 'Spicy pepperoni' },
      he: { name: 'פפרוני פיקנטי' },
    },
  },
  {
    name: 'Spicy Chorizo',
    price: 7,
    imageUrl: '/ingredients/chorizo.png',
    translations: {
      en: { name: 'Spicy Chorizo' },
      he: { name: 'צ\'וריסו פיקנטי' },
    },
  },
  {
    name: 'Pickled cucumbers',
    price: 5,
    imageUrl: '/ingredients/pickles.png',
    translations: {
      en: { name: 'Pickled cucumbers' },
      he: { name: 'מלפפונים חמוצים' },
    },
  },
  {
    name: 'Fresh tomatoes',
    price: 5,
    imageUrl: '/ingredients/tomatoes.png',
    translations: {
      en: { name: 'Fresh tomatoes' },
      he: { name: 'עגבניות טריות' },
    },
  },
  {
    name: 'Red onion',
    price: 5,
    imageUrl: '/ingredients/red-onion.png',
    translations: {
      en: { name: 'Red onion' },
      he: { name: 'בצל סגול' },
    },
  },
  {
    name: 'Juicy pineapples',
    price: 5,
    imageUrl: '/ingredients/pineapple.png',
    translations: {
      en: { name: 'Juicy pineapples' },
      he: { name: 'אננס עסיסי' },
    },
  },
  {
    name: 'Italian herbs',
    price: 3,
    imageUrl: '/ingredients/italian-herbs.png',
    translations: {
      en: { name: 'Italian herbs' },
      he: { name: 'עשבי תיבול איטלקיים' },
    },
  },
  {
    name: 'Sweet pepper',
    price: 5,
    imageUrl: '/ingredients/sweet-pepper.png',
    translations: {
      en: { name: 'Sweet pepper' },
      he: { name: 'פלפל מתוק' },
    },
  },
  {
    name: 'Cubes of feta cheese',
    price: 7,
    imageUrl: '/ingredients/feta.png',
    translations: {
      en: { name: 'Cubes of feta cheese' },
      he: { name: 'קוביות גבינת פטה' },
    },
  },
  {
    name: 'Meatballs',
    price: 7,
    imageUrl: '/ingredients/meatballs.png',
    translations: {
      en: { name: 'Meatballs' },
      he: { name: 'כדורי בשר' },
    },
  },
  // New ingredients
  {
    name: 'Beef',
    price: 9,
    imageUrl: '/ingredients/beef.png',
    translations: {
      en: { name: 'Beef' },
      he: { name: 'בקר' },
    },
  },
  {
    name: 'Beef Sausage',
    price: 7,
    imageUrl: '/ingredients/beef-sausage.png',
    translations: {
      en: { name: 'Beef Sausage' },
      he: { name: 'נקניקיות בקר' },
    },
  },
  {
    name: 'Shrimp',
    price: 12,
    imageUrl: '/ingredients/shrimp.png',
    translations: {
      en: { name: 'Shrimp' },
      he: { name: 'שרימפס' },
    },
  },
  {
    name: 'Blue Cheese',
    price: 7,
    imageUrl: '/ingredients/blue-cheese.png',
    translations: {
      en: { name: 'Blue Cheese' },
      he: { name: 'גבינה כחולה' },
    },
  },
].map((obj, index) => ({ id: index + 1, ...obj }));
