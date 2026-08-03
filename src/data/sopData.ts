/**
 * sopData.ts — Kitchen Standard Operating Procedures
 * Each SOP maps to a game station and affects scoring through compliance tracking.
 */

export interface SOPRule {
  id: string
  ruleText: string
  stationTarget: 'stove' | 'prep' | 'sink'
  scoringCategory: 'cooking' | 'cutting' | 'washing'
}

export interface SOP {
  id: string
  title: string
  description: string
  rules: SOPRule[]
  tips: string[]
}

export const KITCHEN_SOPS: SOP[] = [
  {
    id: 'sop1-cookware-alignment',
    title: 'Cookware & Stove Alignment',
    description: 'Select pots and pans that properly match the diameter of the stove burner.',
    rules: [
      {
        id: 'sop1-match-size',
        ruleText: 'Select pots and pans that properly match the diameter of the stove burner.',
        stationTarget: 'stove',
        scoringCategory: 'cooking',
      },
      {
        id: 'sop1-center-cookware',
        ruleText: 'Center the cookware precisely over the burner so the flame is aligned evenly across the bottom.',
        stationTarget: 'stove',
        scoringCategory: 'cooking',
      },
    ],
    tips: [
      'Match your cookware size to the burner for even heat! 🔥',
      'A centered pot prevents heat loss and cooks food evenly.',
      'Too large a pan wastes energy; too small risks uneven cooking.',
    ],
  },
  {
    id: 'sop2-knife-safety',
    title: 'Knife Safety & Preparation',
    description: 'Ensure vegetables are laid flat and securely on the chopping board before cutting.',
    rules: [
      {
        id: 'sop2-stabilize',
        ruleText: 'Ensure vegetables are laid flat and securely on the chopping board before cutting to prevent slipping.',
        stationTarget: 'prep',
        scoringCategory: 'cutting',
      },
      {
        id: 'sop2-uniform-cuts',
        ruleText: 'Cut vegetables into larger, uniform pieces, ensuring the blade makes clean, deliberate contact with the food.',
        stationTarget: 'prep',
        scoringCategory: 'cutting',
      },
    ],
    tips: [
      'Lay vegetables flat before cutting — stability prevents accidents! 🔪',
      'Larger, uniform cuts cook more evenly.',
      'A clean, deliberate cut is safer than a rushed one.',
    ],
  },
  {
    id: 'sop3-washing',
    title: 'Washing & Sanitation',
    description: 'Wash vegetables thoroughly by fully immersing them in water.',
    rules: [
      {
        id: 'sop3-immerse',
        ruleText: 'Wash vegetables thoroughly by fully immersing them in a basin of water.',
        stationTarget: 'sink',
        scoringCategory: 'washing',
      },
      {
        id: 'sop3-large-veggies',
        ruleText: 'Pay extra attention to larger vegetables, rinsing them meticulously to ensure all surface areas are completely free of dirt.',
        stationTarget: 'sink',
        scoringCategory: 'washing',
      },
    ],
    tips: [
      'Fully immerse vegetables in water for a thorough wash! 🚿',
      'Larger vegetables need extra scrubbing time.',
      'Make sure ALL surfaces are free of dirt before cooking.',
    ],
  },
  {
    id: 'sop4-cooking-execution',
    title: 'Cooking Execution',
    description: 'Add ingredients carefully and monitor the stove flame centering.',
    rules: [
      {
        id: 'sop4-careful-add',
        ruleText: 'Add ingredients to the pan carefully and deliberately; avoid haphazardly tossing or dropping them in.',
        stationTarget: 'stove',
        scoringCategory: 'cooking',
      },
      {
        id: 'sop4-monitor-flame',
        ruleText: 'Continuously monitor the stove to ensure the flame remains perfectly centered under the pan while cooking.',
        stationTarget: 'stove',
        scoringCategory: 'cooking',
      },
    ],
    tips: [
      'Add ingredients gently — don\'t just toss them in! 🍳',
      'Keep an eye on the flame — it should stay centered under the pan.',
      'A well-monitored stove produces the best results.',
    ],
  },
]

