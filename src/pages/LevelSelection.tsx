import { useState } from 'react'
import { Lock, CheckCircle, Star, Clock, AlertCircle } from 'lucide-react'
import { levels, recipes, getCategoriesInLevel } from '../data/recipes'
import useGameStore from '../store/gameStore'
import type { SetScreenProps, Level, Recipe } from '../types'

export default function LevelSelection({ setScreen }: SetScreenProps) {
  const { setSelectedRecipe, setSelectedLevel, unlockedLevels, unlockedRecipes, recipeMastery, levelProgress } = useGameStore()
  const [activeLevel, setActiveLevel] = useState<Level | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const isLevelLocked = (id: number) => id !== 1 && !unlockedLevels.includes(id)
  const isRecipeUnlocked = (id: number) => unlockedRecipes.includes(id)
  const isRecipeCompleted = (id: number) => recipeMastery[id]?.completed ?? false

  const getLevelProgress = (levelId: number): number => {
    const level = levels.find((l) => l.id === levelId)
    if (!level) return 0
    const done = level.recipes.filter((rid) => recipeMastery[rid]?.completed).length
    return (done / level.recipes.length) * 100
  }

  const handleRecipeSelect = (recipe: Recipe) => {
    if (!isRecipeUnlocked(recipe.id)) return
    setSelectedRecipe(recipe)
    setScreen('recipe-card') // Go to recipe card page first (per narrative)
  }

  // ---- LEVEL GRID ----
  if (!activeLevel) {
    return (
      <div className="panel level-selection-panel">
        <button className="back-btn" onClick={() => setScreen('main-menu')}>← Back</button>
        <h1 className="level-title">Select Your Cooking Level</h1>

        <div className="level-grid">
          {levels.map((level) => {
            const locked = isLevelLocked(level.id)
            const progress = getLevelProgress(level.id)
            const completed = levelProgress[level.id]?.completed ?? false

            return (
              <div
                key={level.id}
                className={`level-card ${locked ? 'locked' : ''} ${completed ? 'completed' : ''}`}
                onClick={() => !locked && setActiveLevel(level)}
              >
                {locked && <div className="card-badge"><Lock size={20} /></div>}
                {completed && <div className="card-badge success"><CheckCircle size={20} /></div>}

                <div className="level-image-wrapper">
                  <img src={level.image} alt={level.title} className={`level-image ${locked ? 'grayscale' : ''}`} />
                </div>

                <div className="level-content">
                  <h2>{level.title}</h2>
                  <p className="level-subtitle">{level.subtitle}</p>

                  <div className="progress-track">
                    <div className="progress-track-bar" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="level-meta">
                    <span><Star size={14} /> Min {level.minScore}%</span>
                    <span><Clock size={14} /> {level.recipes.length} recipes</span>
                  </div>

                  <button className="level-start-btn" disabled={locked}>
                    {locked ? '🔒 Locked' : completed ? '✓ Completed' : 'Start Level'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ---- CATEGORY SELECTION (Level 1 has two categories) ----
  const categories = getCategoriesInLevel(activeLevel.id)
  if (categories.length > 1 && !activeCategory) {
    return (
      <div className="panel">
        <button className="back-btn" onClick={() => setActiveLevel(null)}>← Back</button>
        <h1 className="level-title">{activeLevel.title}</h1>
        <p className="level-subtitle">{activeLevel.subtitle}</p>

        <div className="requirement-box">
          <AlertCircle size={18} />
          <span>{activeLevel.requirement}</span>
        </div>

        <h2 className="section-heading">Select a Category</h2>

        <div className="category-grid">
          {categories.map((cat) => {
            const catRecipeIds = recipes.filter((r) => r.level === activeLevel.id && r.category === cat).map((r) => r.id)
            const done = catRecipeIds.filter((id) => recipeMastery[id]?.completed).length

            return (
              <div key={cat} className="category-card" onClick={() => setActiveCategory(cat)}>
                <h3>{cat}</h3>
                <div className="category-progress">{done}/{catRecipeIds.length} completed</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ---- RECIPE GRID ----
  const levelRecipes = activeCategory
    ? recipes.filter((r) => r.level === activeLevel.id && r.category === activeCategory)
    : recipes.filter((r) => activeLevel.recipes.includes(r.id))

  return (
    <div className="panel">
      <button className="back-btn" onClick={() => (activeCategory ? setActiveCategory(null) : setActiveLevel(null))}>
        ← Back
      </button>

      <h1 className="level-title">{activeCategory ? `${activeCategory} — ${activeLevel.title}` : activeLevel.title}</h1>

      <div className="requirement-box">
        <AlertCircle size={18} />
        <span>{activeLevel.requirement}</span>
      </div>

      <div className="recipe-grid">
        {levelRecipes.map((recipe) => {
          const unlocked = isRecipeUnlocked(recipe.id)
          const completed = isRecipeCompleted(recipe.id)
          const mastery = recipeMastery[recipe.id]

          return (
            <div
              key={recipe.id}
              className={`recipe-card ${!unlocked ? 'locked' : ''} ${completed ? 'completed' : ''}`}
              onClick={() => handleRecipeSelect(recipe)}
            >
              {!unlocked && <div className="card-badge"><Lock size={18} /></div>}
              {completed && <div className="card-badge success"><CheckCircle size={18} /></div>}

              <img src={recipe.image} alt={recipe.name} className={`recipe-image ${!unlocked ? 'grayscale' : ''}`} />

              <div className="recipe-card-body">
                <h3>{recipe.name}</h3>
                <div className="recipe-meta">
                  <span>{recipe.ingredients.length} ingredients</span>
                  <span>•</span>
                  <span>{recipe.tools.length} tools</span>
                </div>
                {completed && mastery && (
                  <div className="recipe-score">
                    {'⭐'.repeat(mastery.stars)} {mastery.bestScore}%
                  </div>
                )}
                {!unlocked && <div className="recipe-locked-label">🔒 Complete previous recipe first</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
