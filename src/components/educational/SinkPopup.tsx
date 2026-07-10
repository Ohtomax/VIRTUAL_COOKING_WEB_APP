import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Ingredient } from '../../types'

interface Props {
  onClose: () => void
  collectedIngredients: Ingredient[]
  onIngredientWash: (ingredient: Ingredient) => void
}

export default function SinkPopup({ onClose, collectedIngredients, onIngredientWash }: Props) {
  const [isWaterOn, setIsWaterOn] = useState(false)
  const [washedIds, setWashedIds] = useState<Set<string>>(new Set())

  const handleWash = (ingredient: Ingredient) => {
    if (!isWaterOn || washedIds.has(ingredient.id)) return
    setWashedIds((prev) => new Set([...prev, ingredient.id]))
    onIngredientWash(ingredient)
  }

  const allWashed = collectedIngredients.length > 0 && collectedIngredients.every((i) => washedIds.has(i.id))

  return (
    <motion.div
      className="station-popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="station-popup-panel sink-panel"
        initial={{ scale: 0.85, y: 80, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="station-close-btn" onClick={onClose}>✕</button>

        <div className="station-popup-header">
          <h2>🚰 Sink — Wash Ingredients</h2>
        </div>

        {/* Water Toggle */}
        <button
          className={`water-toggle-btn ${isWaterOn ? 'on' : ''}`}
          onClick={() => setIsWaterOn(!isWaterOn)}
        >
          {isWaterOn ? '💧 Water ON' : '🚰 Turn Water ON'}
        </button>

        {/* Water animation */}
        <AnimatePresence>
          {isWaterOn && (
            <motion.div
              className="water-stream-visual"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Ingredients to wash */}
        <div className="sink-ingredients-grid">
          {collectedIngredients.map((ingredient) => {
            const isWashed = washedIds.has(ingredient.id)
            return (
              <motion.div
                key={ingredient.id}
                className={`sink-ingredient-card ${isWashed ? 'washed' : ''}`}
                onClick={() => handleWash(ingredient)}
                whileHover={{ scale: isWaterOn ? 1.08 : 1 }}
                whileTap={{ scale: isWaterOn ? 0.92 : 1 }}
                style={{ cursor: isWaterOn && !isWashed ? 'pointer' : 'default', opacity: isWaterOn || isWashed ? 1 : 0.5 }}
              >
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="sink-ingredient-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <span className="sink-ingredient-name">{ingredient.name}</span>
                {isWashed && (
                  <motion.span className="wash-check" initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.span>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Instruction */}
        <div className="sink-instruction">
          {!isWaterOn
            ? 'Turn on water to begin washing'
            : allWashed
              ? '✅ All ingredients washed! You can close this.'
              : 'Click each ingredient to wash it'}
        </div>

        {/* Progress */}
        <div className="sink-progress">
          Washed: {washedIds.size}/{collectedIngredients.length}
        </div>
      </motion.div>
    </motion.div>
  )
}
