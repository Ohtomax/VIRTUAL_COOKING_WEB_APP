/**
 * StoveView — Cooking Fever style cooking with SOP 1 & 4 compliance.
 * SOP 1: Cookware alignment — must match recipe's recommended cookware/burner size.
 * SOP 4: Cooking execution — careful ingredient drops, flame centering checks.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Flame, CheckCircle2, Target, AlertTriangle } from 'lucide-react'
import useGameStore from '../store/gameStore'
import { toolCategories } from '../data/tools'
import { getSlicesForIngredient } from '../data/sliceimages'
import { RECIPE_COOKWARE, getRandomTip } from '../data/sopData'
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
/** Minimum ms between ingredient drops (SOP 4 — careful placement) */
const MIN_DROP_INTERVAL = 800
/** Seconds between flame centering checks */
const FLAME_CHECK_INTERVAL = 15

const FALLBACK_POTS = [
  { id: 'pot', name: 'Stock Pot', img: '/assets/kitchen/stock pot.png', type: 'pot' as const },
  { id: 'pan', name: 'Fry Pan',   img: '/assets/kitchen/fry pan.png',  type: 'pan' as const },
  { id: 'wok', name: 'Wok',       img: '/assets/kitchen/wok pan.png',  type: 'wok' as const },
]

type CookState = 'idle' | 'cooking' | 'done' | 'burnt'

