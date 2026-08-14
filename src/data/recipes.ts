import type { Recipe, Level } from '../types'

export const recipes: Recipe[] = [
  {
    "id": 1,
    "name": "Bechamel Sauce",
    "level": 1,
    "category": "Sauce",
    "image": "/assets/levels/level1/Sauces/Bechamel/bechamel.png",
    "minScore": 70,
    "cookingDuration": 90,
    "ingredients": [
      "Butter",
      "Flour",
      "Milk",
      "Salt",
      "Pepper"
    ],
    "chronologicalIngredients": [
      "Butter",
      "Flour",
      "Milk",
      "Salt",
      "Pepper"
    ],
    "tools": [
      "saucepan",
      "whisk",
      "mcup",
      "mspoon",
      "spoon"
    ],
    "steps": [
      "Melt butter in saucepan over medium heat",
      "Add flour and whisk for 2 minutes to make roux",
      "Gradually whisk in milk",
      "Simmer for 10 minutes, stirring constantly",
      "Season with salt and pepper",
      "Serve immediately or keep warm"
    ],
    "narrativeIngredients": [
      "2 tbsp butter",
      "2 tbsp all-purpose flour",
      "2 cups milk",
      "Salt to taste",
      "Pepper to taste"
    ],
    "narrativeTools": [
      "Saucepan",
      "Whisk",
      "Measuring cups and spoons",
      "Wooden spoon"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Measure the butter, flour, and milk using measuring cups and spoons. Gather all the tools needed before starting.",
      "Melt the butter. Place the saucepan over medium heat and melt the butter completely.",
      "Make the roux. Add the flour to the melted butter and whisk continuously for about 1–2 minutes until a smooth paste forms.",
      "Add the milk. Slowly pour the milk into the roux while whisking constantly to prevent lumps from forming.",
      "Cook the sauce. Continue stirring until the mixture thickens into a smooth, creamy sauce.",
      "Season and serve. Add salt and pepper to taste. Remove from heat and serve or use in other dishes."
    ]
  },
  {
    "id": 2,
    "name": "Espagnole Sauce",
    "level": 1,
    "category": "Sauce",
    "image": "/assets/levels/level1/Sauces/Espagnole/espagnole.png",
    "minScore": 70,
    "cookingDuration": 90,
    "ingredients": [
      "Beef stock",
      "Butter",
      "Carrots",
      "Celery",
      "Flour",
      "Onion",
      "Pepper",
      "Salt",
      "Tomato paste"
    ],
    "chronologicalIngredients": [
      "Butter",
      "Carrots",
      "Onion",
      "Celery",
      "Flour",
      "Tomato paste",
      "Beef stock"
    ],
    "tools": [
      "saucepan",
      "whisk",
      "spoon",
      "mcup",
      "mspoon",
      "chefs",
      "cboard"
    ],
    "steps": [
      "Prepare mirepoix (diced carrots, onions, celery)",
      "Melt butter and make brown roux with flour",
      "Add beef stock gradually while whisking",
      "Add mirepoix, tomato puree, and herbs",
      "Simmer for 2–3 hours",
      "Strain and serve"
    ],
    "cutInstructions": {
      "Carrots": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Celery": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Onion": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      }
    },
    "narrativeIngredients": [
      "2 tbsp butter",
      "2 tbsp flour",
      "2 cups beef stock",
      "¼ cup tomato paste",
      "¼ cup diced carrots",
      "¼ cup diced onions",
      "¼ cup diced celery"
    ],
    "narrativeTools": [
      "Saucepan",
      "Whisk",
      "Wooden spoon",
      "Measuring cups and spoons"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Measure all ingredients and dice the vegetables.",
      "Cook the vegetables. Melt the butter in a saucepan and sauté the carrots, onions, and celery until softened.",
      "Make the roux. Add the flour and stir continuously until lightly browned.",
      "Add the liquids. Mix in the tomato paste, then gradually pour in the beef stock while whisking.",
      "Simmer the sauce. Allow the sauce to simmer gently for about 30–40 minutes, stirring occasionally.",
      "Strain and serve. Strain the sauce for a smooth texture and use as a base for brown sauces."
    ]
  },
  {
    "id": 3,
    "name": "Tomato Sauce",
    "level": 1,
    "category": "Sauce",
    "image": "/assets/levels/level1/Sauces/Tomato/tomatosauce.jpg",
    "minScore": 70,
    "cookingDuration": 90,
    "ingredients": [
      "Garlic",
      "Olive oil",
      "Onion",
      "Pepper",
      "Salt",
      "Tomatoes"
    ],
    "chronologicalIngredients": [
      "Olive oil",
      "Onion",
      "Garlic",
      "Tomatoes",
      "Salt",
      "Pepper"
    ],
    "tools": [
      "saucepan",
      "chefs",
      "cboard",
      "spoon",
      "mspoon"
    ],
    "steps": [
      "Heat olive oil in saucepan",
      "Sauté diced onion until translucent",
      "Add minced garlic and cook for 1 minute",
      "Add crushed tomatoes and bring to simmer",
      "Cook for 30 minutes, stirring occasionally",
      "Season with salt and pepper",
      "Serve or store for later use"
    ],
    "cutInstructions": {
      "Garlic": {
        "technique": "mince",
        "size": "standard",
        "description": "mince cut"
      },
      "Onion": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Tomatoes": {
        "technique": "chop",
        "size": "standard",
        "description": "chop cut"
      }
    },
    "narrativeIngredients": [
      "2 tbsp olive oil",
      "1 onion, chopped",
      "2 cloves garlic, minced",
      "4 cups crushed tomatoes",
      "1 tsp salt",
      "½ tsp pepper"
    ],
    "narrativeTools": [
      "Saucepan",
      "Knife",
      "Cutting board",
      "Wooden spoon",
      "Measuring spoons"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Wash and chop the onion and mince the garlic.",
      "Sauté the aromatics. Heat olive oil in a saucepan and cook the onion until soft. Add the garlic and stir for one minute.",
      "Add the tomatoes. Pour the crushed tomatoes into the saucepan and stir well.",
      "Season the sauce. Add salt and pepper and mix thoroughly.",
      "Simmer. Cook the sauce over low heat for 30–45 minutes, stirring occasionally until thickened.",
      "Serve. Remove from heat and use for pasta, pizza, or other dishes."
    ]
  },
  {
    "id": 4,
    "name": "Hollandaise Sauce",
    "level": 1,
    "category": "Sauce",
    "image": "/assets/levels/level1/Sauces/Hollandaise/hollandaise-sauce.jpg",
    "minScore": 70,
    "cookingDuration": 90,
    "ingredients": [
      "Butter",
      "Egg yolks",
      "Lemon juice",
      "Salt"
    ],
    "chronologicalIngredients": [
      "Egg yolks",
      "Butter",
      "Lemon juice",
      "Salt"
    ],
    "tools": [
      "saucepan",
      "whisk",
      "mspoon"
    ],
    "steps": [
      "Clarify butter and keep warm",
      "Whisk egg yolks in double boiler over low heat",
      "Add lemon juice and whisk until thickened",
      "Slowly drizzle in warm butter while whisking",
      "Season with salt and cayenne",
      "Serve immediately"
    ],
    "narrativeIngredients": [
      "3 egg yolks",
      "½ cup melted butter",
      "1 tbsp lemon juice",
      "Pinch of salt"
    ],
    "narrativeTools": [
      "Heatproof bowl",
      "Saucepan",
      "Whisk",
      "Measuring spoons"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Separate the egg yolks and measure the butter and lemon juice.",
      "Create a double boiler. Fill a saucepan with a small amount of water and bring it to a gentle simmer. Place the heatproof bowl over the saucepan without touching the water.",
      "Whisk the egg yolks. Add the egg yolks to the bowl and whisk continuously until slightly thickened.",
      "Add the butter. Slowly drizzle the melted butter into the egg yolks while whisking constantly to create a smooth emulsion.",
      "Season the sauce. Add the lemon juice and salt. Continue whisking until the sauce becomes thick and glossy.",
      "Serve immediately. Remove from heat and serve warm with vegetables, fish, or eggs."
    ]
  },
  {
    "id": 5,
    "name": "Chicken Noodle Soup",
    "level": 1,
    "category": "Mother Soup",
    "image": "/assets/levels/level1/MotherSoup/Chicken Noodle Soup/chicken-noodle-soup.jpg",
    "minScore": 70,
    "cookingDuration": 90,
    "ingredients": [
      "Carrot",
      "Celery",
      "Chicken breast",
      "Chicken broth",
      "Cooking oil",
      "Egg noodles",
      "Garlic",
      "Onion",
      "Parsley",
      "Pepper",
      "Salt"
    ],
    "chronologicalIngredients": [
      "Cooking oil",
      "Onion",
      "Celery",
      "Garlic",
      "Chicken breast",
      "Chicken broth",
      "Carrot",
      "Egg noodles",
      "Salt",
      "Pepper"
    ],
    "tools": [
      "cboard",
      "chefs",
      "mcup",
      "mspoon",
      "pot",
      "spoon",
      "ladle"
    ],
    "steps": [
      "Cut chicken into pieces and season",
      "Sauté onion, carrots, and celery in pot",
      "Add garlic and cook until fragrant",
      "Add chicken and chicken broth",
      "Simmer for 20 minutes until chicken is cooked",
      "Add egg noodles and cook until tender",
      "Season with salt and pepper",
      "Serve hot"
    ],
    "cutInstructions": {
      "Carrots": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Celery": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Onion": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Garlic": {
        "technique": "mince",
        "size": "standard",
        "description": "mince cut"
      }
    },
    "narrativeIngredients": [
      "500 g chicken breast or chicken thighs",
      "6 cups chicken broth",
      "1 cup egg noodles",
      "1 carrot, sliced",
      "1 celery stalk, chopped",
      "1 onion, diced",
      "2 cloves garlic, minced",
      "Salt to taste",
      "Pepper to taste",
      "1 tbsp cooking oil",
      "Parsley (optional)"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Measuring cups and spoons",
      "Large soup pot",
      "Wooden spoon",
      "Ladle"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Wash the vegetables thoroughly. Using a cutting board and knife, dice the onion, chop the celery, slice the carrot, and mince the garlic. Cut the chicken into bite-sized pieces.",
      "Sauté the vegetables. Place a large soup pot over medium heat. Add cooking oil and sauté the onion, celery, and garlic using a wooden spoon until fragrant and translucent.",
      "Cook the chicken. Add the chicken pieces to the pot and cook until lightly browned.",
      "Add the broth. Pour the chicken broth into the pot. Stir well and bring the mixture to a boil.",
      "Simmer the soup. Reduce the heat and add the sliced carrots. Allow the soup to simmer for about 15 minutes until the vegetables become tender.",
      "Add the noodles. Stir in the egg noodles and cook according to the package instructions, usually 6–8 minutes.",
      "Season and serve. Add salt and pepper to taste. Ladle the soup into bowls and garnish with parsley if desired."
    ]
  },
  {
    "id": 6,
    "name": "Butternut Squash Soup",
    "level": 1,
    "category": "Mother Soup",
    "image": "/assets/levels/level1/MotherSoup/Butternut Squash Soup/butternut-squash-soup.png",
    "minScore": 70,
    "cookingDuration": 90,
    "ingredients": [
      "Butter",
      "Butternut squash",
      "Cream",
      "Garlic",
      "Onion",
      "Pepper",
      "Salt",
      "Vegetable broth"
    ],
    "chronologicalIngredients": [
      "Butter",
      "Onion",
      "Garlic",
      "Butternut squash",
      "Vegetable broth",
      "Cream",
      "Salt",
      "Pepper"
    ],
    "tools": [
      "cboard",
      "chefs",
      "pot",
      "spoon",
      "ladle"
    ],
    "steps": [
      "Peel and cube butternut squash",
      "Sauté onion and garlic in butter",
      "Add squash and vegetable broth",
      "Simmer until squash is tender (20–25 minutes)",
      "Blend until smooth",
      "Add cream and season",
      "Serve warm"
    ],
    "cutInstructions": {
      "Onion": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Garlic": {
        "technique": "mince",
        "size": "standard",
        "description": "mince cut"
      }
    },
    "narrativeIngredients": [
      "1 medium butternut squash, peeled and cubed",
      "1 onion, chopped",
      "2 cloves garlic, minced",
      "4 cups vegetable broth",
      "1 tbsp butter",
      "½ cup cream (optional)",
      "Salt to taste",
      "Pepper to taste"
    ],
    "narrativeTools": [
      "Vegetable peeler",
      "Cutting board",
      "Chef's knife",
      "Large pot",
      "Blender or immersion blender",
      "Wooden spoon",
      "Ladle"
    ],
    "narrativeSteps": [
      "Prepare the squash. Peel the butternut squash using a vegetable peeler. Cut it in half, remove the seeds, and cube the flesh.",
      "Sauté aromatics. Melt butter in a large pot over medium heat. Add chopped onions and garlic, stirring until softened.",
      "Cook the squash. Add the cubed squash to the pot and stir for several minutes.",
      "Add broth. Pour in the vegetable broth and bring the mixture to a boil.",
      "Simmer until tender. Lower the heat and cook for 20–25 minutes until the squash becomes very soft.",
      "Blend the soup. Using an immersion blender or regular blender, puree the soup until smooth and creamy.",
      "Finish and serve. Return the soup to the pot if necessary. Stir in cream, season with salt and pepper, and serve hot."
    ]
  },
  {
    "id": 7,
    "name": "Tomato Soup",
    "level": 1,
    "category": "Mother Soup",
    "image": "/assets/levels/level1/MotherSoup/Tomato Soup/tomatosauce.jpg",
    "minScore": 70,
    "cookingDuration": 90,
    "ingredients": [
      "Cream",
      "Garlic",
      "Onion",
      "Pepper",
      "Salt",
      "Tomatoes"
    ],
    "chronologicalIngredients": [
      "Onion",
      "Garlic",
      "Tomatoes",
      "Cream",
      "Salt",
      "Pepper"
    ],
    "tools": [
      "cboard",
      "chefs",
      "pot",
      "spoon",
      "ladle"
    ],
    "steps": [
      "Sauté onion and garlic in butter",
      "Add chopped tomatoes and vegetable broth",
      "Simmer for 30 minutes",
      "Blend until smooth",
      "Add cream and basil",
      "Season with salt and pepper",
      "Serve hot with crusty bread"
    ],
    "cutInstructions": {
      "Garlic": {
        "technique": "mince",
        "size": "standard",
        "description": "mince cut"
      },
      "Onion": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Tomatoes": {
        "technique": "chop",
        "size": "standard",
        "description": "chop cut"
      }
    },
    "narrativeIngredients": [
      "6 ripe tomatoes, chopped",
      "1 onion, diced",
      "2 cloves garlic, minced",
      "4 cups vegetable broth",
      "1 tbsp butter or olive oil",
      "½ cup cream (optional)",
      "Salt to taste",
      "Pepper to taste"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Large pot",
      "Blender or immersion blender",
      "Wooden spoon",
      "Ladle"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Wash and chop the tomatoes. Dice the onion and mince the garlic.",
      "Sauté the vegetables. Heat butter or olive oil in a pot. Add onion and garlic, stirring until soft and fragrant.",
      "Cook the tomatoes. Add the chopped tomatoes and cook for about 10 minutes until they soften and release their juices.",
      "Add broth. Pour in the vegetable broth and bring the soup to a gentle boil.",
      "Simmer. Reduce heat and simmer for 15–20 minutes to develop flavor.",
      "Blend until smooth. Use a blender or immersion blender to puree the soup.",
      "Season and serve. Return the soup to the pot, add cream if desired, and season with salt and pepper before serving."
    ]
  },
  {
    "id": 8,
    "name": "Corn Chowder",
    "level": 1,
    "category": "Mother Soup",
    "image": "/assets/levels/level1/MotherSoup/Corn Crowder/creamy-corn-.png",
    "minScore": 70,
    "cookingDuration": 90,
    "ingredients": [
      "Butter",
      "Chicken broth",
      "Corn kernels",
      "Milk",
      "Onion",
      "Pepper",
      "Potatoes",
      "Salt"
    ],
    "chronologicalIngredients": [
      "Butter",
      "Onion",
      "Potatoes",
      "Corn kernels",
      "Chicken broth",
      "Milk",
      "Salt",
      "Pepper"
    ],
    "tools": [
      "cboard",
      "chefs",
      "mcup",
      "pot",
      "spoon",
      "ladle"
    ],
    "steps": [
      "Sauté onion in butter",
      "Add diced potatoes and chicken broth",
      "Simmer until potatoes are tender",
      "Add corn kernels and milk",
      "Season with salt and pepper",
      "Serve hot"
    ],
    "cutInstructions": {
      "Onion": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Potatoes": {
        "technique": "cube",
        "size": "standard",
        "description": "cube cut"
      }
    },
    "narrativeIngredients": [
      "3 cups corn kernels",
      "2 potatoes, diced",
      "1 onion, chopped",
      "2 cups milk",
      "2 cups chicken or vegetable broth",
      "2 tbsp butter",
      "Salt to taste",
      "Pepper to taste"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Measuring cups",
      "Large soup pot",
      "Wooden spoon",
      "Potato masher (optional)",
      "Ladle"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Peel and dice the potatoes. Chop the onion and measure the corn kernels.",
      "Sauté the onion. Melt butter in a soup pot. Add the onion and cook until soft and translucent.",
      "Add potatoes and corn. Stir in the diced potatoes and corn kernels.",
      "Pour in the broth. Add the broth and bring the mixture to a boil.",
      "Simmer until tender. Reduce heat and cook for 15–20 minutes until the potatoes become soft.",
      "Create a creamy texture. Mash some of the potatoes using a potato masher while leaving some chunks intact.",
      "Add milk and season. Pour in the milk and stir gently. Season with salt and pepper to taste.",
      "Serve hot. Heat through without boiling, then ladle into serving bowls and serve immediately."
    ]
  },
  {
    "id": 9,
    "name": "Chicken Adobo",
    "level": 2,
    "category": "Filipino Basic",
    "image": "/assets/levels/level2/Basic/ChickenAdobo/adobo.jpg",
    "minScore": 75,
    "cookingDuration": 120,
    "ingredients": [
      "Bay leaves",
      "Chicken",
      "Cooking oil",
      "Garlic",
      "Peppercorns",
      "Soy sauce",
      "Vinegar",
      "Water"
    ],
    "chronologicalIngredients": [
      "Chicken",
      "Soy sauce",
      "Garlic",
      "Cooking oil",
      "Water",
      "Vinegar",
      "Bay leaves",
      "Peppercorns"
    ],
    "tools": [
      "cboard",
      "chefs",
      "mcup",
      "mspoon",
      "pot",
      "spoon"
    ],
    "steps": [
      "Cut chicken into serving pieces",
      "Combine chicken, soy sauce, vinegar, garlic, bay leaves, and pepper",
      "Let marinate for 30 minutes",
      "Add water and bring to boil",
      "Simmer for 30–40 minutes until chicken is tender",
      "Remove chicken and fry until golden brown",
      "Reduce sauce and pour over chicken"
    ],
    "cutInstructions": {
      "Garlic": {
        "technique": "mince",
        "size": "standard",
        "description": "mince cut"
      }
    },
    "narrativeIngredients": [
      "1 kg chicken",
      "cut into serving pieces",
      "½ cup soy sauce",
      "¼ cup vinegar",
      "1 cup water",
      "4 cloves garlic",
      "crushed",
      "2 bay leaves",
      "1 tsp whole peppercorns",
      "1 tbsp cooking oil"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Measuring cups and spoons",
      "Mixing bowl",
      "Cooking pot or saucepan",
      "Wooden spoon",
      "Serving bowl"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Wash the chicken thoroughly and drain well. Crush the garlic and measure all ingredients using measuring cups and spoons.",
      "Marinate the chicken. Place the chicken in a mixing bowl. Add soy sauce and garlic, then mix well. Let it marinate for at least 30 minutes.",
      "Brown the chicken. Heat cooking oil in a pot over medium heat. Add the marinated chicken and cook until lightly browned on all sides.",
      "Add the seasonings. Pour the remaining marinade into the pot. Add water, vinegar, bay leaves, and peppercorns.",
      "Simmer the adobo. Bring the mixture to a boil. Lower the heat and simmer for 30–40 minutes until the chicken becomes tender.",
      "Reduce the sauce. Allow the sauce to reduce slightly until it reaches the desired consistency.",
      "Serve. Transfer the Chicken Adobo to a serving bowl and serve hot with steamed rice."
    ]
  },
  {
    "id": 10,
    "name": "Pork Sinigang",
    "level": 2,
    "category": "Filipino Basic",
    "image": "/assets/levels/level2/Basic/PorkSinigang/pork sinigang.jpg",
    "minScore": 75,
    "cookingDuration": 120,
    "ingredients": [
      "Kangkong",
      "Onion",
      "Pork belly",
      "Radish",
      "Sinigang mix",
      "Sitaw",
      "Tomato",
      "Water"
    ],
    "chronologicalIngredients": [
      "Pork belly",
      "Water",
      "Onion",
      "Tomato",
      "Radish",
      "Sitaw",
      "Sinigang mix",
      "Kangkong"
    ],
    "tools": [
      "cboard",
      "chefs",
      "pot",
      "mcup",
      "spoon",
      "ladle"
    ],
    "steps": [
      "Boil pork in water until tender",
      "Add onion and tomato",
      "Add sinigang mix",
      "Add vegetables (radish, sitaw)",
      "Add kangkong last",
      "Simmer until vegetables are cooked",
      "Serve hot with rice"
    ],
    "cutInstructions": {
      "Tomato": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Onion": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Radish": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Kangkong": {
        "technique": "straight cut",
        "size": "standard",
        "description": "straight cut"
      },
      "Sitaw": {
        "technique": "diagonal cut",
        "size": "standard",
        "description": "diagonal cut"
      }
    },
    "narrativeIngredients": [
      "500 g pork belly or pork ribs",
      "6 cups water",
      "1 packet sinigang mix",
      "1 tomato",
      "quartered",
      "1 onion",
      "quartered",
      "1 cup kangkong (water spinach)",
      "1 cup string beans, cut into pieces",
      "1 radish, sliced"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Large cooking pot",
      "Measuring cup",
      "Wooden spoon",
      "Ladle"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Wash all vegetables thoroughly. Slice the radish, cut the string beans, and prepare the tomato and onion. Wash the pork and cut into serving pieces if needed.",
      "Boil the pork. Place the pork and water in a large pot. Bring to a boil and remove any scum that rises to the surface.",
      "Add aromatics. Add the onion and tomato. Simmer for 30–40 minutes or until the pork becomes tender.",
      "Add vegetables. Add the radish and string beans. Continue cooking for about 5–7 minutes.",
      "Add the souring agent. Stir in the sinigang mix until fully dissolved.",
      "Add leafy vegetables. Add the kangkong and cook for 1–2 minutes until wilted.",
      "Serve. Taste the broth and adjust if necessary. Ladle the Sinigang into serving bowls and serve hot."
    ]
  },
  {
    "id": 11,
    "name": "Pakbet",
    "level": 2,
    "category": "Filipino Basic",
    "image": "/assets/levels/level2/Basic/Pakbet/pakbet.jpg",
    "minScore": 75,
    "cookingDuration": 120,
    "ingredients": [
      "Ampalaya",
      "Bagoong alamang",
      "Cooking oil",
      "Squash",
      "Eggplant",
      "Garlic",
      "Onion",
      "Sitaw",
      "Tomato",
      "Water"
    ],
    "chronologicalIngredients": [
      "Cooking oil",
      "Garlic",
      "Onion",
      "Tomato",
      "Bagoong alamang",
      "Squash",
      "Sitaw",
      "Eggplant",
      "Ampalaya",
      "Water"
    ],
    "tools": [
      "cboard",
      "chefs",
      "mcup",
      "mspoon",
      "wok",
      "spoon"
    ],
    "steps": [
      "Sauté garlic and onion in oil",
      "Add tomato and cook until soft",
      "Add squash, then eggplant and ampalaya",
      "Add sitaw and water",
      "Add bagoong alamang",
      "Stir-fry until vegetables are cooked but still crisp"
    ],
    "cutInstructions": {
      "Tomato": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Onion": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Eggplant": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Ampalaya": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Squash": {
        "technique": "cube",
        "size": "standard",
        "description": "cube cut"
      },
      "Garlic": {
        "technique": "mince",
        "size": "standard",
        "description": "mince cut"
      }
    },
    "narrativeIngredients": [
      "1 cup squash",
      "cubed",
      "1 eggplant, sliced",
      "1 cup string beans, cut into pieces",
      "1 cup bitter melon (ampalaya), sliced",
      "2 tomatoes, chopped",
      "1 onion, chopped",
      "2 cloves garlic, minced",
      "2 tbsp bagoong alamang (shrimp paste)",
      "1 cup water",
      "1 tbsp cooking oil"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Measuring cups and spoons",
      "Cooking pot or wok",
      "Wooden spoon",
      "Serving bowl"
    ],
    "narrativeSteps": [
      "Prepare the vegetables. Wash all vegetables thoroughly. Slice the eggplant and bitter melon, cube the squash, and cut the string beans into manageable pieces.",
      "Sauté the aromatics. Heat cooking oil in a pot or wok over medium heat. Sauté the garlic, onion, and tomatoes until softened.",
      "Add the shrimp paste. Stir in the bagoong alamang and cook for about one minute to blend the flavors.",
      "Add the vegetables. Place the squash, string beans, eggplant, and bitter melon into the pot.",
      "Add water and cook. Pour in the water and cover the pot. Simmer for 10–15 minutes until the vegetables are tender.",
      "Mix gently. Stir carefully to avoid breaking the vegetables while ensuring the flavors are evenly distributed.",
      "Serve. Transfer the Pakbet to a serving bowl and serve hot as a main dish or side dish with rice."
    ]
  },
  {
    "id": 12,
    "name": "Beef Caldereta",
    "level": 3,
    "category": "Intermediate",
    "image": "/assets/levels/level3/Intermediate/BeefCaldereta/beefcaldereta.jpg",
    "minScore": 80,
    "cookingDuration": 180,
    "ingredients": [
      "Beef",
      "Bell pepper",
      "Carrots",
      "Cooking oil",
      "Garlic",
      "Liver spread",
      "Onion",
      "Pepper",
      "Potatoes",
      "Salt",
      "Tomato sauce",
      "Water"
    ],
    "tools": [
      "cboard",
      "chefs",
      "mcup",
      "mspoon",
      "pot",
      "spoon",
      "ladle"
    ],
    "steps": [
      "Cut beef into cubes",
      "Sauté garlic and onion",
      "Add beef and cook until brown",
      "Add tomato sauce and water",
      "Simmer until beef is tender",
      "Add liver spread and mix well",
      "Add potatoes, carrots, and bell pepper",
      "Simmer until vegetables are cooked"
    ],
    "cutInstructions": {
      "Onion": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Garlic": {
        "technique": "mince",
        "size": "standard",
        "description": "mince cut"
      },
      "Potatoes": {
        "technique": "cube",
        "size": "standard",
        "description": "cube cut"
      },
      "Carrot": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Bell pepper": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      }
    },
    "narrativeIngredients": [
      "1 kg beef, cut into cubes",
      "2 tbsp cooking oil",
      "1 onion, chopped",
      "4 cloves garlic, minced",
      "2 cups tomato sauce",
      "2 cups water or beef broth",
      "2 potatoes",
      "cubed",
      "1 carrot",
      "cubed",
      "1 red bell pepper, sliced",
      "2 tbsp liver spread",
      "Salt to taste",
      "Pepper to taste"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Measuring cups and spoons",
      "Large pot",
      "Wooden spoon",
      "Ladle",
      "Serving bowl"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Wash and cut the beef into cubes. Peel and cube the potatoes and carrots. Slice the bell pepper and prepare the onion and garlic.",
      "Sauté the aromatics. Heat oil in a large pot. Sauté the garlic and onion until fragrant and translucent.",
      "Brown the beef. Add the beef cubes and cook until lightly browned on all sides.",
      "Add the sauce. Pour in the tomato sauce and beef broth. Stir well to combine.",
      "Simmer the beef. Cover the pot and simmer for 1 to 1½ hours or until the beef becomes tender.",
      "Add the vegetables. Add the potatoes and carrots. Continue cooking until they become tender.",
      "Finish the dish. Stir in the liver spread and bell pepper. Season with salt and pepper.",
      "Serve. Transfer the Beef Caldereta to a serving bowl and serve hot with rice."
    ]
  },
  {
    "id": 13,
    "name": "Fish Escabeche",
    "level": 3,
    "category": "Intermediate",
    "image": "/assets/levels/level3/Intermediate/FishEscabeche/fishescabeche.jpg",
    "minScore": 80,
    "cookingDuration": 180,
    "ingredients": [
      "Bell pepper",
      "Carrot",
      "Cooking oil",
      "Cornstarch",
      "Tilapia",
      "Onion",
      "Pepper",
      "Salt",
      "Vinegar",
      "Water"
    ],
    "tools": [
      "cboard",
      "chefs",
      "frypan",
      "saucepan",
      "spoon",
      "tongs"
    ],
    "steps": [
      "Clean and score the fish",
      "Fry fish until golden brown and set aside",
      "Sauté garlic, onion, and ginger",
      "Add vegetables and stir-fry",
      "Add vinegar, sugar, and water",
      "Thicken with cornstarch slurry",
      "Pour sauce over fried fish"
    ],
    "cutInstructions": {
      "Onion": {
        "technique": "julienne",
        "size": "standard",
        "description": "julienne cut"
      },
      "Bell pepper": {
        "technique": "julienne",
        "size": "standard",
        "description": "julienne cut"
      },
      "Garlic": {
        "technique": "mince",
        "size": "standard",
        "description": "mince cut"
      },
      "Carrot": {
        "technique": "julienne",
        "size": "standard",
        "description": "julienne cut"
      }
    },
    "narrativeIngredients": [
      "1 whole fish (tilapia or lapu-lapu)",
      "cleaned",
      "2 tbsp cooking oil",
      "1 onion, sliced",
      "1 carrot",
      "sliced into strips",
      "1 red bell pepper, sliced",
      "½ cup vinegar",
      "¼ cup sugar",
      "1 cup water",
      "1 tbsp cornstarch (optional)",
      "Salt to taste",
      "Pepper to taste"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Frying pan",
      "Saucepan",
      "Wooden spoon",
      "Tongs",
      "Serving platter"
    ],
    "narrativeSteps": [
      "Prepare the fish. Clean and wash the fish thoroughly. Pat dry and season with salt and pepper.",
      "Fry the fish. Heat oil in a frying pan and fry the fish until golden brown on both sides. Remove and place on a serving platter.",
      "Prepare the sauce. In a saucepan, combine vinegar, sugar, and water. Bring the mixture to a boil.",
      "Add vegetables. Add the onion, carrot, and bell pepper. Simmer until the vegetables are slightly tender.",
      "Thicken the sauce. If desired, dissolve cornstarch in a small amount of water and stir into the sauce until slightly thickened.",
      "Pour over the fish. Carefully pour the sweet and sour sauce over the fried fish.",
      "Serve. Serve the Fish Escabeche while warm with steamed rice."
    ]
  },
  {
    "id": 14,
    "name": "Bulalo",
    "level": 3,
    "category": "Intermediate",
    "image": "/assets/levels/level3/Intermediate/Bulalo/bulalo.jpg",
    "minScore": 80,
    "cookingDuration": 180,
    "ingredients": [
      "Beef shank",
      "Cabbage",
      "Corn cobs",
      "Onion",
      "Pepper",
      "Potatoes",
      "Salt",
      "Water"
    ],
    "tools": [
      "cboard",
      "chefs",
      "pot",
      "ladle",
      "mcup"
    ],
    "steps": [
      "Boil beef shank in water with onion",
      "Simmer for 2–3 hours until beef is tender",
      "Add corn and cook for 10 minutes",
      "Add potatoes",
      "Add cabbage last",
      "Season with salt and pepper",
      "Serve hot with broth"
    ],
    "cutInstructions": {
      "Onion": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Potatoes": {
        "technique": "cube",
        "size": "standard",
        "description": "cube cut"
      },
      "Cabbage": {
        "technique": "chop",
        "size": "standard",
        "description": "chop cut"
      }
    },
    "narrativeIngredients": [
      "1 kg beef shank with bone marrow",
      "8 cups water",
      "1 onion",
      "quartered",
      "2 corn cobs, cut into pieces",
      "2 potatoes",
      "quartered",
      "1 small cabbage",
      "cut into wedges",
      "Salt to taste",
      "Pepper to taste"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Large stockpot",
      "Ladle",
      "Measuring cup",
      "Serving bowl"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Wash the beef shank and vegetables thoroughly. Cut the corn and potatoes into serving portions.",
      "Boil the beef. Place the beef and water in a large stockpot. Bring to a boil and remove any scum that rises to the surface.",
      "Simmer until tender. Add the onion and simmer for about 2–3 hours or until the beef becomes very tender.",
      "Add the vegetables. Add the corn and potatoes. Continue cooking until tender.",
      "Add the cabbage. Place the cabbage wedges into the pot and cook for 3–5 minutes.",
      "Season the broth. Add salt and pepper according to taste.",
      "Serve. Ladle the Bulalo into serving bowls, ensuring each serving contains beef, marrow, vegetables, and broth."
    ]
  },
  {
    "id": 15,
    "name": "Kare-Kare",
    "level": 3,
    "category": "Intermediate",
    "image": "/assets/levels/level3/Intermediate/kare-kare/karekare.jpg",
    "minScore": 80,
    "cookingDuration": 180,
    "ingredients": [
      "Beef",
      "Bok choy",
      "Eggplant",
      "Onion",
      "Peanut butter",
      "Salt",
      "String beans",
      "Water"
    ],
    "tools": [
      "cboard",
      "chefs",
      "pot",
      "spoon",
      "mcup",
      "ladle"
    ],
    "steps": [
      "Boil beef until tender",
      "Sauté garlic and onion",
      "Add beef and cook",
      "Add peanut butter and water",
      "Add vegetables and cook until done",
      "Season with salt",
      "Serve with bagoong on the side"
    ],
    "cutInstructions": {
      "Eggplant": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Sitaw": {
        "technique": "straight cut",
        "size": "standard",
        "description": "straight cut"
      },
      "Onion": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      }
    },
    "narrativeIngredients": [
      "1 kg beef tripe or beef shank",
      "6 cups water",
      "¼ cup ground roasted rice",
      "¼ cup peanut butter",
      "1 eggplant, sliced",
      "1 bundle string beans, cut into pieces",
      "1 bunch pechay (bok choy)",
      "1 onion, chopped",
      "Salt to taste"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Large pot",
      "Wooden spoon",
      "Measuring cups",
      "Ladle",
      "Serving bowl"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Wash the beef and vegetables thoroughly. Slice and cut the vegetables into serving portions.",
      "Boil the beef. Place the beef and water in a large pot. Bring to a boil and remove any impurities from the surface.",
      "Tenderize the meat. Simmer the beef for 1½–2 hours or until tender.",
      "Prepare the sauce base. Add the ground roasted rice and peanut butter to the broth. Stir continuously until fully dissolved.",
      "Add the vegetables. Add the eggplant and string beans. Cook until tender.",
      "Add the leafy vegetables. Add the pechay and cook for 2–3 minutes.",
      "Season and finish. Add salt to taste and stir gently until the sauce becomes thick and smooth.",
      "Serve. Transfer the Kare-Kare to a serving bowl and traditionally serve with shrimp paste (bagoong) on the side."
    ]
  },
  {
    "id": 16,
    "name": "Spaghetti",
    "level": 4,
    "category": "Advanced",
    "image": "/assets/levels/level4/Advance/pasta/spaghetti.jpg",
    "minScore": 85,
    "cookingDuration": 240,
    "ingredients": [
      "Pasta",
      "Ground pork",
      "Spag sauce",
      "Onion",
      "Garlic",
      "Cooking oil",
      "Cheese",
      "Pepper",
      "Salt",
      "Water"
    ],
    "tools": [
      "pot",
      "frypan",
      "spoon",
      "cboard",
      "chefs",
      "mcup",
      "mspoon"
    ],
    "steps": [
      "Cook pasta according to package directions",
      "Sauté onion and garlic in oil",
      "Add ground pork and cook until brown",
      "Add spaghetti sauce",
      "Simmer for 15–20 minutes",
      "Season with salt and pepper",
      "Toss with pasta and top with cheese"
    ],
    "cutInstructions": {
      "Onion": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Garlic": {
        "technique": "mince",
        "size": "standard",
        "description": "mince cut"
      }
    },
    "narrativeIngredients": [
      "500 g spaghetti noodles",
      "500 g ground pork or beef",
      "1 onion, chopped",
      "3 cloves garlic, minced",
      "2 cups spaghetti sauce",
      "1 cup water",
      "2 tbsp cooking oil",
      "1 cup grated cheese",
      "Salt to taste",
      "Pepper to taste"
    ],
    "narrativeTools": [
      "Large pot",
      "Colander",
      "Frying pan",
      "Wooden spoon",
      "Cutting board",
      "Chef's knife",
      "Measuring cups and spoons",
      "Serving bowl"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Chop the onion, mince the garlic, and measure all ingredients. Fill a large pot with water and bring it to a boil.",
      "Cook the pasta. Add the spaghetti noodles to the boiling water and cook according to package directions. Drain using a colander and set aside.",
      "Sauté the aromatics. Heat oil in a frying pan. Sauté the garlic and onion until fragrant and soft.",
      "Cook the meat. Add the ground meat and cook until browned.",
      "Prepare the sauce. Pour in the spaghetti sauce and water. Stir well and simmer for 10–15 minutes. Season with salt and pepper.",
      "Combine and serve. Place the cooked pasta on a serving plate and top with the sauce. Sprinkle grated cheese before serving."
    ]
  },
  {
    "id": 17,
    "name": "Pork Afritada",
    "level": 4,
    "category": "Advanced",
    "image": "/assets/levels/level4/Advance/PorkAfritada/porkafritada.jpg",
    "minScore": 85,
    "cookingDuration": 240,
    "ingredients": [
      "Pork",
      "Tomato sauce",
      "Potatoes",
      "Carrot",
      "Bell pepper",
      "Onion",
      "Garlic",
      "Cooking oil",
      "Pepper",
      "Salt",
      "Water"
    ],
    "tools": [
      "cboard",
      "chefs",
      "pot",
      "spoon",
      "mcup"
    ],
    "steps": [
      "Cut pork into cubes",
      "Sauté garlic and onion",
      "Add pork and cook until brown",
      "Add tomato sauce and water",
      "Simmer until pork is tender",
      "Add potatoes, carrots, and bell pepper",
      "Simmer until vegetables are cooked"
    ],
    "cutInstructions": {
      "Potatoes": {
        "technique": "cube",
        "size": "standard",
        "description": "cube cut"
      },
      "Carrots": {
        "technique": "slice",
        "size": "standard",
        "description": "slice cut"
      },
      "Onion": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Bell pepper": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Garlic": {
        "technique": "mince",
        "size": "standard",
        "description": "mince cut"
      }
    },
    "narrativeIngredients": [
      "1 kg pork, cut into cubes",
      "2 tbsp cooking oil",
      "1 onion, chopped",
      "4 cloves garlic, minced",
      "2 cups tomato sauce",
      "2 cups water",
      "2 potatoes",
      "cubed",
      "1 carrot",
      "cubed",
      "1 red bell pepper, sliced",
      "Salt to taste",
      "Pepper to taste"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Large pot",
      "Wooden spoon",
      "Measuring cups",
      "Serving bowl"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Wash and cut the pork and vegetables into serving pieces.",
      "Sauté the aromatics. Heat oil in a pot. Sauté the garlic and onion until fragrant.",
      "Brown the pork. Add the pork cubes and cook until lightly browned.",
      "Add the sauce. Pour in the tomato sauce and water. Stir well and bring to a boil.",
      "Simmer the pork. Cover and simmer for about 40–50 minutes or until the pork becomes tender.",
      "Add the vegetables. Add the potatoes and carrots and cook until tender.",
      "Finish the dish. Add the bell pepper and season with salt and pepper.",
      "Serve. Transfer to a serving bowl and serve hot with rice."
    ]
  },
  {
    "id": 18,
    "name": "Beef Morcon",
    "level": 4,
    "category": "Advanced",
    "image": "/assets/levels/level4/Advance/BeefMorcon/beefmorcon.png",
    "minScore": 85,
    "cookingDuration": 240,
    "ingredients": [
      "Beef",
      "Hotdog",
      "Carrot",
      "Boiled egg",
      "Soy sauce",
      "Cooking oil",
      "Pepper",
      "Salt",
      "Beef broth",
      "Pickles relish"
    ],
    "tools": [
      "cboard",
      "chefs",
      "pot",
      "spoon"
    ],
    "steps": [
      "Pound beef until thin",
      "Place hotdog, carrot, egg on beef",
      "Roll beef and tie with twine",
      "Sear beef roll on all sides",
      "Add soy sauce, beef broth, and water",
      "Simmer beef roll until tender",
      "Slice and serve with sauce"
    ],
    "cutInstructions": {
      "Carrot": {
        "technique": "julienne",
        "size": "standard",
        "description": "julienne cut"
      },
      "Bell pepper": {
        "technique": "julienne",
        "size": "standard",
        "description": "julienne cut"
      }
    },
    "narrativeIngredients": [
      "1 kg beef flank steak",
      "2 carrots",
      "cut into strips",
      "2 hotdogs",
      "cut into strips",
      "2 hard-boiled eggs, sliced",
      "½ cup pickle relish",
      "2 tbsp soy sauce",
      "2 tbsp cooking oil",
      "2 cups beef broth",
      "Salt to taste",
      "Pepper to taste"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Meat mallet",
      "Kitchen twine",
      "Large pan or pot",
      "Wooden spoon",
      "Serving platter"
    ],
    "narrativeSteps": [
      "Prepare the beef. Lay the beef flat on a cutting board and pound it using a meat mallet until evenly thin.",
      "Add the filling. Arrange the carrot strips, hotdogs, sliced eggs, and pickle relish in the center of the beef.",
      "Roll and secure. Carefully roll the beef into a log shape and tie it securely with kitchen twine.",
      "Brown the beef roll. Heat oil in a pan and brown all sides of the beef roll.",
      "Simmer the morcon. Add soy sauce and beef broth. Cover and simmer for 1½–2 hours until tender.",
      "Slice the morcon. Remove the twine and allow the meat to rest before slicing.",
      "Serve. Arrange the slices on a serving platter and spoon some sauce over the top before serving."
    ]
  },
  {
    "id": 19,
    "name": "King Ranch Chicken",
    "level": 4,
    "category": "Advanced",
    "image": "/assets/levels/level4/Advance/KingRanchChicken/kingranch.jpg",
    "minScore": 85,
    "cookingDuration": 240,
    "ingredients": [
      "Chicken shredded",
      "Corn tortillas",
      "Shredded cheese",
      "Bell pepper",
      "Onion",
      "Cream of mushroom soup",
      "Chicken broth",
      "Cooking oil",
      "Tomato"
    ],
    "tools": [
      "cboard",
      "chefs",
      "frypan",
      "spoon"
    ],
    "steps": [
      "Cook and shred chicken",
      "Sauté peppers and onion",
      "Mix chicken with soup, tomato, and vegetables",
      "Layer tortilla and chicken mixture in baking dish",
      "Top with cheese",
      "Bake at 350°F for 30 minutes",
      "Serve hot"
    ],
    "cutInstructions": {
      "Onion": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Bell pepper": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      },
      "Tomato": {
        "technique": "dice",
        "size": "standard",
        "description": "dice cut"
      }
    },
    "narrativeIngredients": [
      "500 g cooked chicken",
      "shredded",
      "1 onion, chopped",
      "1 bell pepper, chopped",
      "1 can cream of mushroom soup",
      "1 can diced tomatoes",
      "1 cup chicken broth",
      "2 cups shredded cheese",
      "8 corn tortillas, cut into pieces",
      "1 tbsp cooking oil"
    ],
    "narrativeTools": [
      "Cutting board",
      "Chef's knife",
      "Mixing bowl",
      "Frying pan",
      "Baking dish",
      "Oven",
      "Wooden spoon"
    ],
    "narrativeSteps": [
      "Prepare the ingredients. Shred the cooked chicken, chop the onion and bell pepper, and gather all ingredients.",
      "Sauté the vegetables. Heat oil in a frying pan. Cook the onion and bell pepper until softened.",
      "Make the sauce mixture. In a mixing bowl, combine the cream of mushroom soup, diced tomatoes, chicken broth, sautéed vegetables, and shredded chicken. Mix thoroughly.",
      "Layer the casserole. Place a layer of tortilla pieces in a baking dish. Add a layer of chicken mixture and sprinkle cheese on top. Repeat the layers until all ingredients are used.",
      "Bake the casserole. Preheat the oven to 175°C (350°F). Bake for 30–35 minutes or until bubbly and golden.",
      "Cool slightly. Remove the dish from the oven and allow it to rest for a few minutes.",
      "Serve. Cut into portions and serve while warm."
    ]
  }
];

