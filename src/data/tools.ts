import type { ToolCategory, ToolItem } from '../types'

// ==========================================
// Tool categories for the Tool Identification Module
// ==========================================
export const toolCategories: ToolCategory[] = [
  {
    id: 1,
    name: 'Knives',
    icon: '🔪',
    description: 'Essential cutting tools for food preparation',
    types: [
      { name: "Chef's Knife", image: '/assets/tools/chef-knife.png', use: 'General-purpose cutting, slicing, and chopping', bestFor: 'Vegetables, meats, herbs' },
      { name: 'Bread Knife', image: '/assets/tools/bread-knife.png', use: 'Slicing bread without crushing it', bestFor: 'Bread, cakes, pastries' },
      { name: 'Paring Knife', image: '/assets/tools/paringknife.png', use: 'Precision cutting and peeling', bestFor: 'Fruits, small vegetables, garnishing' },
      { name: 'Santoku Knife', image: '/assets/tools/santokuknife.png', use: 'Japanese-style all-purpose knife', bestFor: 'Fine slicing, dicing, mincing' },
    ],
  },
  {
    id: 2,
    name: 'Pans & Pots',
    icon: '🍳',
    description: 'Cooking vessels for various cooking methods',
    types: [
      { name: 'Saucepan', image: '/assets/tools/saucepan.png', use: 'Heating sauces, boiling small quantities', bestFor: 'Sauces, soups, boiling eggs' },
      { name: 'Frying Pan', image: '/assets/kitchen/pan.png', use: 'Frying, searing, and sautéing', bestFor: 'Pancakes, eggs, stir-fry' },
      { name: 'Stock Pot', image: '/assets/kitchen/pot.png', use: 'Large quantity cooking and boiling', bestFor: 'Soups, stews, pasta' },
      { name: 'Dutch Oven', image: '/assets/tools/dutchoven.png', use: 'Slow cooking and braising', bestFor: 'Stews, roasts, bread baking' },
    ],
  },
  {
    id: 3,
    name: 'Utensils',
    icon: '🥄',
    description: 'Essential tools for mixing and serving',
    types: [
      { name: 'Spatula', image: '/assets/tools/spatula.png', use: 'Flipping and scraping food', bestFor: 'Pancakes, burgers, mixing' },
      { name: 'Ladle', image: '/assets/tools/ladle.png', use: 'Serving soups and stews', bestFor: 'Soups, sauces, stews' },
      { name: 'Whisk', image: '/assets/tools/whisk.png', use: 'Mixing and incorporating air', bestFor: 'Eggs, sauces, batters' },
      { name: 'Tongs', image: '/assets/tools/tongs.png', use: 'Gripping and turning food', bestFor: 'Salads, grilling, serving' },
    ],
  },
  {
    id: 4,
    name: 'Plates & Serving',
    icon: '🍽',
    description: 'Surfaces and boards for safe food preparation and serving',
    types: [
      { name: 'Wood Cutting Board', image: '/assets/kitchen/chopping-board.png', use: 'General cutting, gentle on knife blades', bestFor: 'Vegetables, fruits, bread' },
      { name: 'Plastic Cutting Board', image: '/assets/tools/plastic.png', use: 'Dishwasher safe, color-coded for safety', bestFor: 'Raw meats, cross-contamination prevention' },
      { name: 'Bamboo Board', image: '/assets/tools/bamboo.png', use: 'Eco-friendly, durable cutting surface', bestFor: 'General prep, light chopping' },
    ],
  },
  {
    id: 5,
    name: 'Measuring Tools',
    icon: '📏',
    description: 'Precise measurement for accurate cooking',
    types: [
      { name: 'Measuring Cups', image: '/assets/tools/measuring-cup.png', use: 'Measuring dry and liquid ingredients', bestFor: 'Flour, sugar, milk, water' },
      { name: 'Measuring Spoons', image: '/assets/tools/measuringspoons.png', use: 'Small quantity measurements', bestFor: 'Spices, extracts, baking powder' },
      { name: 'Kitchen Scale', image: '/assets/tools/kitchenscale.png', use: 'Weight-based precise measurements', bestFor: 'Baking, portion control' },
    ],
  },
]

// Flat list of all tools
export const getAllTools = (): ToolItem[] =>
  toolCategories.flatMap((cat) =>
    cat.types.map((t, i) => ({
      id: `${cat.name.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      name: t.name,
      image: t.image,
      category: cat.name,
    })),
  )

export const getTotalToolCategories = (): number => toolCategories.length
