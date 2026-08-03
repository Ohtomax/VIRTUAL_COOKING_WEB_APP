/**
 * SinkView — Cooking Fever style washing with SOP 3 compliance:
 * 1. Tap faucet handle → water pours from the spout
 * 2. Tap an ingredient in the tray → it SUBMERGES into the basin (full immersion)
 * 3. Two-phase wash: immerse → rinse, with dirt particles for larger veggies
 * 4. Larger vegetables require longer wash times (SOP 3 rule)
 */
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import useGameStore from '../store/gameStore'
import { isWashable } from '../data/ingredients'
import { getWashDuration, INGREDIENT_WASH_SIZE, getRandomTip } from '../data/sopData'
import GameTray from './ui/GameTray'
import GameTooltip from './ui/GameTooltip'

interface Props { onClose: () => void }

export default function SinkView({ onClose }: Props) {
  const {
    collectedIngredients, washedIngredients, washIngredient,
    setWashThoroughness,
  } = useGameStore()
  const [waterOn, setWaterOn] = useState(false)
  const [inBasin, setInBasin] = useState<{ name: string; image: string; id: string } | null>(null)
  const [progress, setProgress] = useState(0)
  const [washPhase, setWashPhase] = useState<'immerse' | 'rinse'>('immerse')

  // Track wash quality per ingredient
  const washQualityRef = useRef<number[]>([])
  const [dirtParticles, setDirtParticles] = useState<number[]>([])
  const [sopTip, setSopTip] = useState('')

  const washables = collectedIngredients.filter(isWashable)
  const allWashed = washables.length > 0 &&
    washables.every(i => washedIngredients.includes(i.name))

  // Show SOP tip on mount
  useEffect(() => {
    setSopTip(getRandomTip('sink'))
    const iv = setInterval(() => setSopTip(getRandomTip('sink')), 8000)
    return () => clearInterval(iv)
  }, [])

  // Update store wash thoroughness when all done
  useEffect(() => {
    if (allWashed && washQualityRef.current.length > 0) {
      const avg = washQualityRef.current.reduce((a, b) => a + b, 0) / washQualityRef.current.length
      setWashThoroughness(Math.round(avg))
    }
  }, [allWashed, setWashThoroughness])

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

    // Get size-based wash duration (SOP 3)
    const washMs = getWashDuration(ing.id)
    const isLarge = (INGREDIENT_WASH_SIZE[ing.id] ?? 'small') === 'large'
    const isMedium = (INGREDIENT_WASH_SIZE[ing.id] ?? 'small') === 'medium'

    setInBasin({ name: ing.name, image: ing.image, id: ing.id })
    setProgress(0)
    setWashPhase('immerse')

    // Generate dirt particles for larger veggies
    if (isLarge || isMedium) {
      const count = isLarge ? 6 : 3
      setDirtParticles(Array.from({ length: count }, (_, i) => i))
    } else {
      setDirtParticles([])
    }

    const t0 = Date.now()
    const iv = setInterval(() => {
      const elapsed = Date.now() - t0
      const p = Math.min(100, (elapsed / washMs) * 100)
      setProgress(p)

      // Switch phase at 50%
      if (p >= 50 && p < 100) {
        setWashPhase('rinse')
      }

      if (p >= 100) {
        clearInterval(iv)
        // Full wash = 100 quality; the timer ensures proper time spent
        washQualityRef.current.push(100)
        washIngredient(ing.name)
        setDirtParticles([])
        setTimeout(() => { setInBasin(null); setProgress(0); setWashPhase('immerse') }, 350)
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

      {/* SOP 3 Tip Banner */}
      <AnimatePresence mode="wait">
        {sopTip && (
          <motion.div className="sop-tip-banner"
            key={sopTip}
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <span className="sop-tip-icon">📋</span>
            <span className="sop-tip-text">{sopTip}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Faucet handle hotspot */}
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

      {/* Water stream from spout */}
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

      {/* Ingredient being washed — FULL IMMERSION (SOP 3) */}
      <AnimatePresence>
        {inBasin && (
          <motion.div className={`gs-basin-item gs-basin-item--immersed ${washPhase}`}
            initial={{ top: '82%', scale: 0.5, opacity: 0 }}
            animate={{ top: '62%', scale: 1, opacity: washPhase === 'immerse' ? 0.7 : 1 }}
            exit={{ top: '82%', scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}>
            <img src={inBasin.image} alt={inBasin.name}
              onError={e => { (e.target as HTMLImageElement).src = '/assets/ingredients/onion.png' }} />

            {/* Two-phase progress ring */}
            <svg className="gs-ring" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="26" className="gs-ring-bg" />
              <circle cx="30" cy="30" r="26"
                className={`gs-ring-fill ${washPhase === 'rinse' ? 'gs-ring-fill--rinse' : ''}`}
                strokeDasharray={`${(progress / 100) * 163} 163`} />
            </svg>

            {/* Phase label */}
            <motion.span className="gs-phase-label"
              key={washPhase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}>
              {washPhase === 'immerse' ? '💧 Immersing' : '🫧 Rinsing'}
            </motion.span>

            {/* Bubbles */}
            {[0, 1, 2, 3].map(i => (
              <motion.span key={i} className="gs-bubble"
                style={{ left: `${18 + i * 18}%` }}
                animate={{ y: [-4, -26], opacity: [0.9, 0] }}
                transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.22 }} />
            ))}

            {/* Dirt particles for larger vegetables (SOP 3) */}
            {dirtParticles.map(i => (
              <motion.span key={`dirt-${i}`} className="gs-dirt-particle"
                style={{ left: `${10 + i * 14}%` }}
                initial={{ y: 0, opacity: 0.9, scale: 1 }}
                animate={{ y: [-8, -50], x: [0, (i % 2 ? 1 : -1) * 20], opacity: [0.9, 0], scale: [1, 0.3] }}
                transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.25 }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="gs-hint">
        {notice ? notice
          : !waterOn ? '👆 Tap the faucet to turn on the water'
          : allWashed ? '✅ Everything is clean! Head back to the kitchen.'
          : inBasin ? `${washPhase === 'immerse' ? 'Immersing' : 'Rinsing'} ${inBasin.name}…`
          : '👇 Tap an ingredient below to wash it'}
      </div>

      <GameTooltip id="sink" text="SOP: Fully immerse vegetables in water. Larger veggies need extra scrubbing!" />

      <GameTray highlight="wash" onItemTap={startWash} />
    </motion.div>
  )
}