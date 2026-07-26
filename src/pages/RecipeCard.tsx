/**
 * RecipeCard — preview page before cooking.
 * Shows: dish image, ingredients list, tools needed, cooking steps.
 * Buttons: Back (level select) | Proceed to Kitchen
 */
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, UtensilsCrossed, ListChecks, BookOpen } from 'lucide-react'
import useGameStore from '../store/gameStore'
import { resolveIngredientByName } from '../data/ingredients'
import type { SetScreenProps } from '../types'

export default function RecipeCard({ setScreen }: SetScreenProps) {
  const { selectedRecipe } = useGameStore()

  if (!selectedRecipe) {
    return (
      <div className="g-page">
        <div className="g-navbar">
          <button className="g-back-btn" onClick={() => setScreen('level-select')}>
            <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
          </button>
          <span className="g-navbar-title">Recipe</span>
        </div>
        <div className="g-page-body" style={{ textAlign: 'center', paddingTop: 80 }}>
          <p style={{ color: 'var(--text-2)', fontSize: 17 }}>No recipe selected. Go back and pick a dish.</p>
          <button className="g-btn g-btn--gold" style={{ marginTop: 24 }}
            onClick={() => setScreen('level-select')}>Pick a Recipe</button>
        </div>
      </div>
    )
  }

  return (
    <div className="g-page rc-page">
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => setScreen('level-select')}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <span className="g-navbar-title">Recipe Card</span>
      </div>

      {/* Hero image */}
      <motion.img
        src={selectedRecipe.image}
        alt={selectedRecipe.name}
        className="rc-hero"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />

      <div className="rc-dish-name">{selectedRecipe.name}</div>
      <div className="rc-dish-meta">
        Level {selectedRecipe.level} · {selectedRecipe.category} · Min Score: {selectedRecipe.minScore ?? 70}%
      </div>

      {/* Ingredients */}
      <div className="rc-block">
        <div className="rc-block-header">
          <ListChecks size={15} strokeWidth={2.5} style={{ display: 'inline', marginRight: 6 }} />
          Ingredients ({selectedRecipe.ingredients.length})
        </div>
        <div className="rc-chips">
          {selectedRecipe.ingredients.map((ing, i) => {
            const resolved = resolveIngredientByName(ing)
            return (
            <motion.div key={i} className="rc-chip"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}>
              {resolved && <img src={resolved.image} alt={ing} className="rc-chip-img"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
              <span>{ing}</span>
            </motion.div>
          )})}
        </div>
      </div>

      {/* Tools */}
      <div className="rc-block">
        <div className="rc-block-header">
          <UtensilsCrossed size={15} strokeWidth={2.5} style={{ display: 'inline', marginRight: 6 }} />
          Required Tools
        </div>
        <div className="rc-chips">
          {selectedRecipe.tools.map((tool, i) => (
            <motion.span key={i} className="rc-chip"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}>
              {tool}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="rc-block">
        <div className="rc-block-header">
          <BookOpen size={15} strokeWidth={2.5} style={{ display: 'inline', marginRight: 6 }} />
          Cooking Steps
        </div>
        {selectedRecipe.steps.map((step, i) => (
          <div key={i} className="rc-step-row">
            <div className="rc-section-num">{i + 1}</div>
            <span>{step}</span>
          </div>
        ))}
      </div>

      {/* Bottom action */}
      <div className="g-sheet">
        <p className="g-sheet-hint">
          Review the recipe above, then head to the kitchen!
        </p>
        <motion.button className="g-btn g-btn--gold g-btn--full"
          whileTap={{ scale: 0.96 }}
          onClick={() => setScreen('kitchen')}>
          Proceed to Kitchen <ChevronRight size={20} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}