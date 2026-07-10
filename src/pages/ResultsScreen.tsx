import { useEffect } from 'react'
import { motion } from 'framer-motion'
import useGameStore from '../store/gameStore'
import type { SetScreenProps } from '../types'

export default function ResultsScreen({ setScreen }: SetScreenProps) {
  const {
    selectedRecipe,
    calculateScores,
    saveRecipeProgress,
    totalScore,
    starRating,
    grade,
    scores,
    ingredientErrors,
    safetyWarnings,
    feedbackMessages,
  } = useGameStore()

  useEffect(() => {
    const result = calculateScores()
    if (selectedRecipe) {
      saveRecipeProgress(selectedRecipe.id, result.totalScore, result.starRating)
    }
  }, []) // Run once on mount

  const minScore = selectedRecipe?.minScore ?? 70
  const passed = totalScore >= minScore

  return (
    <div className="panel results-screen">
      <motion.div className="results-container" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        {/* Dish Output */}
        {selectedRecipe && (
          <div className="results-dish">
            <img src={selectedRecipe.image} alt={selectedRecipe.name} className="results-dish-image" />
            <h1>{selectedRecipe.name}</h1>
          </div>
        )}

        {/* Score */}
        <div className="results-score-section">
          <div className="results-total-score">
            <span className="score-number">{totalScore}%</span>
            <span className="score-grade">{grade}</span>
          </div>
          <div className="results-stars">{'⭐'.repeat(starRating)}{'☆'.repeat(3 - starRating)}</div>
        </div>

        {/* Score Breakdown */}
        <div className="results-breakdown">
          <h2>Score Breakdown</h2>
          <div className="breakdown-row">
            <span>Ingredient Accuracy (30%)</span>
            <span>{Math.round(scores.accuracy)}%</span>
          </div>
          <div className="breakdown-row">
            <span>Proper Washing (15%)</span>
            <span>{Math.round(scores.washing)}%</span>
          </div>
          <div className="breakdown-row">
            <span>Cutting Technique (20%)</span>
            <span>{Math.round(scores.cutting)}%</span>
          </div>
          <div className="breakdown-row">
            <span>Cooking Accuracy (25%)</span>
            <span>{Math.round(scores.cooking)}%</span>
          </div>
          <div className="breakdown-row">
            <span>Time Management (10%)</span>
            <span>{Math.round(scores.timing)}%</span>
          </div>
        </div>

        {/* Feedback */}
        <div className="results-feedback">
          {ingredientErrors > 0 && <p className="feedback-item warning">⚠ {ingredientErrors} wrong ingredient(s) selected</p>}
          {safetyWarnings > 0 && <p className="feedback-item warning">⚠ {safetyWarnings} safety warning(s) during preparation</p>}
          {totalScore >= 95 && <p className="feedback-item success">🌟 Outstanding performance!</p>}
          {totalScore >= 80 && totalScore < 95 && <p className="feedback-item success">👍 Well done!</p>}
          {totalScore < 70 && <p className="feedback-item error">Practice makes perfect — try again!</p>}
        </div>

        {/* Buttons */}
        <div className="results-actions">
          {!passed && (
            <button className="results-btn retry" onClick={() => setScreen('recipe-card')}>
              🔁 Retry
            </button>
          )}
          {passed && (
            <button className="results-btn next" onClick={() => setScreen('level-select')}>
              ➡ Next Recipe
            </button>
          )}
          <button className="results-btn menu" onClick={() => setScreen('main-menu')}>
            🏠 Main Menu
          </button>
        </div>
      </motion.div>
    </div>
  )
}
