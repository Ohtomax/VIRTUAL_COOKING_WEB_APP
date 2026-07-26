/**
 * SinkView — Cooking Fever style washing:
 * 1. Tap faucet handle → water pours from the spout
 * 2. Tap an ingredient in the tray → it jumps INTO the basin under the water
 * 3. Hold there ~1.2s with a progress ring, bubbles animate, then it pops back clean
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import useGameStore from '../store/gameStore'
import { isWashable } from '../data/ingredients'
import GameTray from './ui/GameTray'
import GameTooltip from './ui/GameTooltip'

interface Props { onClose: () => void }

const WASH_MS = 1400

export default function SinkView({ onClose }: Props) {
  const { collectedIngredients, washedIngredients, washIngredient } = useGameStore()
  const [waterOn, setWaterOn] = useState(false)
  const [inBasin, setInBasin] = useState<{ name: string; image: string } | null>(null)
  const [progress, setProgress] = useState(0)

  const washables = collectedIngredients.filter(isWashable)
  const allWashed = washables.length > 0 &&
    washables.every(i => washedIngredients.includes(i.name))

  const [notice, setNotice] = useState('')
  const startWash = (name: string) => {
    if (!waterOn || inBasin) return
    if (washedIngredients.includes(name)) return
    const ing = collectedIngredients.find(i => i.name === name)
    if (!ing) return
    if (!isWashable(ing)) {
      setNotice(`${ing.name} doesn't need washing! 🧂`)
      setTimeout(() => setNotice(''), 1800)
      return
    }
    setInBasin({ name: ing.name, image: ing.image })
    setProgress(0)
    const t0 = Date.now()
    const iv = setInterval(() => {
      const p = Math.min(100, ((Date.now() - t0) / WASH_MS) * 100)
      setProgress(p)
      if (p >= 100) {
        clearInterval(iv)
        washIngredient(ing.name)
        setTimeout(() => { setInBasin(null); setProgress(0) }, 350)
      }
    }, 40)
  }

  return (
    <motion.div className="sv-root gf-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="sv-bg" style={{ backgroundImage: "url('/assets/kitchen/sink-bg.jpg')" }} />
      <div className="gf-scrim gf-scrim--light" />

      <div className="sv-navbar">
        <button className="g-back-btn" onClick={onClose}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Kitchen</span>
        </button>
        <div className="sv-navbar-title">🚰 Sink</div>
        <div className="sv-counter">{washedIngredients.length}/{washables.length}</div>
      </div>

      {/* Faucet handle hotspot — right side lever in the image */}
      <motion.button
        className={`gs-faucet-handle ${waterOn ? 'on' : ''}`}
        onClick={() => setWaterOn(v => !v)}
        whileTap={{ scale: 0.9, rotate: waterOn ? 0 : 20 }}
        title="Tap to turn water on/off">
        <motion.div animate={{ rotate: waterOn ? 35 : 0 }} transition={{ type: 'spring', damping: 12 }}>
          🚰
        </motion.div>
        <span>{waterOn ? 'ON' : 'OFF'}</span>
      </motion.button>

      {/* Water stream from spout (51% / 43% of the image) */}
      <AnimatePresence>
        {waterOn && (
          <motion.div className="sink-water-flow"
            initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
            <motion.div className="sink-water-stream"
              animate={{ scaleX: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 0.35 }} />
            <motion.div className="sink-water-splash"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 0.3 }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ingredient being washed inside the basin */}
      <AnimatePresence>
        {inBasin && (
          <motion.div className="gs-basin-item"
            initial={{ top: '82%', scale: 0.5, opacity: 0 }}
            animate={{ top: '58%', scale: 1, opacity: 1 }}
            exit={{ top: '82%', scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}>
            <img src={inBasin.image} alt={inBasin.name}
              onError={e => { (e.target as HTMLImageElement).src = '/assets/ingredients/onion.png' }} />
            {/* progress ring */}
            <svg className="gs-ring" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" className="gs-ring-bg" />
              <circle cx="30" cy="30" r="26" className="gs-ring-fill"
                strokeDasharray={`${(progress / 100) * 163} 163`} />
            </svg>
            {/* bubbles */}
            {[0, 1, 2, 3].map(i => (
              <motion.span key={i} className="gs-bubble"
                style={{ left: `${18 + i * 18}%` }}
                animate={{ y: [-4, -26], opacity: [0.9, 0] }}
                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.22 }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="gs-hint">
        {notice ? notice
          : !waterOn ? '👆 Tap the faucet to turn on the water'
          : allWashed ? '✅ Everything is clean! Head back to the kitchen.'
          : inBasin ? `Washing ${inBasin.name}…`
          : '👇 Tap an ingredient below to wash it'}
      </div>

      <GameTooltip id="sink" text="Turn the faucet on first, then tap ingredients below to wash them." />

      <GameTray highlight="wash" onItemTap={startWash} />
    </motion.div>
  )
}