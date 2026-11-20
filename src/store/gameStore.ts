import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { recipes } from '../data/recipes'
import { findIngredientLocation, matchesIngredient, resolveIngredientByName } from '../data/ingredients'
import type { CuttingTechnique, GameStore, Grade } from '../constant/types'
import type { GameState, RecipeMasteryData, SOPResultSummary } from '../constant/interface'
// The store shape itself now lives with the other interfaces, in
// constant/interface (GameState, GameActions) and constant/types (GameStore).

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
  cookedIngredients: [],
  chronologicalOrderMistakes: 0,
  selectedKnifeId: null,
  inventoryToolIds: [],
  // SOP Compliance
  sopCompliance: {},
  cookwareMatchScore: 100,
  flameCenteringScore: 100,
  knifeStabilityScore: 100,
  cutUniformityScore: 100,
  washThoroughnessScore: 100,
  ingredientDropScore: 100,
  sopResults: [],
  lastDropTimestamp: 0,
  flameCenteringChecks: 0,
  flameCenteringResponses: 0,
  stabilizedIngredients: [],
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
        // Seed the "expected cut" for each ingredient the recipe says to cut,
        // so Cutting Technique can actually be scored (otherwise it was always 100%).
        const expectedCutType: Record<string, CuttingTechnique> = {}
        if (recipe.cutInstructions) {
          for (const [ingName, info] of Object.entries(recipe.cutInstructions)) {
            const resolved = resolveIngredientByName(ingName)
            expectedCutType[resolved?.name ?? ingName] = info.technique
          }
        }
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
          washedIngredients: [],
          slicedIngredients: [],
          measuredIngredients: [],
          cookedIngredients: [],
          chronologicalOrderMistakes: 0,
          expectedCutType,
          actualCutType: {},
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
        // Re-measuring must OVERWRITE the previous value. Bailing out when the
        // ingredient was already measured made the "tap to edit" flow a no-op:
        // the modal closed and the old (possibly wrong) amount stayed on record.
        set((s) => ({
          measuredIngredients: s.measuredIngredients.includes(name)
            ? s.measuredIngredients
            : [...s.measuredIngredients, name],
          measuringProgress: { ...s.measuringProgress, [name]: { amount, accuracy } },
        }))
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
      setCookedIngredients: (ingredients) => set({ cookedIngredients: ingredients }),
      recordChronologicalMistake: () => set((s) => ({ chronologicalOrderMistakes: s.chronologicalOrderMistakes + 1 })),

      // ---- SOP Compliance ----
      setCookwareMatch: (score) => set({ cookwareMatchScore: score }),
      setFlameCentering: (score) => set({ flameCenteringScore: score }),
      setKnifeStability: (score) => set({ knifeStabilityScore: score }),
      setCutUniformity: (score) => set({ cutUniformityScore: score }),
      setWashThoroughness: (score) => set({ washThoroughnessScore: score }),
      setIngredientDropScore: (score) => set({ ingredientDropScore: score }),
      recordSopCompliance: (sopId, followed, details) =>
        set(s => ({
          sopCompliance: { ...s.sopCompliance, [sopId]: { followed, details } },
        })),
      recordLastDropTimestamp: (ts) => set({ lastDropTimestamp: ts }),
      recordFlameCenteringCheck: () => set(s => ({ flameCenteringChecks: s.flameCenteringChecks + 1 })),
      recordFlameCenteringResponse: () => set(s => ({ flameCenteringResponses: s.flameCenteringResponses + 1 })),
      addStabilizedIngredient: (name) => set(s => ({
        stabilizedIngredients: s.stabilizedIngredients.includes(name)
          ? s.stabilizedIngredients
          : [...s.stabilizedIngredients, name],
      })),

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
        let washing = washableRequired.length > 0
          ? (washedCount / washableRequired.length) * 100
          : 100   // no washable ingredients → full marks

        // ── Cutting technique (STRICT): the denominator is every ingredient the
        //    recipe REQUIRES to be cut (keys of expectedCutType). An ingredient that
        //    should have been cut but wasn't scores 0; a wrong technique scores half.
        //    This stops players from passing while leaving required ingredients unsliced. ──
        const expectedCutNames = Object.keys(s.expectedCutType)
        let cutting: number
        if (expectedCutNames.length > 0) {
          let cutPoints = 0
          for (const name of expectedCutNames) {
            const expected = s.expectedCutType[name]
            // find the player's actual cut for this ingredient (name-tolerant)
            const actualKey = Object.keys(s.actualCutType).find(
              k => k === name || matchesIngredient(k, name),
            )
            const actual = actualKey ? s.actualCutType[actualKey] : undefined
            if (!actual) cutPoints += 0           // required cut not performed
            else if (actual === expected) cutPoints += 1
            else cutPoints += 0.5                 // cut, but wrong technique
          }
          cutting = (cutPoints / expectedCutNames.length) * 100
        } else {
          // Recipe has no required cuts — credit any cuts the player did make.
          cutting = 100
        }

        // ── Measuring accuracy (STRICT where the game enforces measuring).
        //    Levels 1–2 require measuring every ingredient before cooking, so un-measured
        //    or inaccurate measurements are penalized (denominator = all required).
        //    Higher levels that never engaged measuring are not punished for it. ──
        const enforcesMeasuring = (s.selectedRecipe?.level ?? 1) <= 2
        const anyMeasured = Object.keys(s.measuringProgress).length > 0
        let measuring: number
        if ((enforcesMeasuring || anyMeasured) && s.requiredIngredients.length > 0) {
          let measureSum = 0
          for (const req of s.requiredIngredients) {
            const entry = s.measuringProgress[req.name]
              ?? (Object.entries(s.measuringProgress).find(([k]) => matchesIngredient(k, req.name))?.[1])
            measureSum += entry ? entry.accuracy : 0
          }
          measuring = measureSum / s.requiredIngredients.length
        } else {
          measuring = 100
        }

        let cooking = 100
        if (s.burnedFood) cooking = 0
        else if (s.undercookedFood) cooking = 50

        // ── Cooking Ingredient Completeness (Major Impact) ──
        // Only ingredients that actually needed to be cooked in the pot
        const totalCookReq = s.requiredIngredients.length
        if (totalCookReq > 0) {
          const cookedMatchCount = s.requiredIngredients.filter(req =>
            s.cookedIngredients.some(c => matchesIngredient(c, req.name))
          ).length

          // Missing ingredients severely penalize the cooking score
          const ingredientCookingRatio = cookedMatchCount / totalCookReq
          cooking = cooking * ingredientCookingRatio
        }

        // ── Chronological / Sequence Mistakes (Minor Deduction) ──
        // Deduct 5 points per order mistake (capped so it won't drop below 0)
        if (s.chronologicalOrderMistakes > 0) {
          const orderPenalty = Math.min(25, s.chronologicalOrderMistakes * 5)
          cooking = Math.max(0, cooking - orderPenalty)
        }

        // Timing: how close the player's cook time was to the recipe's target.
        // `s.cookingDuration` is never populated by any screen, so this always fell
        // through to a free 100. Fall back to the recipe's own cookingDuration.
        const targetDuration = s.cookingDuration > 0
          ? s.cookingDuration
          : (s.selectedRecipe?.cookingDuration ?? 0)
        let timing = 100
        if (targetDuration > 0) {
          const diff = Math.abs(s.cookingElapsedTime - targetDuration)
          timing = Math.max(0, 100 - (diff / targetDuration) * 100)
        }

        // ── SOP Compliance multipliers (0.8× to 1.0×) ──
        // SOP 3: Washing thoroughness affects washing score
        const washMultiplier = 0.8 + (s.washThoroughnessScore / 100) * 0.2
        washing = washing * washMultiplier

        // SOP 2: Knife stability + cut uniformity affects cutting score
        const cutMultiplier = 0.8 + (((s.knifeStabilityScore + s.cutUniformityScore) / 200) * 0.2)
        cutting = cutting * cutMultiplier

        // SOP 1 & 4: Cookware match + flame centering + careful drops affects cooking
        const cookMultiplier = 0.8 + (((s.cookwareMatchScore + s.flameCenteringScore + s.ingredientDropScore) / 300) * 0.2)
        cooking = cooking * cookMultiplier

        // Build SOP results summary for the results screen
        const sopResults: SOPResultSummary[] = [
          {
            sopId: 'sop1-cookware-alignment',
            title: 'Cookware & Stove Alignment',
            status: s.cookwareMatchScore >= 80 ? 'pass' : s.cookwareMatchScore >= 50 ? 'warn' : 'fail',
            feedback: s.cookwareMatchScore >= 80
              ? 'Correct cookware selected for the recipe'
              : s.cookwareMatchScore >= 50
                ? 'Cookware could be better suited for the recipe'
                : 'Incorrect cookware selected',
          },
          {
            sopId: 'sop2-knife-safety',
            title: 'Knife Safety & Preparation',
            status: s.knifeStabilityScore >= 80 ? 'pass' : s.knifeStabilityScore >= 50 ? 'warn' : 'fail',
            feedback: s.knifeStabilityScore >= 80
              ? 'Vegetables properly stabilized before cutting'
              : s.knifeStabilityScore >= 50
                ? 'Some ingredients were not stabilized before cutting'
                : 'Ingredients were cut without proper stabilization — unsafe!',
          },
          {
            sopId: 'sop3-washing',
            title: 'Washing & Sanitation',
            status: s.washThoroughnessScore >= 80 ? 'pass' : s.washThoroughnessScore >= 50 ? 'warn' : 'fail',
            feedback: s.washThoroughnessScore >= 80
              ? 'All vegetables washed thoroughly with full immersion'
              : s.washThoroughnessScore >= 50
                ? 'Some larger vegetables were not washed thoroughly enough'
                : 'Vegetables were not properly immersed during washing',
          },
          {
            sopId: 'sop4-cooking-execution',
            title: 'Cooking Execution',
            status: s.ingredientDropScore >= 80 && s.flameCenteringScore >= 80 ? 'pass'
              : s.ingredientDropScore >= 50 && s.flameCenteringScore >= 50 ? 'warn' : 'fail',
            feedback: s.ingredientDropScore >= 80 && s.flameCenteringScore >= 80
              ? 'Ingredients added carefully and flame was properly monitored'
              : s.ingredientDropScore < 50
                ? 'Ingredients were added too haphazardly — be more deliberate!'
                : 'Flame was not monitored closely enough during cooking',
          },
        ]

        // Weights (must match the rows shown in ResultsScreen):
        // accuracy 15%, washing 10%, cutting 20%, measuring 15%, cooking 30%, timing 10%
        const total = accuracy * 0.15 + washing * 0.10 + cutting * 0.20 + measuring * 0.15 + cooking * 0.30 + timing * 0.10
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
          sopResults,
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
              const allCats = [...new Set(recipes.filter((r) => r.level === recipe.level).map((r) => r.category))]
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
      resetGame: (keepRecipe?: boolean) => {
        const s = get()
        if (keepRecipe && s.selectedRecipe) {
          const r = s.selectedRecipe
          const l = s.selectedLevel
          set({
            ...initialSessionState,
            selectedRecipe: r,
            selectedLevel: l,
          })
          get().initializeIngredients(r)
        } else {
          set(initialSessionState)
        }
      },

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