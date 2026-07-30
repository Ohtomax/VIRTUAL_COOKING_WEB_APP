import type { Ingredient, StationName } from '../types'

// ALL ingredients now live only in the fridge.
// Cabinet is reserved for tools only.
export const allIngredients: Ingredient[] = [
  // ─── Freezer ───
  { id:'chicken',         name:'Chicken',            image:'/assets/ingredients/chickenNoBg.png',       quantity:'1 kg', location: 'freezer' },
  { id:'chickenbreast',   name:'Chicken breast',     image:'/assets/ingredients/chickenbreastNoBg.png', quantity:'500g', location: 'freezer' },
  { id:'chickenshredded', name:'Chicken shredded',   image:'/assets/ingredients/chickenshreddedNoBg.png',quantity:'1 cup', location: 'freezer' },
  { id:'pork',            name:'Pork',               image:'/assets/ingredients/pork.png',             quantity:'1 kg', location: 'freezer' },
  { id:'porkbelly',       name:'Pork belly',         image:'/assets/ingredients/porkbellyNoBg.png',    quantity:'500g', location: 'freezer' },
  { id:'groundpork',      name:'Ground pork',        image:'/assets/ingredients/groundporkNoBg.png',   quantity:'500g', location: 'freezer' },
  { id:'beef',            name:'Beef',               image:'/assets/ingredients/beefNoBg.png',          quantity:'1 kg', location: 'freezer' },
  { id:'beefshank',       name:'Beef shank',         image:'/assets/ingredients/beefshankNoBg.png',     quantity:'500g', location: 'freezer' },
  { id:'hotdog',          name:'Hotdog',             image:'/assets/ingredients/hotdogNoBg.png',        quantity:'6 pcs', location: 'freezer' },
  { id:'fishtilapia',     name:'Tilapia',            image:'/assets/ingredients/fish.png',             quantity:'1 whole', location: 'freezer' },

  // ─── Fridge ───
  { id:'liverspread',     name:'Liver spread',       image:'/assets/ingredients/liverspreadNoBg.png',   quantity:'1 can', location: 'fridge' },
  { id:'bagoongalamang',  name:'Bagoong alamang',    image:'/assets/ingredients/bagoongalamangNoBg.png',quantity:'1 cup', location: 'fridge' },
  { id:'butter',          name:'Butter',             image:'/assets/ingredients/butter.png',           quantity:'1 stick', location: 'fridge' },
  { id:'cream',           name:'Cream',              image:'/assets/ingredients/creamNoBg.png',        quantity:'1 cup', location: 'fridge' },
  { id:'milk',            name:'Milk',               image:'/assets/ingredients/milk.png',             quantity:'1 cup', location: 'fridge' },
  { id:'cheese',          name:'Cheese',             image:'/assets/ingredients/cheeseNoBg.png',        quantity:'200g', location: 'fridge' },
  { id:'shreddedcheese',  name:'Shredded cheese',    image:'/assets/ingredients/shreddedcheeseNoBg.png',quantity:'1 cup', location: 'fridge' },
  { id:'eggyolks',        name:'Egg yolks',          image:'/assets/ingredients/eggyolkNoBg.png',      quantity:'4 pcs', location: 'fridge' },
  { id:'boiledegg',       name:'Boiled egg',         image:'/assets/ingredients/boiledeggNoBg.png',     quantity:'4 pcs', location: 'fridge' },
  { id:'garlic',          name:'Garlic',             image:'/assets/ingredients/garlic.png',           quantity:'5 cloves', location: 'fridge' },
  { id:'onion',           name:'Onion',              image:'/assets/ingredients/onion.png',            quantity:'1 medium', location: 'fridge' },
  { id:'tomato',          name:'Tomato',             image:'/assets/ingredients/tomato.png',           quantity:'2 medium', location: 'fridge' },
  { id:'carrot',          name:'Carrot',             image:'/assets/ingredients/carrot.png',           quantity:'2 medium', location: 'fridge' },
  { id:'potatoes',        name:'Potatoes',           image:'/assets/ingredients/potato.png',           quantity:'2 medium', location: 'fridge' },
  { id:'celery',          name:'Celery',             image:'/assets/ingredients/celeryNoBg.png',       quantity:'2 stalks', location: 'fridge' },
  { id:'cabbage',         name:'Cabbage',            image:'/assets/ingredients/cabbageNoBg.png',       quantity:'¼ head', location: 'fridge' },
  { id:'bokchoy',         name:'Bok choy',           image:'/assets/ingredients/bokchoyNoBg.png',       quantity:'2 bunches', location: 'fridge' },
  { id:'kangkong',        name:'Kangkong',           image:'/assets/ingredients/kangkong.png',         quantity:'1 bundle', location: 'fridge' },
  { id:'eggplant',        name:'Eggplant',           image:'/assets/ingredients/eggplant.png',         quantity:'1 medium', location: 'fridge' },
  { id:'ampalaya',        name:'Ampalaya',           image:'/assets/ingredients/ampalaya.jpg',         quantity:'1 medium', location: 'fridge' },
  { id:'sitaw',           name:'Sitaw',              image:'/assets/ingredients/stringbeansNoBg.png',  quantity:'1 bundle', location: 'fridge' },
  { id:'stringbeans',     name:'String beans',       image:'/assets/ingredients/stringbeansNoBg.png',   quantity:'1 cup', location: 'fridge' },
  { id:'radish',          name:'Radish',             image:'/assets/ingredients/radish.png',           quantity:'1 medium', location: 'fridge' },
  { id:'butternutsquash', name:'Butternut squash',   image:'/assets/ingredients/butternutsquashNoBg.png',quantity:'1 medium', location: 'fridge' },
  { id:'cupsquash',       name:'Squash',             image:'/assets/ingredients/cupofsquashNoBg.png',  quantity:'1 cup', location: 'fridge' },
  { id:'bellpepper',      name:'Bell pepper',        image:'/assets/ingredients/bellpepperNoBg.png',    quantity:'1 medium', location: 'fridge' },
  { id:'corncobs',        name:'Corn cobs',          image:'/assets/ingredients/corncobsNoBg.png',      quantity:'2 ears', location: 'fridge' },
  { id:'cornkernels',     name:'Corn kernels',       image:'/assets/ingredients/cornkernelsNoBg.png',  quantity:'1 cup', location: 'fridge' },
  { id:'parsley',         name:'Parsley',            image:'/assets/ingredients/parsleyNoBg.png',       quantity:'1 bunch', location: 'fridge' },
  { id:'lemonjuice',      name:'Lemon juice',        image:'/assets/ingredients/lemonjuiceNoBg.png',    quantity:'2 tbsp', location: 'fridge' },
  
  // ─── Shelf (Pantry) ───
  { id:'water',           name:'Water',              image:'/assets/ingredients/milk.png',            quantity:'4 cups', location: 'shelf' },
  { id:'chickenbroth',    name:'Chicken broth',      image:'/assets/ingredients/chickenbrothNoBg.png',  quantity:'2 cups', location: 'shelf' },
  { id:'beefstock',       name:'Beef stock',         image:'/assets/ingredients/beefstockNoBg.png',     quantity:'2 cups', location: 'shelf' },
  { id:'vegetablesbroth', name:'Vegetable broth',    image:'/assets/ingredients/vegetables_broth.png', quantity:'2 cups', location: 'shelf' },
  { id:'creammushroom',   name:'Cream of mushroom',  image:'/assets/ingredients/CreamofmushroomNoBg.png',quantity:'1 can', location: 'shelf' },
  { id:'cookingoil',      name:'Cooking oil',        image:'/assets/ingredients/cookingoilNoBg.png',    quantity:'2 tbsp', location: 'shelf' },
  { id:'oliveoil',        name:'Olive oil',          image:'/assets/ingredients/oliveoilNoBg.png',      quantity:'2 tbsp', location: 'shelf' },
  { id:'soysauce',        name:'Soy sauce',          image:'/assets/ingredients/soysauceNoBg.png',      quantity:'¼ cup', location: 'shelf' },
  { id:'vinegar',         name:'Vinegar',            image:'/assets/ingredients/vinegar.png',          quantity:'¼ cup', location: 'shelf' },
  { id:'tomatopaste',     name:'Tomato paste',       image:'/assets/ingredients/tomato_paste.png',     quantity:'2 tbsp', location: 'shelf' },
  { id:'tomatosauce',     name:'Tomato sauce',       image:'/assets/ingredients/spag_sauce.png',       quantity:'1 cup', location: 'shelf' },
  { id:'spagsauce',       name:'Spag sauce',         image:'/assets/ingredients/spag_sauce.png',       quantity:'1 jar', location: 'shelf' },
  { id:'peanutbutter',    name:'Peanut butter',      image:'/assets/ingredients/peanut_butter.png',    quantity:'½ cup', location: 'shelf' },
  { id:'picklesrelish',   name:'Pickles relish',     image:'/assets/ingredients/pickles_relish.png',   quantity:'2 tbsp', location: 'shelf' },
  { id:'salt',            name:'Salt',               image:'/assets/ingredients/salt.png',             quantity:'1 tsp', location: 'shelf' },
  { id:'pepper',          name:'Pepper',             image:'/assets/ingredients/pepper.png',           quantity:'1 tsp', location: 'shelf' },
  { id:'peppercorn',      name:'Peppercorns',        image:'/assets/ingredients/peppercornNoBg.png',    quantity:'1 tbsp', location: 'shelf' },
  { id:'bayleaves',       name:'Bay leaves',         image:'/assets/ingredients/bayleafNoBg.png',      quantity:'2 pcs', location: 'shelf' },
  { id:'sinigangmix',     name:'Sinigang mix',       image:'/assets/ingredients/sinigang_mix.png',     quantity:'1 pack', location: 'shelf' },
  { id:'flour',           name:'Flour',              image:'/assets/ingredients/flourNoBg.png',        quantity:'1 cup', location: 'shelf' },
  { id:'cornstarch',      name:'Cornstarch',         image:'/assets/ingredients/cornstarchNoBg.png',   quantity:'2 tbsp', location: 'shelf' },
  { id:'pasta',           name:'Pasta',              image:'/assets/ingredients/pasta.png',            quantity:'500g', location: 'shelf' },
  { id:'eggnoodles',      name:'Egg noodles',        image:'/assets/ingredients/egg_noodles.png',      quantity:'200g', location: 'shelf' },
  { id:'corntortillas',   name:'Corn tortillas',     image:'/assets/ingredients/corntortillasNoBg.png', quantity:'6 pcs', location: 'shelf' },
]