/** Get SOP by station */
export const getSOPsForStation = (station: 'stove' | 'prep' | 'sink'): SOP[] =>
  KITCHEN_SOPS.filter(sop => sop.rules.some(r => r.stationTarget === station))

/** Get a random tip for a station */
export const getRandomTip = (station: 'stove' | 'prep' | 'sink'): string => {
  const sops = getSOPsForStation(station)
  const allTips = sops.flatMap(s => s.tips)
  return allTips[Math.floor(Math.random() * allTips.length)] ?? ''
}

/**
 * Ingredient size categories for SOP 3 (wash duration scaling).
 * Large vegetables require more thorough washing.
 */
export const INGREDIENT_WASH_SIZE: Record<string, 'small' | 'medium' | 'large'> = {
  // Large — 2200ms wash
  butternutsquash: 'large',
  cabbage: 'large',
  eggplant: 'large',
  bokchoy: 'large',
  cupsquash: 'large',
  ampalaya: 'large',
  // Medium — 1800ms wash
  tomato: 'large', // Tomatoes plural in recipe → treat as large since multiple
  bellpepper: 'medium',
  carrot: 'medium',
  potatoes: 'medium',
  radish: 'medium',
  corncobs: 'medium',
  celery: 'medium',
  // Small — 1400ms wash (default)
  garlic: 'small',
  onion: 'small',
  parsley: 'small',
  sitaw: 'small',
  stringbeans: 'small',
  kangkong: 'small',
  cornkernels: 'small',
}

/** Get wash duration in ms based on ingredient size */
export const getWashDuration = (ingredientId: string): number => {
  const size = INGREDIENT_WASH_SIZE[ingredientId] ?? 'small'
  switch (size) {
    case 'large':  return 2200
    case 'medium': return 1800
    case 'small':  return 1400
  }
}

/**
 * Recommended cookware for each recipe.
 * If a recipe doesn't have an entry, any cookware is accepted.
 */
export const RECIPE_COOKWARE: Record<number, { cookware: 'pot' | 'pan' | 'wok'; burnerSize: 'small' | 'medium' | 'large' }> = {
  // Level 1 — Sauces (small to medium saucepans)
  1:  { cookware: 'pot', burnerSize: 'medium' },   // Bechamel
  2:  { cookware: 'pot', burnerSize: 'medium' },   // Espagnole
  3:  { cookware: 'pot', burnerSize: 'medium' },   // Tomato Sauce
  4:  { cookware: 'pot', burnerSize: 'small' },    // Hollandaise
  // Level 1 — Soups (larger pots)
  5:  { cookware: 'pot', burnerSize: 'large' },    // Chicken Noodle
  6:  { cookware: 'pot', burnerSize: 'large' },    // Butternut Squash
  7:  { cookware: 'pot', burnerSize: 'large' },    // Tomato Soup
  8:  { cookware: 'pot', burnerSize: 'large' },    // Corn Chowder
  // Level 2 — Filipino Basic
  9:  { cookware: 'pot', burnerSize: 'large' },    // Chicken Adobo
  10: { cookware: 'pot', burnerSize: 'large' },    // Pork Sinigang
  11: { cookware: 'wok', burnerSize: 'large' },    // Pakbet
  // Level 3 — Intermediate
  12: { cookware: 'pot', burnerSize: 'large' },    // Beef Caldereta
  13: { cookware: 'pan', burnerSize: 'medium' },   // Fish Escabeche
  14: { cookware: 'pot', burnerSize: 'large' },    // Bulalo
  15: { cookware: 'pot', burnerSize: 'large' },    // Kare-Kare
  // Level 4 — Advanced
  16: { cookware: 'pot', burnerSize: 'large' },    // Spaghetti
  17: { cookware: 'pot', burnerSize: 'large' },    // Pork Afritada
  18: { cookware: 'pot', burnerSize: 'large' },    // Beef Morcon
  19: { cookware: 'pan', burnerSize: 'large' },    // King Ranch Chicken
}
