import { useState } from 'react'
import { motion } from 'framer-motion'
import { matchesIngredient } from '../../data/ingredients'
import type { Ingredient, Recipe } from '../../types'

interface Props {
  title: string
  backgroundImage?: string
  ingredients: Ingredient[]
  selectedIngredients: Ingredient[]
  collectedIngredients: Ingredient[]
  onIngredientSelect: (ingredient: Ingredient) => void
  onClose: () => void
  selectedRecipe: Recipe | null
}

/**
 * Shared popup for Refrigerator / Cabinet / Table stations.
 * Renders ingredient cards on a background with selection state.
 */
export default function StationPopup({
  title,
  backgroundImage,
  ingredients,
  selectedIngredients,
  collectedIngredients,
  onIngredientSelect,
  onClose,
  selectedRecipe,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const isSelected = (id: string) => selectedIngredients.some((i) => i.id === id)
  const isCollected = (id: string) => collectedIngredients.some((i) => i.id === id)

  const getStatus = (ingredient: Ingredient): 'correct' | 'wrong' | 'neutral' => {
    if (!isSelected(ingredient.id)) return 'neutral'
    if (isCollected(ingredient.id)) return 'correct'
    // Selected but not in collected → wrong
    return selectedRecipe?.ingredients.some((ri) => matchesIngredient(ingredient.name, ri)) ? 'correct' : 'wrong'
  }

  const collectedForRecipe = selectedRecipe
    ? collectedIngredients.filter((i) => selectedRecipe.ingredients.some((ri) => matchesIngredient(i.name, ri))).length
    : 0

  return (
    <motion.div
      className="station-popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="station-popup-panel"
        initial={{ scale: 0.85, y: 80, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        <button className="station-close-btn" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="station-popup-header">
          <h2>{title}</h2>
          {selectedRecipe && (
            <p className="station-popup-counter">
              {selectedRecipe.name} — Collected: {collectedForRecipe}/{selectedRecipe.ingredients.length}
            </p>
          )}
        </div>

        {/* Ingredients Grid */}
        <div className="station-ingredients-grid">
          {ingredients.map((ingredient) => {
            const status = getStatus(ingredient)
            const selected = isSelected(ingredient.id)

            return (
              <motion.div
                key={ingredient.id}
                className={`station-ingredient-card ${status} ${selected ? 'selected' : ''}`}
                onClick={() => onIngredientSelect(ingredient)}
                onPointerEnter={() => setHoveredId(ingredient.id)}
                onPointerLeave={() => setHoveredId(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
              >
                <div className="ingredient-check">
                  {selected ? (status === 'correct' ? '✓' : '✕') : '○'}
                </div>
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="ingredient-thumb"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span className="ingredient-label">{ingredient.name}</span>

                {hoveredId === ingredient.id && (
                  <motion.div className="ingredient-tooltip" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {ingredient.name} — {ingredient.quantity}
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="station-popup-footer">
          <span>Selected: {selectedIngredients.length} | Correct: {collectedIngredients.length}</span>
          <button className="station-confirm-btn" onClick={onClose}>
            Confirm ({selectedIngredients.length})
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
