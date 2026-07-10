import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { recipes } from '../data/recipes'
import { findIngredientLocation, matchesIngredient } from '../data/ingredients'
import type {
  Recipe,
  Level,
  Ingredient,
  RequiredIngredient,
  Scores,
  Grade,
  HeatLevel,
  CuttingTechnique,
  CookwareType,
  StationName,
  PreparationTask,
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
  currentPreparationTask: PreparationTask | null
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
  heatLevel: HeatLevel
  cookingTimer: number
  cookingDuration: number
  cookingIngredients: Ingredient[]
  isCooking: boolean
  burnedFood: boolean
  undercookedFood: boolean
  stirCount: number
  requiredStirs: number
  selectedCookware: CookwareType | null
  cookingStartTime: number | null
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
  startPreparationTask: (task: PreparationTask) => void
  washIngredient: (name: string) => void
  sliceIngredient: (name: string, technique: CuttingTechnique) => void
  measureIngredient: (name: string, amount: number, accuracy: number) => void
  detectUnsafeCutting: (unsafe: boolean) => void
  setExpectedCutType: (ingredient: string, cut: CuttingTechnique) => void
  setActualCutType: (ingredient: string, cut: CuttingTechnique) => void

  // Cooking
  setHeatLevel: (level: HeatLevel) => void
  setCookingTimer: (time: number) => void
  setCookingDuration: (duration: number) => void
  startCooking: () => void
  stopCooking: () => void
  addCookingIngredient: (ingredient: Ingredient) => void
  incrementStirCount: () => void
  setBurnedFood: (burned: boolean) => void
  setUndercookedFood: (undercooked: boolean) => void
  setSelectedCookware: (cookware: CookwareType | null) => void
  setCookingElapsedTime: (time: number) => void

  // Scoring
  calculateScores: () => { totalScore: number; starRating: number; grade: Grade }

  // Progression
  saveRecipeProgress: (recipeId: number, score: number, stars: number) => void
  saveLevelProgress: (levelId: number, score: number) => void
  markToolViewed: (toolId: number) => void
  isAllToolsViewed: () => boolean

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
  currentPreparationTask: null,
  washingProgress: {},
  cuttingProgress: {},
  measuringProgress: {},
  cuttingTechnique: null,
  unsafeCuttingDetected: false,
  safetyWarnings: 0,
  expectedCutType: {},
  actualCutType: {},
  heatLevel: 'off',
  cookingTimer: 0,
  cookingDuration: 0,
  cookingIngredients: [],
  isCooking: false,
  burnedFood: false,
  undercookedFood: false,
  stirCount: 0,
  requiredStirs: 5,
  selectedCookware: null,
  cookingStartTime: null,
  cookingElapsedTime: 0,
  scores: { accuracy: 0, washing: 0, cutting: 0, cooking: 0, timing: 0 },
  totalScore: 0,
  starRating: 0,
  grade: null,
  feedbackMessages: [],
  currentFeedback: null,
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
          requiredIngredients: recipe.ingredients.map((name, i) => ({
            id: i + 1,
            name,
            collected: false,
            location: findIngredientLocation(name),
          })),
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
              matchesIngredient(ingredient.name, r.name) ? { ...r, collected: false } : r,
            ),
            currentFeedback: { message: `${ingredient.name} removed`, type: 'info' },
          }))
          return false
        }

        // Check if required
        const required = state.requiredIngredients.find(
          (r) => !r.collected && matchesIngredient(ingredient.name, r.name),
        )

        if (required) {
          set((s) => ({
            requiredIngredients: s.requiredIngredients.map((r) =>
              matchesIngredient(ingredient.name, r.name) ? { ...r, collected: true } : r,
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
      startPreparationTask: (task) => set({ currentPreparationTask: task }),

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
            cuttingProgress: { ...s.cuttingProgress, [name]: { technique, progress: 100 } },
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
      setCookingTimer: (time) => set({ cookingTimer: time }),
      setCookingDuration: (duration) => set({ cookingDuration: duration }),
      startCooking: () => set({ isCooking: true, cookingStartTime: Date.now() }),
      stopCooking: () => set({ isCooking: false }),
      addCookingIngredient: (ingredient) =>
        set((s) => ({ cookingIngredients: [...s.cookingIngredients, ingredient] })),
      incrementStirCount: () => set((s) => ({ stirCount: s.stirCount + 1 })),
      setBurnedFood: (burned) => set({ burnedFood: burned }),
      setUndercookedFood: (undercooked) => set({ undercookedFood: undercooked }),
      setSelectedCookware: (cookware) => set({ selectedCookware: cookware }),
      setCookingElapsedTime: (time) => set({ cookingElapsedTime: time }),

      // ---- Scoring ----
      calculateScores: () => {
        const s = get()

        const totalRequired = s.requiredIngredients.length
        const correctCount = s.collectedIngredients.length
        const accuracy = totalRequired > 0 ? (correctCount / totalRequired) * 100 : 0

        const washReq = s.requiredIngredients.length
        const washed = s.washedIngredients.length
        const washing = washReq > 0 ? (washed / washReq) * 100 : 0

        let correctCuts = 0
        let totalCuts = 0
        for (const ing in s.expectedCutType) {
          totalCuts++
          if (s.actualCutType[ing] === s.expectedCutType[ing]) correctCuts++
        }
        const cutting = totalCuts > 0 ? (correctCuts / totalCuts) * 100 : 0

        let cooking = 100
        if (s.burnedFood) cooking = 0
        else if (s.undercookedFood) cooking = 50

        let timing = 100
        if (s.cookingDuration > 0) {
          const diff = Math.abs(s.cookingElapsedTime - s.cookingDuration)
          timing = Math.max(0, 100 - (diff / s.cookingDuration) * 100)
        }

        const total = accuracy * 0.3 + washing * 0.15 + cutting * 0.2 + cooking * 0.25 + timing * 0.1
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
          scores: { accuracy, washing, cutting, cooking, timing },
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

          // Unlock next recipe
          const recipe = recipes.find((r) => r.id === recipeId)
          const newUnlocked = [...s.unlockedRecipes]
          if (recipe) {
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

          return {
            recipeMastery: { ...s.recipeMastery, [recipeId]: newMastery },
            playerProfile: newProfile,
            unlockedRecipes: newUnlocked,
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