export default function StoveView({ onClose, onFinishCooking, selectedRecipe }: Props) {
  const {
    collectedIngredients, slicedIngredients, measuredIngredients,
    heatLevel, setHeatLevel, setBurnedFood, setCookingElapsedTime,
    startCooking, stopCooking, inventoryToolIds,
    setCookwareMatch, setFlameCentering, setIngredientDropScore,
    recordLastDropTimestamp, lastDropTimestamp,
    recordFlameCenteringCheck, recordFlameCenteringResponse,
    flameCenteringChecks, flameCenteringResponses,
  } = useGameStore()

  // Derive thresholds from the selected recipe (fallback 45s)
  const COOK_SECONDS = selectedRecipe?.cookingDuration ?? 45
  const BURN_SECONDS = COOK_SECONDS + BURN_BUFFER

  const allTools = toolCategories.flatMap(c => c.types)
  const invPots  = inventoryToolIds
    .map(id => allTools.find(t => t.id === id && (t.category === 'pot' || t.category === 'pan')))
    .filter(Boolean)
  const cookwareOptions = invPots.length
    ? invPots.map(t => ({ id: t!.id, name: t!.name, img: t!.image, type: t!.category as 'pot' | 'pan' | 'wok' }))
    : FALLBACK_POTS

  const [cookware, setCookware] = useState<typeof cookwareOptions[0] | null>(null)
  const [inPot, setInPot]       = useState<string[]>([])
  const [hopping, setHopping]   = useState<{ img: string; key: number, type: 'hop' | 'shake' } | null>(null)
  const [fireOn, setFireOn]     = useState(false)
  const [seconds, setSeconds]   = useState(0)
  const [state, setState]       = useState<CookState>('idle')
  const [notice, setNotice]     = useState('')
  const [sopTip, setSopTip]     = useState('')
  const [warn, setWarn]         = useState('')

  // SOP 1: Cookware alignment feedback
  const [cookwareAligned, setCookwareAligned] = useState<boolean | null>(null)
  // SOP 4: Flame centering check
  const [showFlameCheck, setShowFlameCheck] = useState(false)
  // SOP 4: Track rapid drops
  const rapidDropCount = useRef(0)
  const totalDropCount = useRef(0)

  // Cleanup refs
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hopTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current)
      if (hopTimer.current) clearTimeout(hopTimer.current)
    }
  }, [])

  const flash = useCallback((msg: string) => {
    if (flashTimer.current) clearTimeout(flashTimer.current)
    setNotice(msg)
    flashTimer.current = setTimeout(() => setNotice(''), 1800)
  }, [])

  // SOP tip rotation
  useEffect(() => {
    setSopTip(getRandomTip('stove'))
    const iv = setInterval(() => setSopTip(getRandomTip('stove')), 8000)
    return () => clearInterval(iv)
  }, [])

  const readyIngredients = collectedIngredients.filter(i =>
    slicedIngredients.includes(i.name) || !getSlicesForIngredient(i.name)
  )
  const allInPot = readyIngredients.length > 0 && readyIngredients.every(i => inPot.includes(i.name))

  // SOP 1: Check cookware alignment when cookware is selected
  const selectCookware = (c: typeof cookwareOptions[0]) => {
    setCookware(c)
    if (selectedRecipe) {
      const recommended = RECIPE_COOKWARE[selectedRecipe.id]
      if (recommended) {
        const matches = c.type === recommended.cookware || c.id === recommended.cookware
        setCookwareAligned(matches)
        setCookwareMatch(matches ? 100 : 40)
        if (!matches) {
          flash(`⚠ SOP: ${recommended.cookware} is recommended for ${selectedRecipe.name}!`)
        } else {
          flash(`✓ Perfect cookware match! 🎯`)
        }
      } else {
        setCookwareAligned(true)
        setCookwareMatch(100)
      }
    }
  }

  // SOP 4: Careful ingredient dropping
  const dropIn = (name: string) => {
    if (state === 'done' || state === 'burnt') return
    // SOP 4 & code review fix: block drops while cooking
    if (state === 'cooking') {
      flash('Turn off the fire before adding more ingredients! 🔥')
      return
    }
    const ing = collectedIngredients.find(i => i.name === name)
    if (!ing) return
    if (!cookware) { flash('Pick a cookware first! 🍳'); return }
    if (inPot.includes(name)) { flash(`${ing.name} is already in the ${cookware.name}!`); return }
    if (getSlicesForIngredient(name) && !slicedIngredients.includes(name)) {
      flash(`✂ Slice the ${ing.name} at the Prep Table first!`); return
    }
    if (selectedRecipe && selectedRecipe.level <= 2 && !measuredIngredients.includes(name)) {
      setWarn(`Measure the ${ing.name} at the Prep Table first!`)
      setTimeout(() => setWarn(''), 1800)
      return
    }

    // SOP 4: Check drop speed
    const now = Date.now()
    totalDropCount.current += 1
    if (lastDropTimestamp > 0 && (now - lastDropTimestamp) < MIN_DROP_INTERVAL) {
      rapidDropCount.current += 1
      flash('⚠ SOP: Add ingredients carefully — don\'t rush! 🍳')
    }
    recordLastDropTimestamp(now)

    if (hopTimer.current) clearTimeout(hopTimer.current)
    const isSeasoning = ['salt', 'pepper', 'peppercorns'].includes(name.toLowerCase())
    setHopping({ img: ing.image, key: Date.now(), type: isSeasoning ? 'shake' : 'hop' })
    hopTimer.current = setTimeout(() => {
      setHopping(null)
      setInPot(p => p.includes(name) ? p : [...p, name])
    }, isSeasoning ? 800 : 1100) // Slower animation (SOP 4: deliberate placement)
  }

  const toggleFire = () => {
    if (!cookware || inPot.length === 0) return
    const next = !fireOn
    setFireOn(next)
    if (next) { startCooking(); if (state === 'idle') setState('cooking') }
    else stopCooking()
  }

  // Timer
  useEffect(() => {
    if (!fireOn || state === 'burnt') return
    const iv = setInterval(() => {
      const h = useGameStore.getState().heatLevel
      const add = h === 'low' ? 0.2 : h === 'medium' ? 0.3 : 0.4
      setSeconds(s => s + add)
    }, 200)
    return () => clearInterval(iv)
  }, [fireOn, state])

  // Burn / done detection
  useEffect(() => {
    if (seconds >= BURN_SECONDS && state !== 'burnt') {
      setState('burnt'); setBurnedFood(true)
    } else if (seconds >= COOK_SECONDS && state === 'cooking') {
      setState('done')
    }
  }, [seconds, BURN_SECONDS, COOK_SECONDS, state, setBurnedFood])

  // SOP 4: Flame centering check — appears every FLAME_CHECK_INTERVAL seconds while cooking
  useEffect(() => {
    if (!fireOn || state !== 'cooking') return
    const iv = setInterval(() => {
      recordFlameCenteringCheck()
      setShowFlameCheck(true)
      // Auto-dismiss after 5 seconds if not tapped
      setTimeout(() => setShowFlameCheck(false), 5000)
    }, FLAME_CHECK_INTERVAL * 1000)
    return () => clearInterval(iv)
  }, [fireOn, state, recordFlameCenteringCheck])

  const respondFlameCheck = () => {
    recordFlameCenteringResponse()
    setShowFlameCheck(false)
    flash('✓ Flame centered! Good monitoring! 🎯')
  }

  // SOP 4: Calculate flame centering and drop scores on finish
  const finish = () => {
    stopCooking()
    setCookingElapsedTime(seconds)

    // SOP 4: Flame centering score
    if (flameCenteringChecks > 0) {
      const centerPct = Math.round((flameCenteringResponses / flameCenteringChecks) * 100)
      setFlameCentering(centerPct)
    }

    // SOP 4: Ingredient drop score
    if (totalDropCount.current > 0) {
      const carefulPct = Math.round(((totalDropCount.current - rapidDropCount.current) / totalDropCount.current) * 100)
      setIngredientDropScore(carefulPct)
    }

    onFinishCooking()
  }

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

      {/* SOP Tip Banner */}
      <AnimatePresence mode="wait">
        {sopTip && !showFlameCheck && (
          <motion.div className="sop-tip-banner sop-tip-banner--stove"
            key={sopTip}
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <span className="sop-tip-icon">📋</span>
            <span className="sop-tip-text">{sopTip}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {warn && (
          <motion.div className="prep-unsafe-banner" style={{ position: 'absolute', top: 130, left: 20, right: 20, zIndex: 40 }}
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AlertTriangle size={18} strokeWidth={2.5} /> {warn}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOP 1: Cookware alignment badge */}
      {cookware && cookwareAligned !== null && (
        <motion.div className={`sop-alignment-badge ${cookwareAligned ? 'aligned' : 'misaligned'}`}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          {cookwareAligned
            ? <><CheckCircle2 size={14} strokeWidth={2.5} /> Cookware aligned</>
            : <><Target size={14} strokeWidth={2.5} /> Misaligned</>}
        </motion.div>
      )}

      {/* SOP 4: Flame centering check overlay */}
      <AnimatePresence>
        {showFlameCheck && (
          <motion.div className="sop-flame-check"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}>
            <motion.button className="sop-flame-check-btn"
              onClick={respondFlameCheck}
              whileTap={{ scale: 0.92 }}
              animate={{ boxShadow: ['0 0 0 0 rgba(255,180,0,0.4)', '0 0 0 12px rgba(255,180,0,0)', '0 0 0 0 rgba(255,180,0,0.4)'] }}
              transition={{ repeat: Infinity, duration: 1.5 }}>
              <Target size={20} strokeWidth={2} />
              <span>Check Flame</span>
            </motion.button>
            <span className="sop-flame-check-hint">SOP: Tap to confirm flame is centered</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burner zone: fire + cookware + contents */}
      <div className="gst-burner-zone">
        {/* SOP 1: Burner ring indicator has been removed */}

        <AnimatePresence>
          {fireOn && state !== 'burnt' && (
            <motion.img key="fire" src="/assets/kitchen/fire.png" className="gst-fire"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ 
                opacity: 1, 
                scale: heatLevel === 'low' ? [0.65, 0.7, 0.65] 
                     : heatLevel === 'high' ? [0.95, 1.0, 0.95] 
                     : [0.8, 0.85, 0.8] 
              }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ repeat: Infinity, duration: 1.2 }} />
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
                {inPot.filter(n => !['salt', 'pepper', 'peppercorns'].includes(n.toLowerCase())).slice(0, 5).map((name, i) => {
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
          {hopping && hopping.type === 'hop' && (
            <motion.img key={hopping.key} src={hopping.img} className="gst-hop"
              initial={{ top: '95%', left: '50%', scale: 0.85, opacity: 1 }}
              animate={{ top: ['95%', '55%', '68%'], left: ['50%', '59%', '68%'], scale: [0.85, 0.6, 0.35], opacity: [1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, times: [0, 0.55, 1], ease: 'easeOut' }} />
          )}
          {hopping && hopping.type === 'shake' && (
            <motion.img key={hopping.key} src={hopping.img} className="gst-shake"
              initial={{ top: '65%', left: '60%', scale: 0, opacity: 0, rotate: 0 }}
              animate={{ 
                top: ['65%', '45%', '45%', '45%', '45%', '65%'], 
                opacity: [0, 1, 1, 1, 1, 0], 
                scale: [0, 1.2, 1.2, 1.2, 1.2, 0],
                rotate: [0, -45, -20, -45, -20, 0] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: 'easeInOut' }} 
              style={{ position: 'absolute', zIndex: 30, width: 60, height: 60, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="gst-controls">
        {!cookware ? (
          <div className="gst-pick-row">
            <span className="gst-pick-label">Pick cookware{selectedRecipe && RECIPE_COOKWARE[selectedRecipe.id]
              ? ` (recommended: ${RECIPE_COOKWARE[selectedRecipe.id].cookware})` : ''}:</span>
            {cookwareOptions.map(c => (
              <motion.button key={c.id} className="gst-pick-btn"
                onClick={() => selectCookware(c)} whileTap={{ scale: 0.9 }}>
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

      <GameTooltip id="stove" text="SOP: Match cookware to burner size, add ingredients carefully, and monitor the flame!" />
      <GameTray highlight="none" onItemTap={dropIn} />
    </motion.div>
  )
}