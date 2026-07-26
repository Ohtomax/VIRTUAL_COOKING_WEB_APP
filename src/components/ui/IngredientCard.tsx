/**
 * IngredientCard — reusable ingredient tile used across Fridge, Prep, Sink views.
 * Handles: image with fallback, selection state (needed/collected/wrong),
 * check/x badges, status label, optional quantity, hover/tap animations.
 */
import { motion } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import type { Ingredient } from '../../types'

type CardState = 'needed' | 'collected' | 'wrong' | 'done' | 'idle' | 'default' | 'active'

interface Props {
  ingredient: Ingredient
  state?: CardState
  statusLabel?: string
  showQty?: boolean
  delay?: number
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const FALLBACK = '/assets/ingredients/onion.png'

const sizeMap = {
  sm: { wrap: 68, img: 60 },
  md: { wrap: 84, img: 76 },
  lg: { wrap: 100, img: 90 },
}

export default function IngredientCard({
  ingredient, state = 'default', statusLabel, showQty = false,
  delay = 0, onClick, className = '', size = 'md',
}: Props) {
  const { wrap, img } = sizeMap[size]
  const collected = state === 'collected' || state === 'done'
  const wrong = state === 'wrong'
  const needed = state === 'needed'
  const idle = state === 'idle'

  return (
    <motion.div
      className={`sv-item ${state !== 'default' ? state : ''} ${className}`}
      onClick={onClick}
      style={{ opacity: idle ? 0.45 : 1 }}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: idle ? 0.45 : 1, scale: 1 }}
      transition={{ delay, type: 'spring', damping: 18, stiffness: 260 }}
      whileHover={onClick && !idle ? { scale: 1.08, y: -4 } : {}}
      whileTap={onClick && !idle ? { scale: 0.92 } : {}}
    >
      {/* Image wrapper */}
      <div
        className="sv-item-img-wrap"
        style={{ width: wrap, height: wrap, borderRadius: 16 }}
      >
        <img
          src={ingredient.image}
          alt={ingredient.name}
          className="sv-item-img"
          style={{ width: img, height: img }}
          onError={e => { (e.target as HTMLImageElement).src = FALLBACK }}
        />

        {/* Collected checkmark */}
        {collected && (
          <motion.div className="sv-item-check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            <CheckCircle2 size={15} strokeWidth={2.5} />
          </motion.div>
        )}

        {/* Wrong indicator */}
        {wrong && (
          <div className="sv-item-wrong">
            <X size={13} strokeWidth={2.5} />
          </div>
        )}

        {/* Water glow for sink */}
        {state === 'active' && <div className="sv-item-water-glow" />}
      </div>

      {/* Name */}
      <span className="sv-item-name">{ingredient.name}</span>

      {/* Quantity */}
      {showQty && <span className="sv-item-qty">{ingredient.quantity}</span>}

      {/* Status / needed badge */}
      {needed && <span className="sv-item-needed">needed</span>}
      {statusLabel && <span className="sv-item-status">{statusLabel}</span>}
    </motion.div>
  )
}