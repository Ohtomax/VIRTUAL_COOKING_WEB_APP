/**
 * PrepView — Cooking Fever style cutting:
 * 1. Tap a washed ingredient in the tray → it lands on the chopping board
 * 2. Cut-style bubbles pop up around the board (real slice photos)
 * 3. Tap one → chop-chop knife animation → sliced result stays on the board
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, AlertTriangle } from 'lucide-react'
import { getSlicesForIngredient } from '../data/sliceimages'
import { isWashable } from '../data/ingredients'
import { toolCategories } from '../data/tools'
import useGameStore from '../store/gameStore'
import GameTray from './ui/GameTray'
import GameTooltip from './ui/GameTooltip'
import type { CuttingTechnique } from '../types'

interface Props { onClose: () => void }

type Phase = 'empty' | 'placed' | 'cutting' | 'done'

export default function PrepView({ onClose }: Props) {
  const {
    collectedIngredients, slicedIngredients, sliceIngredient,
    washedIngredients, selectedKnifeId,
    measuredIngredients, measureIngredient,
  } = useGameStore()

  const [mode, setMode] = useState<'cut' | 'measure'>('cut')
  const [measureTarget, setMeasureTarget] = useState<{ name: string; image: string; qty: string } | null>(null)
  const [measureVal, setMeasureVal] = useState(0)

  const [boardItem, setBoardItem] = useState<{ name: string; image: string } | null>(null)
  const [phase, setPhase]         = useState<Phase>('empty')
  const [resultImg, setResultImg] = useState<string | null>(null)
  const [resultCut, setResultCut] = useState('')
  const [warn, setWarn]           = useState('')

  const knife = selectedKnifeId
    ? toolCategories[0].types.find(k => k.id === selectedKnifeId) : null

  /** Parse "2 tbsp" / "½ cup" / "500g" → { target, unit, step } */
  const parseQty = (q: string) => {
    const frac: Record<string, number> = { '¼': .25, '½': .5, '¾': .75 }
    let m = q.trim().match(/^([\d.]+|[¼½¾])\s*(.*)$/)
    let target = 1, unit = q
    if (m) {
      target = frac[m[1]] ?? parseFloat(m[1]) ?? 1
      unit = m[2] || 'pcs'
    }
    const step = target >= 100 ? 50 : target >= 10 ? 1 : .25
    return { target, unit, step }
  }

  const openMeasure = (name: string) => {
    if (measuredIngredients.includes(name)) return
    const ing = collectedIngredients.find(i => i.name === name)
    if (!ing) return
    setMeasureTarget({ name: ing.name, image: ing.image, qty: ing.quantity })
    setMeasureVal(0)
  }

  const confirmMeasure = () => {
    if (!measureTarget) return
    const { target } = parseQty(measureTarget.qty)
    const accuracy = Math.max(0, Math.round(100 - (Math.abs(measureVal - target) / target) * 100))
    measureIngredient(measureTarget.name, measureVal, accuracy)
    setWarn(accuracy >= 95 ? `🎯 Perfect measure! +bonus` : accuracy >= 70 ? '👍 Close enough' : '⚠ Inaccurate — affects dish quality')
    setTimeout(() => setWarn(''), 1800)
    setMeasureTarget(null)
  }

  const placeOnBoard = (name: string) => {
    if (phase === 'cutting') return
    if (slicedIngredients.includes(name)) return
    // Non-sliceable ingredients skip the board entirely — measure only
    if (!getSlicesForIngredient(name)) {
      setWarn('🧪 This ingredient is not sliceable — use the Measure tab instead!')
      setTimeout(() => setWarn(''), 2000)
      return
    }
    const ingObj = collectedIngredients.find(i => i.name === name)
    if (ingObj && isWashable(ingObj) && !washedIngredients.includes(name)) {
      setWarn('Wash this ingredient at the sink first!'); setTimeout(() => setWarn(''), 1800); return
    }
    const ing = collectedIngredients.find(i => i.name === name)
    if (!ing) return
    setBoardItem({ name: ing.name, image: ing.image })
    setResultImg(null); setResultCut('')
    setPhase('placed')
  }

  const applyCut = (cutName: string, img: string) => {
    if (!boardItem) return
    if (!knife) {
      setWarn('Pick a knife from the Cabinet first!'); setTimeout(() => setWarn(''), 1800); return
    }
    setPhase('cutting')
    setTimeout(() => {
      setResultImg(img); setResultCut(cutName)
      sliceIngredient(boardItem.name, cutName as CuttingTechnique)
      setPhase('done')
      setTimeout(() => { setBoardItem(null); setPhase('empty') }, 1400)
    }, 700)
  }

  const slices = boardItem ? getSlicesForIngredient(boardItem.name) : null

  return (
    <motion.div className="sv-root gf-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="sv-bg" style={{ backgroundImage: "url('/assets/kitchen/table-bg.jpg')" }} />
      <div className="gf-scrim gf-scrim--light" />

      <div className="sv-navbar">
        <button className="g-back-btn" onClick={onClose}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Kitchen</span>
        </button>
        <div className="sv-navbar-title">🔪 Prep Table</div>
        <div className="sv-counter">{slicedIngredients.length}/{collectedIngredients.length}</div>
      </div>

      <AnimatePresence>
        {warn && (
          <motion.div className="prep-unsafe-banner" style={{ position: 'absolute', top: 130, left: 20, right: 20, zIndex: 40 }}
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <AlertTriangle size={18} strokeWidth={2.5} /> {warn}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cut | Measure tabs */}
      <div className="gp-mode-tabs">
        <button className={`gp-mode-tab ${mode === 'cut' ? 'active' : ''}`} onClick={() => setMode('cut')}>🔪 Cut</button>
        <button className={`gp-mode-tab ${mode === 'measure' ? 'active' : ''}`} onClick={() => { setMode('measure'); setMeasureTarget(null) }}>🧪 Measure</button>
      </div>

      {/* Knife badge — top right */}
      <div className="gp-knife-badge">
        {knife ? (
          <><img src={knife.image} alt={knife.name}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <span>{knife.name}</span></>
        ) : <span className="gp-knife-missing">⚠ No knife — open Cabinet</span>}
      </div>

      {/* Chopping board center stage */}
      {mode === 'cut' && (
      <div className="gp-board-zone">
        <div className="gp-board">
          <img src="/assets/kitchen/chopping-board.png" alt="board" className="gp-board-img"
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0' }} />

          <AnimatePresence mode="wait">
            {phase === 'empty' && (
              <motion.div key="hint" className="gp-board-hint"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                👇 Tap a washed ingredient below
              </motion.div>
            )}

            {boardItem && phase !== 'done' && (
              <motion.img key={`raw-${boardItem.name}`} src={boardItem.image} className="gp-board-item"
                initial={{ y: 120, scale: 0.5, opacity: 0 }}
                animate={phase === 'cutting'
                  ? { y: 0, scale: [1, 0.94, 1.02, 0.96, 1], opacity: 1 }
                  : { y: 0, scale: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={phase === 'cutting' ? { duration: 0.6 } : { type: 'spring', damping: 14 }}
                onError={e => { (e.target as HTMLImageElement).src = '/assets/ingredients/onion.png' }} />
            )}

            {phase === 'done' && (resultImg || boardItem) && (
              <motion.img key="result" src={resultImg || boardItem?.image} className="gp-board-result"
                initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12 }}
                onError={e => {
                  if (boardItem) (e.target as HTMLImageElement).src = boardItem.image
                }} />
            )}
          </AnimatePresence>

          {/* Knife chop animation overlay */}
          <AnimatePresence>
            {phase === 'cutting' && knife && (
              <motion.img key="knife" src={knife.image} className="gp-knife-chop"
                initial={{ x: '-70%', y: '-40%', rotate: -35, opacity: 1 }}
                animate={{ x: ['-70%', '-10%', '-40%', '0%'], y: ['-40%', '-10%', '-30%', '-5%'], rotate: [-35, -5, -25, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeInOut' }} />
            )}
          </AnimatePresence>
        </div>

        {phase === 'done' && (
          <motion.div className="gp-result-label"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            ✅ {boardItem?.name} — {resultCut}!
          </motion.div>
        )}
      </div>

      )}

      {/* Cut-style bubbles around the board */}
      <AnimatePresence>
        {phase === 'placed' && slices && (
          <motion.div className="gp-cut-bubbles"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {Object.entries(slices).map(([cutName, img], i) => (
              <motion.button key={cutName} className="gp-cut-bubble"
                onClick={() => applyCut(cutName, img)}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: 'spring', damping: 13 }}
                whileHover={{ scale: 1.12, y: -4 }} whileTap={{ scale: 0.9 }}>
                <img src={img} alt={cutName}
                  onError={e => {
                    if (boardItem) (e.target as HTMLImageElement).src = boardItem.image
                  }} />
                <span>{cutName}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MEASURE MODE ── */}
      {mode === 'measure' && (
        <div className="gm-panel">
          <p className="gm-title">🧪 Measure each ingredient to its recipe amount</p>
          <div className="gm-grid">
            {collectedIngredients.map(ing => {
              const done = measuredIngredients.includes(ing.name)
              return (
                <motion.button key={ing.id} className={`gm-item ${done ? 'done' : ''}`}
                  onClick={() => openMeasure(ing.name)} whileTap={!done ? { scale: .92 } : {}}>
                  <img src={ing.image} alt={ing.name}
                    onError={e => { (e.target as HTMLImageElement).src = '/assets/ingredients/onion.png' }} />
                  <span className="gm-item-name">{ing.name}</span>
                  <span className="gm-item-qty">{done ? '✓ measured' : `target: ${ing.quantity}`}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      )}

      {/* Measuring modal */}
      <AnimatePresence>
        {measureTarget && (() => {
          const { target, unit, step } = parseQty(measureTarget.qty)
          const pct = Math.min(100, (measureVal / target) * 100)
          const over = measureVal > target
          return (
            <motion.div className="gm-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMeasureTarget(null)}>
              <motion.div className="gm-modal" initial={{ scale: .85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .85, y: 30 }}
                onClick={e => e.stopPropagation()}>
                <img src={measureTarget.image} alt="" className="gm-modal-img"
                  onError={e => { (e.target as HTMLImageElement).src = '/assets/ingredients/onion.png' }} />
                <h3>{measureTarget.name}</h3>
                <p className="gm-modal-target">Recipe needs: <strong>{measureTarget.qty}</strong></p>

                {/* measuring cup fill */}
                <div className="gm-cup">
                  <div className={`gm-cup-fill ${over ? 'over' : ''}`} style={{ height: `${Math.min(100, pct)}%` }} />
                  <div className="gm-cup-line" />
                </div>

                <div className="gm-stepper">
                  <button onClick={() => setMeasureVal(v => Math.max(0, +(v - step).toFixed(2)))}>−</button>
                  <span>{measureVal} <small>{unit}</small></span>
                  <button onClick={() => setMeasureVal(v => +(v + step).toFixed(2))}>+</button>
                </div>

                <button className="g-btn g-btn--gold" style={{ width: '100%' }} onClick={confirmMeasure}>
                  Confirm Measure
                </button>
              </motion.div>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      <GameTooltip id="prep" text="Tap a washed ingredient, then choose how to cut it. Use Measure tab for liquids." />

      <GameTray highlight={mode === 'cut' ? 'slice' : 'none'} onItemTap={mode === 'cut' ? placeOnBoard : openMeasure} />
    </motion.div>
  )
}