// helper: get ingredients by station
export const getIngredientsByStation = (station: StationName): Ingredient[] =>
  allIngredients.filter(i => i.location === station)

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z]/g, '').replace(/s$/, '')

/** Canonical aliases for recipe names that differ from fridge names */
const ALIASES: Record<string, string> = {
  tomatoe: 'tomato',                      // "Tomatoes" → norm "tomatoe" → fridge "Tomato"
  beefbroth: 'beefstock',                 // recipe "Beef broth" → fridge "Beef stock"
  creamofmushroomsoup: 'creamofmushroom', // recipe long name → fridge short name
  fishtilapia: 'tilapia',
}

const canonical = (s: string): string => {
  const n = norm(s)
  return ALIASES[n] ?? n
}
/**
 * STRICT exact matching on canonical names.
 * (The old bidirectional substring match caused "Bell pepper"/"Peppercorns"
 *  to consume the "Pepper" slot, making the real Pepper show as incorrect.)
 */
export const matchesIngredient = (a: string, b: string): boolean =>
  canonical(a) === canonical(b)
/**
 * Resolve a recipe ingredient string to the actual fridge Ingredient object.
 * This makes correctness checks ID/image-based instead of fragile name strings.
 */
export const resolveIngredientByName = (name: string): Ingredient | null =>
  allIngredients.find(i => matchesIngredient(i.name, name)) ?? null

export const findIngredientLocation = (name: string): StationName => {
  const ing = resolveIngredientByName(name)
  return ing ? ing.location : 'fridge'
}
/** IDs that never need washing (pantry, liquids, dairy, processed) */
const NON_WASHABLE_IDS = new Set([
  'butter','cream','milk','eggyolks','lemonjuice','liverspread','shreddedcheese','cheese',
  'creammushroom','chickenshredded','boiledegg','hotdog','bagoongalamang','groundpork',
  'picklesrelish','beefstock','chickenbroth','vegetablesbroth','cookingoil','oliveoil',
  'flour','cornstarch','pepper','salt','peppercorn','soysauce','vinegar','tomatopaste',
  'tomatosauce','sinigangmix','peanutbutter','corntortillas','pasta','spagsauce',
  'eggnoodles','water',
])

export const isWashable = (ing: Pick<Ingredient, 'id'>): boolean =>
  !NON_WASHABLE_IDS.has(ing.id)