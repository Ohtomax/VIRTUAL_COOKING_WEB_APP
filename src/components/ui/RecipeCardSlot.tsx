/**
 * RecipeCardSlot — the recipe book icon that lives with the ingredients.
 *
 * Replaces the old floating "📖 Recipe Card" button that hovered over every
 * screen: the icon now sits in the ingredient drawer (a pinned slot in the
 * counter tray at a station, or an edge tab on the kitchen map) and explains
 * itself on hover instead of covering the kitchen art.
 */
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import useGameStore from '../../store/gameStore'
import RecipeCard from '../RecipeCard'
import { getStageRoot } from './GameStage'
import type { RecipeCardSlotProps } from '../../constant/interface'


export default function RecipeCardSlot({ variant = 'tray' }: RecipeCardSlotProps) {
  const [open, setOpen] = useState(false)
  const { selectedRecipe } = useGameStore()

  // Nothing to open without a recipe, and the empty card would just confuse.
  if (!selectedRecipe) return null

  return (
    <>
      <div className={`rcs rcs--${variant}`}>
        <motion.button
          className={`rcs-btn rcs-btn--${variant} ${variant === 'dock' ? 'hud-dock-btn' : ''}`.trim()}
          onClick={() => setOpen(true)}
          whileTap={{ scale: 0.9 }}
          aria-label={`Open the recipe card for ${selectedRecipe.name}`}
        >
          <BookOpen size={variant === 'tray' ? 30 : 18} strokeWidth={2} />
          {variant === 'dock' && <span className="hud-dock-label">Recipe</span>}
        </motion.button>
        {/* Hover explainer — CSS-only so it works for both variants and on
            keyboard focus, without another piece of state. */}
        <span className="rcs-tip" role="tooltip">
          <strong>Recipe Card</strong>
          <em>{selectedRecipe.name}</em>
          Ingredients, tools &amp; cooking steps
        </span>
      </div>

      {/* Portalled out of the counter tray, which is its own stacking context —
          an overlay rendered inside it paints under the station's tooltips.
          The target is the scaled stage, not <body>, or the overlay would sit
          outside the letterboxed game area. */}
      {open && createPortal(
        <div className="cab-detail-overlay rcs-overlay" onClick={() => setOpen(false)}>
          <div className="cab-detail-panel rcs-panel" onClick={e => e.stopPropagation()}>
            <RecipeCard setScreen={() => {}} isPopup onClose={() => setOpen(false)} />
          </div>
        </div>,
        getStageRoot(),
      )}
    </>
  )
}
