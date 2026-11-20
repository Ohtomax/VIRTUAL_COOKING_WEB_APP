/**
 * GameTray — Cooking Fever-style bottom counter tray.
 * Shows collected ingredients as round slots with status rings
 * (washed = blue ring, sliced = gold ring). Always visible in stations.
 */
import { motion } from 'framer-motion'
import { Scissors, Droplet } from 'lucide-react'
import useGameStore from '../../store/gameStore'
import { getSlicesForIngredient } from '../../data/sliceimages'
import { isWashable } from '../../data/ingredients'
import RecipeCardSlot from './RecipeCardSlot'
import type { GameTrayProps } from '../../constant/interface'
export default function GameTray({ highlight = 'none', onItemTap }: GameTrayProps) {
  const { collectedIngredients, washedIngredients, slicedIngredients } = useGameStore()

  return (
    <div className="gtray">
      <div className="gtray-wood" />
      {/* Pinned outside .gtray-items so it never scrolls out of reach when the
          ingredient row overflows. */}
      <RecipeCardSlot variant="tray" />
      <div className="gtray-items">
        {collectedIngredients.length === 0 && (
          <span className="gtray-empty">Collect ingredients from the fridge…</span>
        )}
        {collectedIngredients.map((ing, i) => {
          const washed = washedIngredients.includes(ing.name)
          const sliced = slicedIngredients.includes(ing.name)
          const sliceable = !!getSlicesForIngredient(ing.name)
          const needsAction =
            (highlight === 'wash' && isWashable(ing) && !washed) ||
            (highlight === 'slice' && sliceable && !sliced)
          return (
            <motion.button
              key={ing.id}
              className={`gtray-slot ${washed ? 'washed' : ''} ${sliced ? 'sliced' : ''} ${needsAction ? 'pulse' : ''}`}
              onClick={() => onItemTap?.(ing.name)}
              initial={{ scale: 0, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: 'spring', damping: 14 }}
              whileTap={{ scale: 0.88 }}
              title={ing.name}
            >
              <img src={ing.image} alt={ing.name}
                onError={e => { (e.target as HTMLImageElement).src = '/assets/ingredients/onion.png' }} />
              {sliced && <span className="gtray-badge gtray-badge--sliced"><Scissors size={12} strokeWidth={2.6} /></span>}
              {washed && !sliced && <span className="gtray-badge gtray-badge--washed"><Droplet size={12} strokeWidth={2.6} /></span>}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}