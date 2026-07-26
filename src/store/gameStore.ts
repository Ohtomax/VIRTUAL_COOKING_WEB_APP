import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { recipes } from '../data/recipes'
import { findIngredientLocation, matchesIngredient, resolveIngredientByName } from '../data/ingredients'
import type {
  Recipe,
  Level,
  Ingredient,
  RequiredIngredient,
  Scores,
  Grade,
  HeatLevel,
  CuttingTechnique,
  StationName,
  FeedbackType,
  FeedbackMessage,
  CurrentFeedback,
  RecipeMasteryData,
  LevelProgressData,
  PlayerProfile,
  GamePhase,
} from '../types'

// ==========================================
// Store State Shape
// ==========================================
interface GameState {
  // Navigation
  currentPhase: GamePhase

  // Selection
  selectedLevel: Level | null
  selectedRecipe: Recipe | null

  // Ingredient Selection
  collectedIngredients: Ingredient[]
  selectedIngredients: Ingredient[]
  requiredIngredients: RequiredIngredient[]
  ingredientErrors: number

  // Preparation
  washedIngredients: string[]
  slicedIngredients: string[]
  measuredIngredients: string[]
  washingProgress: Record<string, number>
  cuttingProgress: Record<string, { technique: CuttingTechnique; progress: number }>
  measuringProgress: Record<string, { amount: number; accuracy: number }>

  // Cutting
  cuttingTechnique: CuttingTechnique | null
  unsafeCuttingDetected: boolean
  safetyWarnings: number
  expectedCutType: Record<string, CuttingTechnique>
  actualCutType: Record<string, CuttingTechnique>

  // Cooking
  isChallengeMode: boolean
  heatLevel: HeatLevel
  cookingDuration: number
  isCooking: boolean
  burnedFood: boolean
  undercookedFood: boolean
  stirCount: number
  requiredStirs: number
  cookingElapsedTime: number

  // Scoring
  scores: Scores
  totalScore: number
  starRating: number
  grade: Grade | null

  // Feedback
  feedbackMessages: FeedbackMessage[]
  currentFeedback: CurrentFeedback | null

  // Progression (persisted)
  recipeMastery: Record<number, RecipeMasteryData>
  levelProgress: Record<number, LevelProgressData>
  unlockedRecipes: number[]
  unlockedLevels: number[]
  playerProfile: PlayerProfile
  toolsViewed: number[]
  selectedKnifeId: string | null  // knife chosen from cabinet
  inventoryToolIds: string[]       // all tools picked from cabinet
}

// ==========================================
// Store Actions
// ==========================================
interface GameActions {
  // Phase
  setPhase: (phase: GamePhase) => void
  setSelectedLevel: (level: Level | null) => void
  setSelectedRecipe: (recipe: Recipe | null) => void

  // Ingredients
  initializeIngredients: (recipe: Recipe) => void
  selectIngredient: (ingredient: Ingredient) => boolean

  // Preparation
  washIngredient: (name: string) => void
  sliceIngredient: (name: string, technique: CuttingTechnique) => void
  measureIngredient: (name: string, amount: number, accuracy: number) => void
  detectUnsafeCutting: (unsafe: boolean) => void
  setExpectedCutType: (ingredient: string, cut: CuttingTechnique) => void
  setActualCutType: (ingredient: string, cut: CuttingTechnique) => void

  // Cooking
  setHeatLevel: (level: HeatLevel) => void
  setCookingDuration: (duration: number) => void
  startCooking: () => void
  stopCooking: () => void
  incrementStirCount: () => void
  setBurnedFood: (burned: boolean) => void
  setUndercookedFood: (undercooked: boolean) => void
  setCookingElapsedTime: (time: number) => void

  // Scoring
  calculateScores: () => { totalScore: number; starRating: number; grade: Grade }

  // Progression
  saveRecipeProgress: (recipeId: number, score: number, stars: number) => void
  saveLevelProgress: (levelId: number, score: number) => void
  markToolViewed: (toolId: number) => void
  isAllToolsViewed: () => boolean
  setSelectedKnife: (id: string | null) => void
  addInventoryTool: (id: string) => void
  removeInventoryTool: (id: string) => void

  // Feedback
  addFeedback: (message: string, type: FeedbackType) => void
  clearFeedback: () => void

  // Reset
  resetGame: () => void
  resetAll: () => void
}

type GameStore = GameState & GameActions

// ==========================================
// Initial per-session state (not persisted)
// ==========================================
const initialSessionState: Omit<
  GameState,
  'recipeMastery' | 'levelProgress' | 'unlockedRecipes' | 'unlockedLevels' | 'playerProfile' | 'toolsViewed'
