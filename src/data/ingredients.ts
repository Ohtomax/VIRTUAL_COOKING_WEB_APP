import type { Ingredient, StationName } from '../types'

// ==========================================
// Station-based ingredient inventory
// ==========================================

export const stationIngredients: Record<StationName, Ingredient[]> = {
  fridge: [
    { id: 'butter', name: 'Butter', image: '/assets/recipes/butter.jpg', quantity: '1 stick' },
    { id: 'cream', name: 'Cream', image: '/assets/recipes/cream.jpg', quantity: '1 cup' },
    { id: 'milk', name: 'Milk', image: '/assets/recipes/milk.jpg', quantity: '1 cup' },
    { id: 'eggyolks', name: 'Egg yolks', image: '/assets/recipes/eggyolks.jpg', quantity: '4 pieces' },
    { id: 'lemonjuice', name: 'Lemon juice', image: '/assets/recipes/lemonjuice.jpg', quantity: '2 tbsp' },
    { id: 'parsley', name: 'Parsley', image: '/assets/recipes/parsley.jpg', quantity: '1 bunch' },
    { id: 'chickenbreast', name: 'Chicken breast', image: '/assets/recipes/chickenbreast.jpg', quantity: '500g' },
    { id: 'chicken', name: 'Chicken', image: '/assets/recipes/chicken.jpg', quantity: '1 kg' },
    { id: 'porkbelly', name: 'Pork belly', image: '/assets/recipes/pork belly.jpg', quantity: '500g' },
    { id: 'pork', name: 'Pork', image: '/assets/recipes/pork.jpg', quantity: '1 kg' },
    { id: 'beef', name: 'Beef', image: '/assets/recipes/beef.jpg', quantity: '1 kg' },
    { id: 'beefshank', name: 'Beef shank', image: '/assets/recipes/beefshank.jpg', quantity: '500g' },
    { id: 'fishtilapia', name: 'Tilapia', image: '/assets/recipes/fishtilapia.jpg', quantity: '1 whole' },
    { id: 'liverspread', name: 'Liver spread', image: '/assets/recipes/liverspread.jpg', quantity: '1 can' },
    { id: 'shreddedcheese', name: 'Shredded cheese', image: '/assets/recipes/shreddedcheese.jpg', quantity: '1 cup' },
    { id: 'cheese', name: 'Cheese', image: '/assets/recipes/cheese.jpg', quantity: '200g' },
    { id: 'creammushroom', name: 'Cream of mushroom soup', image: '/assets/recipes/creammushroom.jpg', quantity: '1 can' },
    { id: 'chickenshredded', name: 'Chicken shredded', image: '/assets/recipes/chickenshredded.jpeg', quantity: '1 cup' },
    { id: 'boiledegg', name: 'Boiled egg', image: '/assets/recipes/boiledegg.jpg', quantity: '4 pieces' },
    { id: 'hotdog', name: 'Hotdog', image: '/assets/recipes/hotdog.png', quantity: '6 pieces' },
    { id: 'bagoongalamang', name: 'Bagoong alamang', image: '/assets/recipes/bagoong alamang.jpg', quantity: '1 cup' },
    { id: 'groundpork', name: 'Ground pork', image: '/assets/recipes/groundpork.jpeg', quantity: '500g' },
    { id: 'picklesrelish', name: 'Pickles relish', image: '/assets/recipes/picklesrelish.jpeg', quantity: '2 tbsp' },
    { id: 'beefbroth', name: 'Beef broth', image: '/assets/recipes/beefstock.png', quantity: '2 cups' },
    { id: 'chickenbroth', name: 'Chicken broth', image: '/assets/recipes/chickenbroth.jpeg', quantity: '2 cups' },
    { id: 'vegetablesbroth', name: 'Vegetable broth', image: '/assets/recipes/vegetablesbroth.jpeg', quantity: '2 cups' },
  ],

  cabinet: [
    { id: 'beefstock', name: 'Beef stock', image: '/assets/recipes/beefstock.png', quantity: '2 cups' },
    { id: 'cookingoil', name: 'Cooking oil', image: '/assets/recipes/cookingoil.jpg', quantity: '2 tbsp' },
    { id: 'oliveoil', name: 'Olive oil', image: '/assets/recipes/oliveoil.jpg', quantity: '2 tbsp' },
    { id: 'flour', name: 'Flour', image: '/assets/recipes/flour.jpg', quantity: '1 cup' },
    { id: 'cornstarch', name: 'Cornstarch', image: '/assets/recipes/cornstarch.jpg', quantity: '2 tbsp' },
    { id: 'pepper', name: 'Pepper', image: '/assets/recipes/pepper.jpg', quantity: '1 tsp' },
    { id: 'salt', name: 'Salt', image: '/assets/recipes/salt.jpg', quantity: '1 tsp' },
    { id: 'bayleaves', name: 'Bay leaves', image: '/assets/recipes/bayleaves.jpg', quantity: '2 pieces' },
    { id: 'peppercorn', name: 'Peppercorns', image: '/assets/recipes/peppercorn.jpg', quantity: '1 tbsp' },
    { id: 'soysauce', name: 'Soy sauce', image: '/assets/recipes/soysauce.png', quantity: '¼ cup' },
    { id: 'vinegar', name: 'Vinegar', image: '/assets/recipes/vinegar.jpg', quantity: '¼ cup' },
    { id: 'tomatopaste', name: 'Tomato paste', image: '/assets/recipes/tomatopaste.png', quantity: '2 tbsp' },
    { id: 'tomatosauce', name: 'Tomato sauce', image: '/assets/recipes/tomatosauce.png', quantity: '1 cup' },
    { id: 'sinigangmix', name: 'Sinigang mix', image: '/assets/recipes/sinigang mix.jpg', quantity: '1 pack' },
    { id: 'peanutbutter', name: 'Peanut butter', image: '/assets/recipes/peanutbutter.jpg', quantity: '½ cup' },
    { id: 'corntortillas', name: 'Corn tortillas', image: '/assets/recipes/corntortillas.jpg', quantity: '6 pieces' },
    { id: 'pasta', name: 'Pasta', image: '/assets/recipes/pasta.jpg', quantity: '500g' },
    { id: 'spagsauce', name: 'Spag sauce', image: '/assets/recipes/spagsauce.jpg', quantity: '1 jar' },
    { id: 'eggnoodles', name: 'Egg noodles', image: '/assets/recipes/egg noodles.jpeg', quantity: '200g' },
  ],

  table: [
    { id: 'butternutsquash', name: 'Butternut squash', image: '/assets/recipes/butternutsquash.jpg', quantity: '1 medium' },
    { id: 'garlic', name: 'Garlic', image: '/assets/recipes/garlic.jpg', quantity: '5 cloves' },
    { id: 'onion', name: 'Onion', image: '/assets/recipes/onion.jpg', quantity: '1 medium' },
    { id: 'carrot', name: 'Carrot', image: '/assets/recipes/carrot.jpg', quantity: '2 medium' },
    { id: 'celery', name: 'Celery', image: '/assets/recipes/celery.jpg', quantity: '2 stalks' },
    { id: 'cornkernels', name: 'Corn kernels', image: '/assets/recipes/cornkurnels.jpeg', quantity: '1 cup' },
    { id: 'potatoes', name: 'Potatoes', image: '/assets/recipes/potatoes.jpg', quantity: '2 medium' },
    { id: 'tomato', name: 'Tomato', image: '/assets/recipes/tomato.jpg', quantity: '2 medium' },
    { id: 'ampalaya', name: 'Ampalaya', image: '/assets/recipes/ampalaya.jpg', quantity: '1 medium' },
    { id: 'cupsquash', name: 'Squash', image: '/assets/recipes/cup squash.jpg', quantity: '1 cup cubed' },
    { id: 'eggplant', name: 'Eggplant', image: '/assets/recipes/eggplant.jpg', quantity: '1 medium' },
    { id: 'sitaw', name: 'Sitaw', image: '/assets/recipes/sitaw.jpg', quantity: '1 bundle' },
    { id: 'kangkong', name: 'Kangkong', image: '/assets/recipes/kangkong.jpg', quantity: '1 bundle' },
    { id: 'radish', name: 'Radish', image: '/assets/recipes/radish.jpg', quantity: '1 medium' },
    { id: 'bellpepper', name: 'Bell pepper', image: '/assets/recipes/bellpepper.jpg', quantity: '1 medium' },
    { id: 'cabbage', name: 'Cabbage', image: '/assets/recipes/cabbage.jpg', quantity: '¼ head' },
    { id: 'corncobs', name: 'Corn cobs', image: '/assets/recipes/corncobs.jpg', quantity: '2 ears' },
    { id: 'bokchoy', name: 'Bok choy', image: '/assets/recipes/bokchoy.jpg', quantity: '2 bunches' },
    { id: 'stringbeans', name: 'String beans', image: '/assets/recipes/stringbeans.jpg', quantity: '1 cup' },
    { id: 'water', name: 'Water', image: '/assets/recipes/water.jpg', quantity: '4 cups' },
    { id: 'tomatoes', name: 'Tomatoes', image: '/assets/recipes/tomato.jpg', quantity: '3 large' },
  ],

  // Not used as ingredient stations but kept for type completeness
  sink: [],
  stove: [],
  tools: [],
}

// ==========================================
// Helpers
// ==========================================

const normalizeName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/s$/, '')
    .replace(/[^a-z]/g, '')

export const getIngredientsByStation = (station: StationName): Ingredient[] =>
  stationIngredients[station] ?? []

export const findIngredientLocation = (ingredientName: string): StationName => {
  const normalized = normalizeName(ingredientName)
  for (const station of ['fridge', 'cabinet', 'table'] as StationName[]) {
    if (stationIngredients[station].some((i) => normalizeName(i.name) === normalized)) {
      return station
    }
  }
  return 'table' // default
}

export const matchesIngredient = (ingredientName: string, recipeName: string): boolean => {
  const a = normalizeName(ingredientName)
  const b = normalizeName(recipeName)
  return a === b || a.includes(b) || b.includes(a)
}
