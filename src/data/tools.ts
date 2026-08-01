import type { ToolCategory, ToolType } from '../types'

// ─── All tools with canCut + technique flags ───────────────────
export const toolCategories: ToolCategory[] = [
  {
    id: 1, name: 'Knives', icon: '🔪',
    description: 'Cutting tools — select one for the prep stage',
    types: [
      { id:'chefs',    name:"Chef's Knife",    image:'/assets/kitchen/chef_s knife.png',   use:'General cutting, slicing, chopping', bestFor:'Meats, vegetables, herbs', category:'knife', canCut:true, cutTechnique:'chopping'  },
      { id:'bread',    name:'Bread Knife',     image:'/assets/kitchen/bread knife.png',    use:'Saw-like edge for crusty items',    bestFor:'Bread, cakes',             category:'knife', canCut:true, cutTechnique:'slicing'   },
      { id:'paring',   name:'Paring Knife',    image:'/assets/kitchen/paring.png',         use:'Precision peeling and trimming',    bestFor:'Fruits, small vegetables', category:'knife', canCut:true, cutTechnique:'slicing'   },
      { id:'santoku',  name:'Santoku Knife',   image:'/assets/kitchen/santoku knife.png',  use:'Japanese all-purpose knife',        bestFor:'Fine dicing and mincing',  category:'knife', canCut:true, cutTechnique:'dicing'    },
      { id:'cleaver',  name:'Cleaver',         image:'/assets/kitchen/cleaver knife.png',  use:'Heavy chopping through bones',      bestFor:'Meat, large vegetables',   category:'knife', canCut:true, cutTechnique:'chopping'  },
      { id:'boning',   name:'Boning Knife',    image:'/assets/kitchen/boning knife.png',   use:'Removing bones from meat/fish',     bestFor:'Poultry, fish, beef',      category:'knife', canCut:true, cutTechnique:'slicing'   },
      { id:'fillet',   name:'Fillet Knife',    image:'/assets/kitchen/fillet knife.png',   use:'Thin flexible blade for fish',      bestFor:'Fish fillets',             category:'knife', canCut:true, cutTechnique:'slicing'   },
      { id:'carving',  name:'Carving Knife',   image:'/assets/kitchen/carving knife.png',  use:'Slicing large cooked meats',        bestFor:'Roasts, turkey, ham',      category:'knife', canCut:true, cutTechnique:'slicing'   },
      { id:'serrated', name:'Serrated Knife',  image:'/assets/kitchen/serrated.png',       use:'Saw-like edge for tough crusts',    bestFor:'Bread, tomatoes',          category:'knife', canCut:true, cutTechnique:'slicing'   },
      { id:'mezza',    name:'Mezzaluna',       image:'/assets/kitchen/mezzaluna knife.png',use:'Rocking chopper for herbs',         bestFor:'Herbs, nuts, garlic',      category:'knife', canCut:true, cutTechnique:'chopping'  },
      { id:'nakiri',   name:'Nakiri Knife',    image:'/assets/kitchen/nakiri knife.png',   use:'Japanese vegetable cleaver',        bestFor:'Vegetables, greens',       category:'knife', canCut:true, cutTechnique:'julienne'  },
      { id:'tomato',   name:'Tomato Knife',    image:'/assets/kitchen/tomato knife.png',   use:'Serrated tip for soft skins',       bestFor:'Tomatoes, citrus',         category:'knife', canCut:true, cutTechnique:'slicing'   },
    ],
  },
  {
    id: 2, name: 'Pots', icon: '🍲',
    description: 'Deep cooking vessels for soups and stews',
    types: [
      { id:'pot',       name:'Stock Pot',     image:'/assets/kitchen/stock pot.png',     use:'Large quantity boiling',          bestFor:'Soups, stews, pasta',      category:'pot' },
      { id:'saucepot',  name:'Sauce Pot',     image:'/assets/kitchen/sauce pot.png',     use:'Medium cooking with lid',         bestFor:'Sauces, braising, rice',   category:'pot' },
      { id:'pastapot',  name:'Pasta Pot',     image:'/assets/kitchen/pasta pot.png',     use:'Deep pot with strainer',          bestFor:'Pasta, blanching',         category:'pot' },
      { id:'brazier',   name:'Brazier Pot',   image:'/assets/kitchen/brazier pot.png',   use:'Wide heavy braising pot',         bestFor:'Braised meats, stews',     category:'pot' },
      { id:'fryer',     name:'Fryer Pot',     image:'/assets/kitchen/fryer pot.png',     use:'Deep frying vessel',              bestFor:'Fried chicken, donuts',    category:'pot' },
      { id:'maincpot',  name:'Cooking Pot',   image:'/assets/kitchen/pot.png',           use:'General purpose cooking',         bestFor:'Everything',               category:'pot' },
    ],
  },
  {
    id: 3, name: 'Pans', icon: '🍳',
    description: 'Wide flat vessels for frying and sautéing',
    types: [
      { id:'frypan',    name:'Frying Pan',        image:'/assets/kitchen/fry pan.png',        use:'Frying, searing, sautéing',      bestFor:'Eggs, pancakes, steak',    category:'pan' },
      { id:'wok',       name:'Wok Pan',            image:'/assets/kitchen/wok pan.png',        use:'High-heat stir-frying',           bestFor:'Asian dishes, stir-fry',   category:'pan' },
      { id:'saute',     name:'Saute Pan',          image:'/assets/kitchen/saute pan.png',      use:'Wide flat base for sautéing',     bestFor:'Vegetables, chicken',      category:'pan' },
      { id:'castiron',  name:'Cast Iron Skillet',  image:'/assets/kitchen/cast iron skillet.png',use:'Even heat retention',          bestFor:'Steaks, searing',          category:'pan' },
      { id:'paella',    name:'Paella Pan',         image:'/assets/kitchen/paella pan.png',     use:'Wide shallow rice dishes',        bestFor:'Paella, seafood',          category:'pan' },
      { id:'roasting',  name:'Roasting Pan',       image:'/assets/kitchen/roasting pan.png',   use:'Oven roasting large cuts',        bestFor:'Roasts, turkey',           category:'pan' },
      { id:'saucepan',  name:'Sauce Pan',          image:'/assets/kitchen/sauce pan.png',      use:'Small quantity heating',          bestFor:'Sauces, soups, eggs',      category:'pan' },
    ],
  },
  {
    id: 4, name: 'Utensils', icon: '🥄',
    description: 'Hand tools for mixing, serving and handling food',
    types: [
      { id:'spatula',   name:'Spatula',      image:'/assets/tools/spatula.png',       use:'Flipping and scraping',          bestFor:'Pancakes, burgers',        category:'utensil' },
      { id:'ladle',     name:'Ladle',        image:'/assets/tools/ladle.png',         use:'Serving soups and stews',        bestFor:'Soups, sauces',            category:'utensil' },
      { id:'whisk',     name:'Whisk',        image:'/assets/tools/whisk.png',         use:'Mixing and aerating',            bestFor:'Eggs, batters',            category:'utensil' },
      { id:'tongs',     name:'Tongs',        image:'/assets/tools/tongs.png',         use:'Gripping and turning food',      bestFor:'Grilling, serving',        category:'utensil' },
      { id:'spoon',     name:'Cooking Spoon',image:'/assets/kitchen/spoon.png',       use:'Stirring and serving',           bestFor:'Soups, sauces',            category:'utensil' },
      { id:'cboard',    name:'Chopping Board',image:'/assets/kitchen/chopping-board.png',use:'Safe cutting surface',        bestFor:'All cutting tasks',        category:'utensil' },
    ],
  },
  {
    id: 5, name: 'Measuring', icon: '📏',
    description: 'Precise measurement for accurate cooking',
    types: [
      { id:'mcup',    name:'Measuring Cup',   image:'/assets/tools/measuring-cup.png',   use:'Dry and liquid ingredients',    bestFor:'Flour, sugar, milk',       category:'measuring' },
      { id:'mspoon',  name:'Measuring Spoons',image:'/assets/tools/measuringspoons.png', use:'Small quantity measurements',   bestFor:'Spices, baking powder',    category:'measuring' },
      { id:'scale',   name:'Kitchen Scale',   image:'/assets/tools/kitchenscale.png',    use:'Weight-based measurements',     bestFor:'Baking, portions',         category:'measuring' },
    ],
  },
]

export const getAllKnives = () =>
  toolCategories[0].types   // first category = knives

export const getAllTools  = () =>
  toolCategories.flatMap(c => c.types)

export const getTotalToolCategories = () => toolCategories.length