export const levels: Level[] = [
  {
    id: 1, title: 'Level 1: Soups & Sauces',
    subtitle: 'Beginner Stage — Mother Sauces & Soups',
    recipes: [1, 2, 3, 4, 5, 6, 7, 8],
    requirement: 'Complete all recipes with minimum 70% average score',
    minScore: 70, image: '/assets/levels/level1/soups.jpg',
  },
  {
    id: 2, title: 'Level 2: Filipino Basic',
    subtitle: 'Easy Filipino Cooking',
    recipes: [9, 10, 11],
    requirement: 'Complete all recipes with minimum 75% average score',
    minScore: 75, image: '/assets/levels/level2/filipino-basic.jpg',
  },
  {
    id: 3, title: 'Level 3: Intermediate',
    subtitle: 'Intermediate Filipino Cuisine',
    recipes: [12, 13, 14, 15],
    requirement: 'Complete all recipes with minimum 80% average score',
    minScore: 80, image: '/assets/levels/level3/intermediate.jpg',
  },
  {
    id: 4, title: 'Level 4: Advanced',
    subtitle: 'Advanced Culinary Challenge',
    recipes: [16, 17, 18, 19],
    requirement: 'Complete all recipes with minimum 85% average score',
    minScore: 85, image: '/assets/levels/level4/advanced.jpg',
  },
]

export const getRecipesByLevel  = (levelId: number): Recipe[]        => recipes.filter(r => r.level === levelId)
export const getRecipeById      = (id: number): Recipe | undefined   => recipes.find(r => r.id === id)
export const getCategoriesInLevel = (levelId: number): string[]      => [...new Set(recipes.filter(r => r.level === levelId).map(r => r.category))]
