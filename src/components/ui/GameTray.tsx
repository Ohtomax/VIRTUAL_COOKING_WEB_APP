/**
 * GameTray — Cooking Fever-style bottom counter tray.
 * Shows collected ingredients as round slots with status rings
 * (washed = blue ring, sliced = gold ring). Always visible in stations.
 */
import { motion } from 'framer-motion'
import useGameStore from '../../store/gameStore'
import { getSlicesForIngredient } from '../../data/sliceimages'
import { isWashable } from '../../data/ingredients'

interface Props {
  highlight?: 'wash' | 'slice' | 'none'
  onItemTap?: (name: string) => void
}

export default function GameTray({ highlight = 'none', onItemTap }: Props) {
  const { collectedIngredients, washedIngredients, slicedIngredients } = useGameStore()

  return (
    <div className="gtray">
      <div className="gtray-wood" />
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
              {sliced && <span className="gtray-badge gtray-badge--sliced">✂</span>}
              {washed && !sliced && <span className="gtray-badge gtray-badge--washed">💧</span>}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}