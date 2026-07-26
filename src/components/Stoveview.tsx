/**
 * StoveView — Cooking Fever style cooking.
 * Implements game narrative §8 Cooking Stage.
 * Cookware lands on burner, ingredients hop in, fire + cook/burn timer states.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Flame, CheckCircle2 } from 'lucide-react'
import useGameStore from '../store/gameStore'
import { toolCategories } from '../data/tools'
import { getSlicesForIngredient } from '../data/sliceimages'
import type { Recipe, HeatLevel } from '../types'
import GameTray from './ui/GameTray'
import GameTooltip from './ui/GameTooltip'

interface Props {
  onClose: () => void
  onFinishCooking: () => void
  selectedRecipe: Recipe | null
}

/** Seconds after "done" before food burns */
const BURN_BUFFER = 12

const FALLBACK_POTS = [
  { id: 'pot', name: 'Stock Pot', img: '/assets/kitchen/stock pot.png' },
  { id: 'pan', name: 'Fry Pan',   img: '/assets/kitchen/fry pan.png'   },
  { id: 'wok', name: 'Wok',       img: '/assets/kitchen/wok pan.png'   },
]

type CookState = 'idle' | 'cooking' | 'done' | 'burnt'

export default function StoveView({ onClose, onFinishCooking, selectedRecipe }: Props) {
  const {
    collectedIngredients, slicedIngredients,
    heatLevel, setHeatLevel, setBurnedFood, setCookingElapsedTime,
    startCooking, stopCooking, inventoryToolIds,
  } = useGameStore()

  // Derive thresholds from the selected recipe (fallback 45s)
  const COOK_SECONDS = selectedRecipe?.cookingDuration ?? 45
  const BURN_SECONDS = COOK_SECONDS + BURN_BUFFER

  const allTools = toolCategories.flatMap(c => c.types)
  const invPots  = inventoryToolIds
    .map(id => allTools.find(t => t.id === id && (t.category === 'pot' || t.category === 'pan')))
    .filter(Boolean)
  const cookwareOptions = invPots.length
    ? invPots.map(t => ({ id: t!.id, name: t!.name, img: t!.image }))
    : FALLBACK_POTS

  const [cookware, setCookware] = useState<typeof cookwareOptions[0] | null>(null)
  const [inPot, setInPot]       = useState<string[]>([])
  const [hopping, setHopping]   = useState<{ img: string; key: number } | null>(null)
  const [fireOn, setFireOn]     = useState(false)
  const [seconds, setSeconds]   = useState(0)
  const [state, setState]       = useState<CookState>('idle')
  const [notice, setNotice]     = useState('')

  const flash = (msg: string) => { setNotice(msg); setTimeout(() => setNotice(''), 1800) }

  const readyIngredients = collectedIngredients.filter(i => slicedIngredients.includes(i.name))
  const allInPot = readyIngredients.length > 0 && readyIngredients.every(i => inPot.includes(i.name))

  const dropIn = (name: string) => {
    if (state === 'done' || state === 'burnt') return
    const ing = collectedIngredients.find(i => i.name === name)
    if (!ing) return
    if (!cookware) { flash('Pick a cookware first! 🍳'); return }
    if (inPot.includes(name)) { flash(`${ing.name} is already in the ${cookware.name}!`); return }
    if (getSlicesForIngredient(name) && !slicedIngredients.includes(name)) {
      flash(`✂ Slice the ${ing.name} at the Prep Table first!`); return
    }
    setHopping({ img: ing.image, key: Date.now() })
    setTimeout(() => {
      setHopping(null)
      setInPot(p => p.includes(name) ? p : [...p, name])
    }, 680)
  }

  const toggleFire = () => {
    if (!cookware || inPot.length === 0) return
    const next = !fireOn
    setFireOn(next)
    if (next) { startCooking(); if (state === 'idle') setState('cooking') }
    else stopCooking()
  }

  useEffect(() => {
    if (!fireOn || state === 'burnt') return
    const iv = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(iv)
  }, [fireOn, state])

  useEffect(() => {
    if (seconds >= BURN_SECONDS && state !== 'burnt') {
      setState('burnt'); setBurnedFood(true)
    } else if (seconds >= COOK_SECONDS && state === 'cooking') {
      setState('done')
    }
  }, [seconds, BURN_SECONDS, COOK_SECONDS, state])

  const finish = () => { stopCooking(); setCookingElapsedTime(seconds); onFinishCooking() }

  const cookPct = Math.min(100, (seconds / COOK_SECONDS) * 100)

  return (
    <motion.div className="sv-root gf-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="sv-bg" style={{ backgroundImage: "url('/assets/kitchen/stove-bg.jpg')" }} />
      <div className="gf-scrim gf-scrim--light" />

      <div className="sv-navbar">
        <button className="g-back-btn" onClick={onClose}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Kitchen</span>
        </button>
        <div className="sv-navbar-title">🔥 Stove</div>
        <div className="sv-counter">⏱ {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</div>
      </div>

      {/* Burner zone: fire + cookware + contents */}
      <div className="gst-burner-zone">
        <AnimatePresence>
          {fireOn && state !== 'burnt' && (
            <motion.img key="fire" src="/assets/kitchen/fire.png" className="gst-fire"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: [1, 1.08, 1] }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ repeat: Infinity, duration: 0.45 }} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {cookware && (
            <motion.div key={cookware.id} className={`gst-pot gst-pot--${state}`}
              initial={{ y: -60, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}>
              <img src={cookware.img} alt={cookware.name} className="gst-pot-img"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />

              <div className="gst-pot-contents">
                {inPot.slice(0, 5).map((name, i) => {
                  const ing = collectedIngredients.find(x => x.name === name)
                  return ing ? (
                    <motion.img key={name} src={ing.image}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      style={{ left: `${12 + i * 16}%`, zIndex: i }}
                      transition={{ type: 'spring', damping: 12 }} />
                  ) : null
                })}
              </div>

              {fireOn && state === 'cooking' && [0, 1, 2].map(i => (
                <motion.span key={i} className="gst-steam" style={{ left: `${28 + i * 20}%` }}
                  animate={{ y: [-8, -42], opacity: [0.7, 0] }}
                  transition={{ repeat: Infinity, duration: 1.3, delay: i * 0.35 }} />
              ))}
              {state === 'burnt' && [0, 1, 2].map(i => (
                <motion.span key={i} className="gst-smoke" style={{ left: `${25 + i * 22}%` }}
                  animate={{ y: [-6, -56], opacity: [0.85, 0], scale: [0.7, 1.6] }}
                  transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.3 }} />
              ))}

              {(state === 'cooking' || state === 'done') && (
                <svg className="gst-ring" viewBox="0 0 60 60">
                  <circle cx="30" cy="30" r="26" className="gs-ring-bg" />
                  <circle cx="30" cy="30" r="26"
                    className={`gs-ring-fill ${state === 'done' ? 'done' : ''}`}
                    strokeDasharray={`${(cookPct / 100) * 163} 163`} />
                </svg>
              )}
              {state === 'done'  && <div className="gst-state-badge done">✓ Ready!</div>}
              {state === 'burnt' && <div className="gst-state-badge burnt">Burnt!</div>}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hopping && (
            <motion.img key={hopping.key} src={hopping.img} className="gst-hop"
              initial={{ top: '95%', left: '50%', scale: 0.85, opacity: 1 }}
              animate={{ top: ['95%', '48%', '56%'], scale: [0.85, 0.6, 0.35], opacity: [1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.68, times: [0, 0.55, 1], ease: 'easeOut' }} />
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="gst-controls">
        {!cookware ? (
          <div className="gst-pick-row">
            <span className="gst-pick-label">Pick cookware:</span>
            {cookwareOptions.map(c => (
              <motion.button key={c.id} className="gst-pick-btn"
                onClick={() => setCookware(c)} whileTap={{ scale: 0.9 }}>
                <img src={c.img} alt={c.name}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <span>{c.name}</span>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="gst-cook-row">
            <motion.button className={`gst-knob ${fireOn ? 'on' : ''}`}
              onClick={toggleFire} whileTap={{ scale: 0.88 }} disabled={inPot.length === 0}>
              <Flame size={22} strokeWidth={2} />
              <span>{fireOn ? 'Fire ON' : inPot.length === 0 ? 'Add food first' : 'Ignite'}</span>
            </motion.button>

            {fireOn && (
              <div className="gst-heat-mini">
                {(['low', 'medium', 'high'] as HeatLevel[]).map(h => (
                  <button key={h} className={`gst-heat-chip ${heatLevel === h ? 'active' : ''}`}
                    onClick={() => setHeatLevel(h)}>{h}</button>
                ))}
              </div>
            )}

            {state === 'done' && (
              <motion.button className="g-btn g-btn--gold" style={{ padding: '12px 26px', fontSize: 16 }}
                onClick={finish} initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.95 }}>
                <CheckCircle2 size={18} /> Serve!
              </motion.button>
            )}
            {state === 'burnt' && (
              <motion.button className="g-btn g-btn--ghost" style={{ padding: '12px 22px', fontSize: 15 }}
                onClick={finish}>Serve anyway…</motion.button>
            )}
          </div>
        )}
        <p className="gst-hint">
          {notice ? notice
            : !cookware ? 'Choose a pot or pan — it will land on the burner'
            : inPot.length === 0 ? '👇 Tap ingredients below to drop them in'
            : !fireOn && state !== 'done' ? (allInPot ? 'All in! Tap Ignite 🔥' : 'Add more, or tap Ignite 🔥')
            : state === 'cooking' ? `Cooking… ${Math.max(0, COOK_SECONDS - seconds)}s remaining — don't let it burn!`
            : state === 'done'    ? `Perfect! Serve in ${Math.max(0, BURN_SECONDS - seconds)}s or it burns!`
            : state === 'burnt'   ? '💀 It burnt… lower the heat next time!' : ''}
        </p>
      </div>

      <GameTooltip id="stove" text="Pick cookware, add ingredients, then light the fire. Don't let it burn!" />
      <GameTray highlight="none" onItemTap={dropIn} />
    </motion.div>
  )
}