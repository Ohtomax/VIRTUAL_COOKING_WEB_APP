/**
 * StoveView — Cooking Fever style cooking with SOP 1 & 4 compliance.
 * SOP 1: Cookware alignment — must match recipe's recommended cookware/burner size.
 * SOP 4: Cooking execution — careful ingredient drops, flame centering checks.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Flame, CheckCircle2, Target, AlertTriangle } from 'lucide-react'
import useGameStore from '../store/gameStore'
import { matchesIngredient } from '../data/ingredients'
import { toolCategories } from '../data/tools'
import { getSlicesForIngredient } from '../data/sliceimages'
import { RECIPE_COOKWARE, getRandomTip } from '../data/sopData'
import { COOKING_STEP_IMAGES, resolveOutcomeImages } from '../data/cookingStepImages'
import type { CookState, HeatLevel } from '../constant/types'
import type { StoveViewProps } from '../constant/interface'
import GameTray from './ui/GameTray'
import GameTooltip from './ui/GameTooltip'

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

export default function StoveView({ onClose, onFinishCooking, selectedRecipe }: StoveViewProps) {
  const {
    collectedIngredients, slicedIngredients, measuredIngredients,
    heatLevel, setHeatLevel, setBurnedFood, setCookingElapsedTime,
    startCooking, stopCooking, inventoryToolIds,
    setCookwareMatch, setFlameCentering, setIngredientDropScore,
    recordLastDropTimestamp, lastDropTimestamp,
    recordFlameCenteringCheck, recordFlameCenteringResponse,
    flameCenteringChecks, flameCenteringResponses,
    setCookedIngredients, recordChronologicalMistake,
  } = useGameStore()

  // Derive thresholds from the selected recipe (fallback 45s)
  const COOK_SECONDS = selectedRecipe?.cookingDuration ?? 45
  const BURN_SECONDS = COOK_SECONDS + BURN_BUFFER

  const allTools = toolCategories.flatMap(c => c.types)
  const invPots  = inventoryToolIds
    .map(id => allTools.find(t => t.id === id && (t.category === 'pot' || t.category === 'pan')))
    .filter(Boolean)
  
  const isLevel1Or2 = selectedRecipe && selectedRecipe.level <= 2;
  const cookwareOptions = isLevel1Or2
    ? invPots.map(t => ({ id: t!.id, name: t!.name, img: t!.image, type: t!.category as 'pot' | 'pan' | 'wok' }))
    : (invPots.length ? invPots.map(t => ({ id: t!.id, name: t!.name, img: t!.image, type: t!.category as 'pot' | 'pan' | 'wok' })) : FALLBACK_POTS)

  const [cookware, setCookware] = useState<typeof cookwareOptions[0] | null>(null)
  const [currentStepImage, setCurrentStepImage] = useState<string | null>(null)
  const [inPot, setInPot]       = useState<string[]>([])
  const [completedSteps, setCompletedSteps] = useState<number>(0)
  const [hopping, setHopping]   = useState<{ img: string; key: number, type: 'hop' | 'shake' } | null>(null)
  const [fireOn, setFireOn]     = useState(false)
  const [seconds, setSeconds]   = useState(0)
  const [state, setState]       = useState<CookState>('idle')
  const [notice, setNotice]     = useState('')
  const [sopTip, setSopTip]     = useState('')
  const [warn, setWarn]         = useState('')
  const [activeTab, setActiveTab] = useState<'cookware' | 'utensils'>('cookware')

  const requiredToolIds = selectedRecipe?.chronologicalSteps
    ?.filter(s => s.startsWith('tool:'))
    .map(s => s.replace('tool:', '')) || [];

  const invUtensils = inventoryToolIds
    .map(id => allTools.find(t => t.id === id && (t.category === 'utensil' || requiredToolIds.includes(t.id)) && t.id !== 'cboard'))
    .filter(Boolean)

  // SOP 1: Cookware alignment feedback
  const [cookwareAligned, setCookwareAligned] = useState<boolean | null>(null)
  // SOP 4: Flame centering check
  const [showFlameCheck, setShowFlameCheck] = useState(false)
  // SOP 4: Track rapid drops
  const rapidDropCount = useRef(0)
  const totalDropCount = useRef(0)

  // Cleanup refs
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Every pending drop/serve/flame timeout, so a new drop never cancels an earlier
  // one (a shared single ref used to drop the first ingredient on the floor).
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  // Tracks ingredients currently mid-animation to prevent double-tap re-add
  const pendingDrops = useRef<Set<string>>(new Set())

  /** setTimeout that is tracked and auto-cleared on unmount */
  const track = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timers.current.delete(id)
      fn()
    }, ms)
    timers.current.add(id)
    return id
  }, [])

  useEffect(() => {
    const pending = timers.current
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current)
      pending.forEach(clearTimeout)
      pending.clear()
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

  const chronoLen = selectedRecipe?.chronologicalSteps?.length ?? 0
  const sequenceDone = chronoLen > 0 ? completedSteps >= chronoLen : allInPot
  // COMMENT2.0 (4,5,7,10,12): the timer starts as soon as the stove is ignited with a
  // heat level set — NOT after all ingredients are added. The lit stove is always "cooking".
  const cookClockActive = fireOn && heatLevel !== 'off'

  const stepImageSet = selectedRecipe ? COOKING_STEP_IMAGES[selectedRecipe.id] : undefined

  // If the next SOP step needs a utensil the player never took from the Cabinet,
  // the sequence can never advance. Detect it so we can say so instead of leaving
  // the player tapping ingredients with no explanation.
  const nextStep = chronoLen > 0 && completedSteps < chronoLen
    ? selectedRecipe!.chronologicalSteps![completedSteps]
    : null
  const nextToolId = nextStep && nextStep.startsWith('tool:') ? nextStep.slice(5) : null
  const missingToolName = nextToolId && !invUtensils.some(u => u!.id === nextToolId)
    ? (allTools.find(t => t.id === nextToolId)?.name ?? nextToolId)
    : null

  /**
   * Resolve the pot image for a given step index.
   * Several recipes ship fewer step images than they have cooking steps. Indexing
   * directly meant the picture froze partway through and never reached the final
   * frame. When images are scarcer than steps we spread them proportionally, and we
   * always clamp so the last frame shows at the end instead of nothing.
   */
  const stepImageAt = useCallback((index: number): string | null => {
    const imgs = stepImageSet?.steps
    if (!imgs || imgs.length === 0 || index < 0) return null
    if (imgs.length >= chronoLen || chronoLen === 0) {
      return imgs[Math.min(index, imgs.length - 1)]
    }
    const scaled = Math.floor((index * imgs.length) / chronoLen)
    return imgs[Math.min(scaled, imgs.length - 1)]
  }, [stepImageSet, chronoLen])

  const isPakbet = selectedRecipe?.name?.toLowerCase() === 'pakbet' || selectedRecipe?.id === 11
  const isCaldereta = selectedRecipe?.name?.toLowerCase().includes('caldereta') || selectedRecipe?.id === 12
  const recipeClass = selectedRecipe ? `gst-recipe-${selectedRecipe.id} gst-recipe-${selectedRecipe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : ''
  const stepClass = currentStepImage ? 'gst-pot--step-img' : ''
  // Recipes without a dedicated burnt asset reuse the final frame, so the picture
  // itself has to be charred in CSS — otherwise an overcooked dish looks perfect.
  const charredDish = (state === 'burnt' || state === 'served-burnt')
    && resolveOutcomeImages(selectedRecipe?.id ?? -1, true).charred
  const pakbetCookingClass = (isPakbet && currentStepImage && state !== 'served' && state !== 'served-burnt') ? 'gst-pot--pakbet-cooking' : ''
  const calderetaCookingClass = (isCaldereta && currentStepImage && state !== 'served' && state !== 'served-burnt') ? 'gst-pot--caldereta-cooking' : ''

  const isMorcon = selectedRecipe?.id === 18;
  // Recipe 19 is King Ranch Chicken (17 is Pork Afritada — the asset FOLDER is
  // numbered 17, which is where the off-by-two came from). Using 17 here applied
  // king-ranch pot sizing to Afritada and never to King Ranch itself.
  const isKingRanch = selectedRecipe?.id === 19;
  const isPasta = selectedRecipe?.id === 16;
  const isBulalo = selectedRecipe?.id === 14;

  let recipeStepClass = '';
  if (currentStepImage) {
    if (isMorcon) {
      const match = currentStepImage.match(/\/(\d+)-[^\/]+\.png/);
      if (match) recipeStepClass = `gst-pot--morcon-step-${match[1]}`;
    } else if (isKingRanch) {
      const match = currentStepImage.match(/\/(\d+)-[^\/]+\.png/);
      if (match) recipeStepClass = `gst-pot--king-ranch-step-${match[1]}`;
    } else if (isPasta) {
      const match = currentStepImage.match(/\/(\d+)-[^\/]+\.png/);
      if (match) {
        const stepNum = parseInt(match[1]);
        if (stepNum >= 1 && stepNum <= 3) recipeStepClass = 'gst-pot--pasta-large-pot';
        else if (stepNum === 11) recipeStepClass = 'gst-pot--pasta-step-11';
        else if (stepNum === 12) recipeStepClass = 'gst-pot--pasta-step-12';
        else if (stepNum === 13) recipeStepClass = 'gst-pot--pasta-step-13';
        else if (stepNum >= 5) recipeStepClass = 'gst-pot--pasta-fry-pan';
      }
    } else if (isBulalo) {
      const match = currentStepImage.match(/step(\d+)\.png/);
      if (match) recipeStepClass = `gst-pot--bulalo-step-${match[1]}`;
    }
  }

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

  const handleUtensilClick = (toolId: string, toolName: string) => {
    if (!selectedRecipe || !selectedRecipe.chronologicalSteps) {
      flash(`${toolName} is ready for use!`);
      return;
    }
    
    const expectedList = selectedRecipe.chronologicalSteps;
    if (completedSteps < expectedList.length) {
      const expectedNext = expectedList[completedSteps];
      if (expectedNext === `tool:${toolId}`) {
        // Correct tool!
        flash(`Used the ${toolName}!`);
        setCompletedSteps(prev => {
          const img = stepImageAt(prev)
          if (img) setCurrentStepImage(img)
          return prev + 1;
        });
      } else if (expectedNext.startsWith('tool:')) {
        recordChronologicalMistake();
        const requiredTool = expectedNext.split(':')[1];
        flash(`⚠ Wrong tool! You need the ${requiredTool} next.`);
      } else {
        recordChronologicalMistake();
        flash(`⚠ You should add ${expectedNext} first!`);
      }
    } else {
      flash(`${toolName} is ready for use!`);
    }
  }

  // SOP 4: Careful ingredient dropping
  const dropIn = (name: string) => {
    // Ingredients can still be added while cooking or in the "done" window; only a
    // burnt/served dish is locked (timer now starts at ignite, so don't soft-lock prep).
    if (state === 'burnt' || state === 'served' || state === 'served-burnt') return
    const ing = collectedIngredients.find(i => i.name === name || matchesIngredient(i.name, name))
    if (!ing) return
    if (!cookware) { flash('Pick a cookware first! 🍳'); return }
    // Comment 5: nothing cooks (butter melting, etc.) until the stove is actually on.
    if (!fireOn || heatLevel === 'off') {
      setWarn('🔥 Turn on the stove and set a heat level before adding ingredients!')
      setTimeout(() => setWarn(''), 1800)
      return
    }
    if (inPot.includes(name) || pendingDrops.current.has(name)) { flash(`${ing.name} is already in the ${cookware.name}!`); return }
    if (getSlicesForIngredient(name) && !slicedIngredients.includes(name)) {
      flash(`✂ Slice the ${ing.name} at the Prep Table first!`); return
    }
    if (selectedRecipe && selectedRecipe.level <= 2 && !measuredIngredients.includes(name)) {
      setWarn(`Measure the ${ing.name} at the Prep Table first!`)
      setTimeout(() => setWarn(''), 1800)
      return
    }

    // Enforce strict chronological drop order for all recipes using chronologicalSteps
    if (selectedRecipe && selectedRecipe.chronologicalSteps) {
      const expectedList = selectedRecipe.chronologicalSteps;
      
      if (completedSteps < expectedList.length) {
        const expectedNext = expectedList[completedSteps];
        
        if (expectedNext.startsWith('tool:')) {
          recordChronologicalMistake();
          const requiredTool = expectedNext.split(':')[1];
          flash(`⚠ SOP: Use the ${requiredTool} first!`);
          return;
        }
        if (!matchesIngredient(name, expectedNext)) {
          recordChronologicalMistake();
          flash(`⚠ SOP: Ingredients must be added in chronological order! Expected: ${expectedNext}`);
          return;
        }
      }
    }

    // SOP 4: Check drop speed
    const now = Date.now()
    totalDropCount.current += 1
    if (lastDropTimestamp > 0 && (now - lastDropTimestamp) < MIN_DROP_INTERVAL) {
      rapidDropCount.current += 1
      flash('⚠ SOP: Add ingredients carefully — don\'t rush! 🍳')
    }
    recordLastDropTimestamp(now)

    if (selectedRecipe && selectedRecipe.chronologicalSteps) {
      setCompletedSteps(prev => prev + 1)
    }

    // Capture the step index BEFORE the increment for image lookup
    const stepIndexForImage = completedSteps

    // Mark as pending immediately to block re-taps during animation
    pendingDrops.current.add(name)

    const isSeasoning = ['salt', 'pepper', 'peppercorns', 'sinigang mix'].includes(name.toLowerCase())
    setHopping({ img: ing.image, key: Date.now(), type: isSeasoning ? 'shake' : 'hop' })
    // Each drop gets its OWN timer. Previously a single shared ref meant a second
    // drop cancelled the first one's commit: that ingredient never entered the pot
    // yet stayed in pendingDrops forever, so it could never be re-added.
    track(() => {
      setHopping(null)
      setInPot(p => {
        const next = p.includes(name) ? p : [...p, name]
        const img = stepImageAt(selectedRecipe?.chronologicalSteps ? stepIndexForImage : next.length - 1)
        if (img) setCurrentStepImage(img)
        return next
      })
      pendingDrops.current.delete(name)
    }, isSeasoning ? 800 : 1100) // Slower animation (SOP 4: deliberate placement)
  }

  const toggleFire = () => {
    // Preheat-first flow (SOP + comment 5): the stove may be lit with an empty pot
    // so that ingredients only start cooking/melting once there is heat.
    if (!cookware) { flash('Pick a cookware first! 🍳'); return }
    const next = !fireOn
    setFireOn(next)
    if (next) { startCooking(); if (state === 'idle') setState('cooking') }
    else stopCooking()
  }

  // Timer — runs from the moment the stove is ignited (comment 5). Keeps running through
  // the "done" window so the dish can still burn if the player doesn't serve in time.
  useEffect(() => {
    if (!cookClockActive || state === 'burnt' || state === 'served' || state === 'served-burnt') return
    const iv = setInterval(() => {
      const h = useGameStore.getState().heatLevel
      const add = h === 'off' ? 0 : h === 'low' ? 0.2 : h === 'medium' ? 0.3 : 0.4
      setSeconds(s => s + add)
    }, 200)
    return () => clearInterval(iv)
  }, [cookClockActive, state])

  // Burn / done detection. The fire stays lit at "done" so an unserved dish keeps cooking
  // toward "burnt" — the player must serve within the burn buffer (comment 7).
  useEffect(() => {
    if (seconds >= BURN_SECONDS && state !== 'burnt' && state !== 'served' && state !== 'served-burnt') {
      setState('burnt'); setBurnedFood(true)
      setFireOn(false)
      // An overcooked dish must never keep showing a good frame. Recipes with no
      // burnt asset fall back to the final frame plus the charred treatment
      // (see `charredDish`) instead of leaving the appetising picture up.
      // Ruined while still on the burner — the plated shot is held back until
      // the player presses Serve (Revised Feedback D3, C4).
      const outcome = resolveOutcomeImages(selectedRecipe?.id ?? -1, true)
      if (outcome.pan) setCurrentStepImage(outcome.pan)
    } else if (seconds >= COOK_SECONDS && state === 'cooking') {
      setState('done')
      // Comment 13: when cooking finishes, advance the image to the cooked/done frame
      // instead of leaving the last prep frame frozen on screen.
      // Correctly cooked, still in the pan.
      const cooked = resolveOutcomeImages(selectedRecipe?.id ?? -1, false)
      if (cooked.pan) setCurrentStepImage(cooked.pan)
      // Fire is intentionally left ON — the dish will burn if not served in time.
    }
  }, [seconds, BURN_SECONDS, COOK_SECONDS, state, setBurnedFood, stepImageSet, selectedRecipe?.id])

  // SOP 4: Flame centering check — appears every FLAME_CHECK_INTERVAL seconds while cooking
  useEffect(() => {
    if (!fireOn || state !== 'cooking') return
    let dismiss: ReturnType<typeof setTimeout> | null = null
    const iv = setInterval(() => {
      recordFlameCenteringCheck()
      setShowFlameCheck(true)
      // Auto-dismiss after 5 seconds if not tapped
      if (dismiss) clearTimeout(dismiss)
      dismiss = setTimeout(() => setShowFlameCheck(false), 5000)
    }, FLAME_CHECK_INTERVAL * 1000)
    return () => {
      clearInterval(iv)
      if (dismiss) clearTimeout(dismiss)
    }
  }, [fireOn, state, recordFlameCenteringCheck])

  const respondFlameCheck = () => {
    recordFlameCenteringResponse()
    setShowFlameCheck(false)
    flash('✓ Flame centered! Good monitoring! 🎯')
  }

  // SOP 4: Calculate flame centering and drop scores on finish
  // Called when Serve button is clicked — reveals the serving image then finishes
  const handleServe = () => {
    const isBurnt = state === 'burnt'
    // Show the appropriate done/burnt serving image
    if (isBurnt) {
      const outcome = resolveOutcomeImages(selectedRecipe?.id ?? -1, true)
      if (outcome.served) setCurrentStepImage(outcome.served)
      setState('served-burnt')
    } else {
      const outcome = resolveOutcomeImages(selectedRecipe?.id ?? -1, false)
      if (outcome.served) setCurrentStepImage(outcome.served)
      setState('served')
    }
    // After 1.5s of showing the serving image, proceed to finish.
    // Tracked so leaving the stove mid-animation can't fire finish() after unmount.
    track(() => finish(), 1500)
  }

  const finish = () => {
    stopCooking()
    setCookingElapsedTime(seconds)
    setCookedIngredients(inPot)

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
        <div className="sv-navbar-title">Stove</div>
        {/* seconds accrues in fractional ticks — floor before display or the clock
            renders as "0:12.600000000000003" */}
        <div className="sv-counter">⏱ {Math.floor(seconds / 60)}:{String(Math.floor(seconds % 60)).padStart(2, '0')}</div>
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
          <motion.div className="prep-unsafe-banner"
            initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <AlertTriangle size={18} strokeWidth={2.5} /> {warn}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment 7: prominent, hard-to-miss warnings for "about to burn" and "burnt" */}
      <AnimatePresence>
        {state === 'done' && (
          <motion.div className="gst-burn-warning gst-burn-warning--soon"
            key="burn-soon"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AlertTriangle size={20} strokeWidth={2.6} />
            <span>Ready! Serve now — it burns in {Math.max(0, Math.ceil(BURN_SECONDS - seconds))}s!</span>
          </motion.div>
        )}
        {(state === 'burnt' || state === 'served-burnt') && (
          <motion.div className="gst-burn-warning gst-burn-warning--burnt"
            key="burn-now"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.6 }}>
            <AlertTriangle size={22} strokeWidth={2.8} />
            <span>🔥 BURNT! The heat was too high / left on too long.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Missing required utensil — would otherwise be an unexplained dead end */}
      <AnimatePresence>
        {missingToolName && (
          <motion.div className="gst-burn-warning gst-burn-warning--soon"
            key="missing-tool"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AlertTriangle size={20} strokeWidth={2.6} />
            <span>Next step needs the {missingToolName} — go back to the Cabinet and take it.</span>
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
          {fireOn && heatLevel !== 'off' && (state === 'cooking' || state === 'done') && (
            <motion.img key="fire" src="/assets/kitchen/fire.png" className="gst-fire"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 1,
                scale: heatLevel === 'low' ? [0.65, 0.7, 0.65]
                     : heatLevel === 'high' ? [0.95, 1.0, 0.95]
                     : [0.8, 0.85, 0.8]
              }}
              exit={{ opacity: 0, scale: 0.6, transition: { repeat: 0, duration: 0.3 } }}
              transition={{ repeat: Infinity, duration: 1.2 }} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {cookware && (
            <motion.div key={cookware.id} className={`gst-pot gst-pot--${state} gst-pot--${cookware.id} ${recipeClass} ${stepClass} ${pakbetCookingClass} ${calderetaCookingClass} ${recipeStepClass}`.trim()}
              initial={{ y: -60, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentStepImage || cookware.img}
                  src={currentStepImage || cookware.img}
                  alt={cookware.name}
                  className={`gst-pot-img ${currentStepImage ? 'gst-pot-img--step' : ''} ${isPakbet && currentStepImage ? 'gst-pot-img--pakbet-cooking' : ''} ${isCaldereta && currentStepImage ? 'gst-pot-img--caldereta-cooking' : ''} ${charredDish ? 'gst-pot-img--charred' : ''}`.trim()}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.7 }}
                  transition={{ duration: 0.3 }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </AnimatePresence>

              {fireOn && heatLevel !== 'off' && (state === 'cooking' || state === 'done') && [0, 1, 2].map(i => (
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
              {state === 'done'   && <div className="gst-state-badge done">✓ Ready to Serve!</div>}
              {state === 'served' && <div className="gst-state-badge done">🍽 Serving…</div>}
              {state === 'burnt'  && <div className="gst-state-badge burnt">Burnt!</div>}
              {state === 'served-burnt' && <div className="gst-state-badge burnt">🍽 Serving burnt dish…</div>}
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
        <div className="gst-tabs">
          <button className={`gst-tab-btn ${activeTab === 'cookware' ? 'active' : ''}`} onClick={() => setActiveTab('cookware')}>Cookware</button>
          <button className={`gst-tab-btn ${activeTab === 'utensils' ? 'active' : ''}`} onClick={() => setActiveTab('utensils')}>Utensils</button>
        </div>

        {activeTab === 'cookware' && (
          !cookware ? (
            <div className="gst-pick-row">
              <span className="gst-pick-label">Pick cookware{selectedRecipe && RECIPE_COOKWARE[selectedRecipe.id]
                ? ` (recommended: ${RECIPE_COOKWARE[selectedRecipe.id].cookware})` : ''}:</span>
              {cookwareOptions.length > 0 ? cookwareOptions.map(c => (
                <motion.button key={c.id} className="gst-pick-btn"
                  onClick={() => selectCookware(c)} whileTap={{ scale: 0.9 }}>
                  <img src={c.img} alt={c.name}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <span>{c.name}</span>
                </motion.button>
              )) : <span className="gst-pick-btn" style={{opacity: 0.7}}>No cookware selected from cabinet!</span>}
            </div>
          ) : (
            <div className="gst-cook-row">
              <motion.button className={`gst-knob ${fireOn ? 'on' : ''}`}
                onClick={toggleFire} whileTap={{ scale: 0.88 }}>
                <Flame size={22} strokeWidth={2} />
                <span>{fireOn ? 'Fire OFF' : 'Ignite'}</span>
              </motion.button>
  
              <div className="gst-heat-mini">
                {(['low', 'medium', 'high'] as HeatLevel[]).map(h => (
                  <button key={h} className={`gst-heat-chip ${heatLevel === h ? 'active' : ''}`}
                    onClick={() => setHeatLevel(h)}>{h}</button>
                ))}
              </div>
  
              {isPasta && currentStepImage?.includes('11-seasons-with-salt-and-pepper') && inPot.includes('Salt') && inPot.includes('Pepper') && state !== 'burnt' && (
                <motion.button className="g-btn g-btn--gold" style={{ padding: '8px 16px', fontSize: 14 }}
                  onClick={() => setCurrentStepImage('/assets/COOKING PART/16-pasta/12-place-the-pasta-on-serving-plate.png')}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.95 }}>
                  Prep the noodles
                </motion.button>
              )}
              {isPasta && currentStepImage?.includes('12-place-the-pasta-on-serving-plate') && state !== 'burnt' && (
                <motion.button className="g-btn g-btn--gold" style={{ padding: '8px 16px', fontSize: 14 }}
                  onClick={() => setCurrentStepImage('/assets/COOKING PART/16-pasta/13-combine-the-sauce-to-the-pasta.png')}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.95 }}>
                  Add Sauce
                </motion.button>
              )}
  
            </div>
          )
        )}

        {/* Serve controls — always visible regardless of the active tab (comment 7) */}
        {(state === 'done' || state === 'burnt') && (
          <motion.div className="gst-serve-bar"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <motion.button
              className={state === 'burnt' ? 'g-btn g-btn--ghost' : 'g-btn g-btn--gold'}
              style={{ padding: '12px 26px', fontSize: 16 }}
              onClick={handleServe}
              whileTap={{ scale: 0.95 }}>
              <CheckCircle2 size={18} />
              {state === 'burnt' ? 'Serve anyway…' : 'Serve'}
            </motion.button>
          </motion.div>
        )}
        {(state === 'served' || state === 'served-burnt') && (
          <div className="gst-serve-bar">
            <motion.div style={{ fontSize: 15, color: state === 'served' ? 'var(--gold)' : 'var(--text-secondary)', fontWeight: 700 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              🍽 Serving your dish…
            </motion.div>
          </div>
        )}

        {activeTab === 'utensils' && (
          <div className="gst-pick-row">
            <span className="gst-pick-label">Your Utensils:</span>
            {invUtensils.length > 0 ? invUtensils.map(u => (
              <motion.button key={u!.id} className="gst-pick-btn"
                onClick={() => handleUtensilClick(u!.id, u!.name)} whileTap={{ scale: 0.9 }}>
                <img src={u!.image} alt={u!.name}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <span>{u!.name}</span>
              </motion.button>
            )) : <span className="gst-pick-btn" style={{opacity: 0.7}}>No utensils selected from cabinet!</span>}
          </div>
        )}
        <p className="gst-hint">
          {notice ? notice
            : !cookware ? 'Choose a pot or pan — it will land on the burner'
            : !fireOn && state !== 'done' && state !== 'burnt' ? '🔥 Tap Ignite, then pick a heat level to preheat'
            : fireOn && heatLevel === 'off' ? 'Select a heat level to start cooking!'
            : state === 'cooking' && !sequenceDone ? '👇 Add ingredients below in the correct order'
            : state === 'cooking' ? `Cooking… ${Math.max(0, COOK_SECONDS - Math.floor(seconds))}s remaining — don't let it burn!`
            : state === 'done'    ? `✅ Ready! Tap Serve before it burns in ${Math.max(0, Math.ceil(BURN_SECONDS - seconds))}s!`
            : state === 'served'  ? '🍽 Serving your delicious dish…'
            : state === 'burnt'   ? '💀 It burnt… tap Serve anyway or keep it as a lesson!'
            : state === 'served-burnt' ? '🍽 Serving your burnt dish…' : ''}
        </p>
      </div>

      <GameTooltip id="stove" text="SOP: Match cookware to burner size, add ingredients carefully, and monitor the flame!" />
      <GameTray highlight="none" onItemTap={dropIn} />
    </motion.div>
  )
}