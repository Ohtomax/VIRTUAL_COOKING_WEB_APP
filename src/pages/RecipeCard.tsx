import useGameStore from '../store/gameStore'
import type { SetScreenProps } from '../types'

/**
 * Step 5 in game narrative: Recipe Card Page
 * Shows ingredients, steps, and required tools before gameplay starts.
 */
export default function RecipeCard({ setScreen }: SetScreenProps) {
  const { selectedRecipe, resetGame } = useGameStore()

  if (!selectedRecipe) {
    setScreen('level-select')
    return null
  }

  const handleProceed = () => {
    resetGame()
    setScreen('kitchen')
  }

  return (
    <div className="panel recipe-card-page">
      <button className="back-btn" onClick={() => setScreen('level-select')}>← Back</button>

      <div className="recipe-card-container">
        <div className="recipe-card-header">
          <img src={selectedRecipe.image} alt={selectedRecipe.name} className="recipe-card-hero" />
          <h1>{selectedRecipe.name}</h1>
          <p className="recipe-card-level">Level {selectedRecipe.level} — {selectedRecipe.category}</p>
        </div>

        <div className="recipe-card-sections">
          {/* Ingredients */}
          <div className="recipe-card-section">
            <h2>🧅 Ingredients ({selectedRecipe.ingredients.length})</h2>
            <ul className="recipe-card-list">
              {selectedRecipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          {/* Required Tools */}
          <div className="recipe-card-section">
            <h2>🔧 Required Tools</h2>
            <ul className="recipe-card-list">
              {selectedRecipe.tools.map((tool, i) => (
                <li key={i}>{tool}</li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="recipe-card-section">
            <h2>📋 Steps</h2>
            <ol className="recipe-card-steps">
              {selectedRecipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <button className="proceed-btn primary" onClick={handleProceed}>
          ▶ Proceed to Kitchen
        </button>
      </div>
    </div>
  )
}