> = {
  currentPhase: 'menu',
  selectedLevel: null,
  selectedRecipe: null,
  collectedIngredients: [],
  selectedIngredients: [],
  requiredIngredients: [],
  ingredientErrors: 0,
  washedIngredients: [],
  slicedIngredients: [],
  measuredIngredients: [],
  washingProgress: {},
  cuttingProgress: {},
  measuringProgress: {},
  cuttingTechnique: null,
  unsafeCuttingDetected: false,
  safetyWarnings: 0,
  expectedCutType: {},
  actualCutType: {},
  heatLevel: 'off',
  cookingDuration: 0,
  isCooking: false,
  burnedFood: false,
  undercookedFood: false,
  stirCount: 0,
  requiredStirs: 5,
  cookingElapsedTime: 0,
  selectedKnifeId: null,
  inventoryToolIds: [],
  scores: { accuracy: 0, washing: 0, cutting: 0, measuring: 0, cooking: 0, timing: 0 },
  totalScore: 0,
  starRating: 0,
  grade: null,
  feedbackMessages: [],
  currentFeedback: null,
  isChallengeMode: false
}

// ==========================================
// Store
// ==========================================
const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialSessionState,

      // Persisted defaults
      recipeMastery: {},
      levelProgress: {},
      unlockedRecipes: [1],
      unlockedLevels: [1], // FIX: only level 1 unlocked initially
      playerProfile: { totalScore: 0, recipesCompleted: 0, currentLevel: 1, achievementBadges: [] },
      toolsViewed: [],

      // ---- Phase ----
      setPhase: (phase) => set({ currentPhase: phase }),
      setSelectedLevel: (level) => set({ selectedLevel: level }),
      setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),

      // ---- Ingredients ----
      initializeIngredients: (recipe) => {
        set({
          requiredIngredients: recipe.ingredients.map((name, i) => {
            const resolved = resolveIngredientByName(name)
            return {
              id: i + 1,
              name: resolved?.name ?? name,     // show the fridge display name
              collected: false,
              location: findIngredientLocation(name),
              ingredientId: resolved?.id,        // ID-based matching
              image: resolved?.image,            // image-based display
            }
          }),
          collectedIngredients: [],
          selectedIngredients: [],
          ingredientErrors: 0,
        })
      },

      selectIngredient: (ingredient) => {
        const state = get()

        // Toggle off if already selected
        const alreadySelected = state.selectedIngredients.find((i) => i.id === ingredient.id)
        if (alreadySelected) {
          set((s) => ({
            selectedIngredients: s.selectedIngredients.filter((i) => i.id !== ingredient.id),
            collectedIngredients: s.collectedIngredients.filter((i) => i.id !== ingredient.id),
            requiredIngredients: s.requiredIngredients.map((r) =>
              (r.ingredientId === ingredient.id || matchesIngredient(ingredient.name, r.name))
                ? { ...r, collected: false } : r,
            ),
            currentFeedback: { message: `${ingredient.name} removed`, type: 'info' },
          }))
          return false
        }

        // No recipe loaded → free exploration: collect anything
        if (state.requiredIngredients.length === 0) {
          set((s) => ({
            collectedIngredients: [...s.collectedIngredients, ingredient],
            selectedIngredients: [...s.selectedIngredients, ingredient],
            currentFeedback: { message: `${ingredient.name} added!`, type: 'success' },
          }))
          return true
        }

        // Check if required — ID match first (exact image+name pair), name fallback
        const required = state.requiredIngredients.find(
          (r) => !r.collected &&
            (r.ingredientId === ingredient.id || matchesIngredient(ingredient.name, r.name)),
        )

        if (required) {
          set((s) => ({
            requiredIngredients: s.requiredIngredients.map((r) =>
              r.id === required.id ? { ...r, collected: true } : r,
            ),
            collectedIngredients: [...s.collectedIngredients, ingredient],
            selectedIngredients: [...s.selectedIngredients, ingredient],
            currentFeedback: { message: `${ingredient.name} added to recipe!`, type: 'success' },
          }))
          return true
        }

        // Wrong ingredient
        set((s) => ({
          ingredientErrors: s.ingredientErrors + 1,
          selectedIngredients: [...s.selectedIngredients, ingredient],
          currentFeedback: { message: `${ingredient.name} is not in this recipe!`, type: 'error' },
        }))
        return false
      },

      // ---- Preparation ----

      washIngredient: (name) => {
        set((s) => {
          if (s.washedIngredients.includes(name)) return s
          return {
            washedIngredients: [...s.washedIngredients, name],
            washingProgress: { ...s.washingProgress, [name]: 100 },
          }
        })
      },

      sliceIngredient: (name, technique) => {
        set((s) => {
          if (s.slicedIngredients.includes(name)) return s
          return {
            slicedIngredients: [...s.slicedIngredients, name],
            cuttingProgress:   { ...s.cuttingProgress, [name]: { technique, progress: 100 } },
            // Record what the player actually chose — scoring compares this vs expectedCutType
            actualCutType: { ...s.actualCutType, [name]: technique },
          }
        })
      },

      measureIngredient: (name, amount, accuracy) => {
        set((s) => {
          if (s.measuredIngredients.includes(name)) return s
          return {
            measuredIngredients: [...s.measuredIngredients, name],
            measuringProgress: { ...s.measuringProgress, [name]: { amount, accuracy } },
          }
        })
      },

      detectUnsafeCutting: (unsafe) => {
        if (unsafe) {
          set((s) => ({
            unsafeCuttingDetected: true,
            safetyWarnings: s.safetyWarnings + 1,
            currentFeedback: {
              message: 'Unsafe slicing detected! In real-life, this may cause injury.',
              type: 'warning',
            },
          }))
        } else {
          set({ unsafeCuttingDetected: false })
        }
      },

      setExpectedCutType: (ingredient, cut) =>
        set((s) => ({ expectedCutType: { ...s.expectedCutType, [ingredient]: cut } })),

      setActualCutType: (ingredient, cut) =>
        set((s) => ({ actualCutType: { ...s.actualCutType, [ingredient]: cut } })),

      // ---- Cooking ----
      setHeatLevel: (level) => set({ heatLevel: level }),
      setCookingDuration: (duration) => set({ cookingDuration: duration }),
      startCooking: () => set({ isCooking: true }),
      stopCooking: () => set({ isCooking: false }),
      incrementStirCount: () => set((s) => ({ stirCount: s.stirCount + 1 })),
      setBurnedFood: (burned) => set({ burnedFood: burned }),
      setUndercookedFood: (undercooked) => set({ undercookedFood: undercooked }),
      setCookingElapsedTime: (time) => set({ cookingElapsedTime: time }),

      // ---- Scoring ----
      calculateScores: () => {
        const s = get()

        // ── Ingredient accuracy: correct collected vs total required ──
        const totalRequired = s.requiredIngredients.length
        // Only count ingredients that were actually required AND collected
        const correctlyCollected = s.collectedIngredients.filter(ci =>
          s.requiredIngredients.some(r =>
            r.ingredientId === ci.id || r.name.toLowerCase() === ci.name.toLowerCase()
          )
        ).length
        const accuracy = totalRequired > 0
          ? Math.min(100, (correctlyCollected / totalRequired) * 100)
          : 100

        // ── Washing score: skip non-washable items entirely ──
        // isWashable imported below via resolveIngredientByName check
        const washableRequired = s.requiredIngredients.filter(r => {
          // mark as washable if their id is NOT in the pantry set
          const NON_WASH = new Set(['butter','cream','milk','eggyolks','lemonjuice',
            'liverspread','shreddedcheese','cheese','creammushroom','chickenshredded',
            'boiledegg','hotdog','bagoongalamang','groundpork','picklesrelish',
            'beefstock','chickenbroth','vegetablesbroth','cookingoil','oliveoil',
            'flour','cornstarch','pepper','salt','peppercorn','soysauce','vinegar',
            'tomatopaste','tomatosauce','sinigangmix','peanutbutter','corntortillas',
            'pasta','spagsauce','eggnoodles','water'])
          return !NON_WASH.has(r.ingredientId ?? '')
        })
        const washedCount = washableRequired.filter(r =>
          s.washedIngredients.includes(r.name)
        ).length
        const washing = washableRequired.length > 0
          ? (washedCount / washableRequired.length) * 100
          : 100   // no washable ingredients → full marks

        // ── Cutting technique: award points for EVERY sliced ingredient.
        //    expectedCutType may be empty (no recipe hints), so any cut = 100.
        //    If expected is set, compare to player's actual choice. ──
        const slicedNames = s.slicedIngredients
        let correctCuts = 0
        let totalCuts = slicedNames.length   // one point per sliceable ingredient

        if (totalCuts > 0) {
          for (const name of slicedNames) {
            const expected = s.expectedCutType[name]
            const actual   = s.actualCutType[name]
            if (!expected || !actual) {
              // No expected type set → award full credit for cutting it at all
              correctCuts++
            } else if (actual === expected) {
              correctCuts++
            }
            // else wrong technique → 0 for this ingredient (but still made the cut, no penalty below 0)
          }
        }
        const cutting = totalCuts > 0 ? (correctCuts / totalCuts) * 100 : 100

        // ── Measuring accuracy: average of all measured ingredient accuracies ──
        const measureEntries = Object.values(s.measuringProgress) as { amount: number; accuracy: number }[]
        const measuring = measureEntries.length > 0
          ? measureEntries.reduce((sum, m) => sum + m.accuracy, 0) / measureEntries.length
          : 100

        let cooking = 100
        if (s.burnedFood) cooking = 0
        else if (s.undercookedFood) cooking = 50

        let timing = 100
        if (s.cookingDuration > 0) {
          const diff = Math.abs(s.cookingElapsedTime - s.cookingDuration)
          timing = Math.max(0, 100 - (diff / s.cookingDuration) * 100)
        }

        // If no washable ingredients, washing is 100% (full marks) and weight stays
        // This keeps the formula stable regardless of ingredient composition
        const total = accuracy * 0.25 + washing * 0.15 + cutting * 0.15 + measuring * 0.10 + cooking * 0.25 + timing * 0.10
        const rounded = Math.round(total)

        let starRating = 0
        if (rounded >= 95) starRating = 3
        else if (rounded >= 80) starRating = 2
        else if (rounded >= 70) starRating = 1

        let grade: Grade = 'D'
        if (rounded >= 97) grade = 'A+'
        else if (rounded >= 93) grade = 'A'
        else if (rounded >= 90) grade = 'A-'
        else if (rounded >= 87) grade = 'B+'
        else if (rounded >= 83) grade = 'B'
        else if (rounded >= 80) grade = 'B-'
        else if (rounded >= 77) grade = 'C+'
        else if (rounded >= 73) grade = 'C'
        else if (rounded >= 70) grade = 'C-'

        set({
          scores: { accuracy, washing, cutting, measuring, cooking, timing },
          totalScore: rounded,
          starRating,
          grade,
        })

        return { totalScore: rounded, starRating, grade }
      },

      // ---- Progression ----
      saveRecipeProgress: (recipeId, score, stars) => {
        set((s) => {
          const prev = s.recipeMastery[recipeId]
          const newMastery: RecipeMasteryData = {
            completed: true,
            bestScore: Math.max(prev?.bestScore ?? 0, score),
            stars: Math.max(prev?.stars ?? 0, stars),
            masteryPercentage: score,
          }

          const newProfile = {
            ...s.playerProfile,
            totalScore: s.playerProfile.totalScore + score,
            recipesCompleted: s.playerProfile.recipesCompleted + (prev?.completed ? 0 : 1),
          }

          // Unlock next recipe — only when minimum score is reached (game narrative rule)
          const recipe = recipes.find((r) => r.id === recipeId)
          const newUnlocked = [...s.unlockedRecipes]
          const passedMinScore = score >= (recipe?.minScore ?? 70)
          if (recipe && passedMinScore) {
            const sameCategory = recipes
              .filter((r) => r.level === recipe.level && r.category === recipe.category)
              .sort((a, b) => a.id - b.id)

            const idx = sameCategory.findIndex((r) => r.id === recipeId)
            if (idx >= 0 && idx < sameCategory.length - 1) {
              const next = sameCategory[idx + 1]
              if (!newUnlocked.includes(next.id)) newUnlocked.push(next.id)
            } else {
              // Category done — unlock next category or next level
              const allCats = [...new Set(recipes.filter((r) => r.level === recipe.level).map((r) => r.category))].sort()
              const catIdx = allCats.indexOf(recipe.category)
              if (catIdx === allCats.length - 1) {
                const nextLevelRecipes = recipes.filter((r) => r.level === recipe.level + 1).sort((a, b) => a.id - b.id)
                if (nextLevelRecipes.length > 0 && !newUnlocked.includes(nextLevelRecipes[0].id)) {
                  newUnlocked.push(nextLevelRecipes[0].id)
                }
              } else {
                const nextCat = allCats[catIdx + 1]
                const nextCatRecipes = recipes
                  .filter((r) => r.level === recipe.level && r.category === nextCat)
                  .sort((a, b) => a.id - b.id)
                if (nextCatRecipes.length > 0 && !newUnlocked.includes(nextCatRecipes[0].id)) {
                  newUnlocked.push(nextCatRecipes[0].id)
                }
              }
            }
          }

          // ── Level completion check (auto) ──
          // A level is complete when EVERY recipe in it is completed with min score.
          const allMastery = { ...s.recipeMastery, [recipeId]: newMastery }
          const newLevels = [...s.unlockedLevels]
          const newLevelProgress = { ...s.levelProgress }
          if (recipe) {
            const levelRecipes = recipes.filter((r) => r.level === recipe.level)
            const doneRecipes = levelRecipes.filter((r) => {
              const m = allMastery[r.id]
              return m?.completed && m.bestScore >= (r.minScore ?? 70)
            })
            const avg = doneRecipes.length
              ? Math.round(doneRecipes.reduce((sum, r) => sum + (allMastery[r.id]?.bestScore ?? 0), 0) / doneRecipes.length)
              : 0
            const levelDone = doneRecipes.length === levelRecipes.length

            newLevelProgress[recipe.level] = {
              completed: levelDone,
              averageScore: avg,
              recipesCompleted: doneRecipes.length,
            }

            // Unlock next level when this one is fully done
            if (levelDone) {
              const next = recipe.level + 1
              const nextExists = recipes.some((r) => r.level === next)
              if (nextExists && !newLevels.includes(next)) {
                newLevels.push(next)
                // Also unlock the first recipe of the next level
                const firstNext = recipes.filter((r) => r.level === next).sort((a, b) => a.id - b.id)[0]
                if (firstNext && !newUnlocked.includes(firstNext.id)) newUnlocked.push(firstNext.id)
              }
            }
          }

          return {
            recipeMastery: allMastery,
            playerProfile: newProfile,
            unlockedRecipes: newUnlocked,
            unlockedLevels: newLevels,
            levelProgress: newLevelProgress,
          }
        })
      },

      saveLevelProgress: (levelId, score) => {
        set((s) => {
          const prev = s.levelProgress[levelId] ?? { completed: false, averageScore: 0, recipesCompleted: 0 }
          const newCount = prev.recipesCompleted + 1
          const newAvg = (prev.averageScore * prev.recipesCompleted + score) / newCount

          const newLevels = [...s.unlockedLevels]
          const minScores: Record<number, number> = { 1: 80, 2: 85, 3: 90, 4: 95 }
          if (minScores[levelId] && newAvg >= minScores[levelId]) {
            const next = levelId + 1
            if (next <= 4 && !newLevels.includes(next)) newLevels.push(next)
          }

          return {
            levelProgress: {
              ...s.levelProgress,
              [levelId]: { completed: newCount >= (s.selectedLevel?.recipes.length ?? 0), averageScore: newAvg, recipesCompleted: newCount },
            },
            unlockedLevels: newLevels,
          }
        })
      },

      markToolViewed: (toolId) => {
        set((s) => {
          if (s.toolsViewed.includes(toolId)) return s
          return { toolsViewed: [...s.toolsViewed, toolId] }
        })
      },

      setSelectedKnife: (id) => set({ selectedKnifeId: id }),

      addInventoryTool: (id) => set(s => ({
        inventoryToolIds: s.inventoryToolIds.includes(id) ? s.inventoryToolIds : [...s.inventoryToolIds, id]
      })),

      removeInventoryTool: (id) => set(s => ({
        inventoryToolIds: s.inventoryToolIds.filter(t => t !== id),
        selectedKnifeId: s.selectedKnifeId === id ? null : s.selectedKnifeId,
      })),

      isAllToolsViewed: () => {
        const s = get()
        return s.toolsViewed.length >= 5 // 5 tool categories
      },

      // ---- Feedback ----
      addFeedback: (message, type) =>
        set((s) => ({
          feedbackMessages: [...s.feedbackMessages, { message, type, timestamp: Date.now() }],
          currentFeedback: { message, type },
        })),

      clearFeedback: () => set({ currentFeedback: null }),

      // ---- Resets ----
      resetGame: () => set(initialSessionState),

      resetAll: () =>
        set({
          ...initialSessionState,
          recipeMastery: {},
          levelProgress: {},
          unlockedRecipes: [1],
          unlockedLevels: [1],
          playerProfile: { totalScore: 0, recipesCompleted: 0, currentLevel: 1, achievementBadges: [] },
          toolsViewed: [],
        }),
    }),
    {
      name: 'cooking-game-storage',
      partialize: (state) => ({
        recipeMastery: state.recipeMastery,
        levelProgress: state.levelProgress,
        playerProfile: state.playerProfile,
        unlockedLevels: state.unlockedLevels,
        unlockedRecipes: state.unlockedRecipes,
        toolsViewed: state.toolsViewed,
      }),
    },
  ),
)

export default useGameStore

// ── INVENTORY EXTENSION (appended) ──────────────────────────────
// selectedKnife: the knife the player picked from cabinet
// inventoryTools: tools the player added to their inventory from cabinet