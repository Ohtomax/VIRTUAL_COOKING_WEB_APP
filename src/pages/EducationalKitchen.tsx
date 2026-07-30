import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Refrigerator, GalleryVerticalEnd, Scissors, Droplets, Flame, ChevronLeft, CheckCircle2, ChevronRight, Snowflake, Package } from 'lucide-react'
import FridgeView    from '../components/Fridgeview'
import CabinetView   from '../components/Cabinetview'
import PrepView      from '../components/Prepview'
import SinkView      from '../components/Sinkview'
import StoveView     from '../components/Stoveview'
import InventoryPanel from '../components/ui/InventoryPanel'
import useGameStore  from '../store/gameStore'
import { toolCategories } from '../data/tools'
import { isWashable } from '../data/ingredients'
import { getSlicesForIngredient } from '../data/sliceimages'

interface Props { onBack: () => void; onFinish: () => void }
type Station     = 'freezer' | 'fridge' | 'shelf' | 'cabinet' | 'prep' | 'sink' | 'stove' | null
type KitchenStep = 'ingredients' | 'washing' | 'slicing' | 'measuring' | 'cooking'

const STEPS: { key: KitchenStep; label: string }[] = [
  { key: 'ingredients', label: 'Collect' },
  { key: 'washing',     label: 'Wash'    },
  { key: 'slicing',     label: 'Slice'   },
  { key: 'measuring',   label: 'Measure' },
  { key: 'cooking',     label: 'Cook'    },
]

export default function EducationalKitchen({ onBack, onFinish }: Props) {
  const [active, setActive]    = useState<Station>(null)
  const [kitchenStep, setStep] = useState<KitchenStep>('ingredients')

  const {
    selectedRecipe, initializeIngredients,
    collectedIngredients, washedIngredients, slicedIngredients, measuredIngredients,
    currentFeedback, clearFeedback, selectedKnifeId, inventoryToolIds,
    sliceIngredient, measureIngredient, isChallengeMode,
  } = useGameStore()

  useEffect(() => {
    if (selectedRecipe) { initializeIngredients(selectedRecipe); setStep('ingredients') }
  }, [selectedRecipe])

  useEffect(() => {
    if (!currentFeedback) return
    const t = setTimeout(clearFeedback, 3000)
    return () => clearTimeout(t)
  }, [currentFeedback, clearFeedback])

  const req          = selectedRecipe?.ingredients.length ?? 0
  const collected    = collectedIngredients.length
  const allCollected = collected >= req && req > 0
  const washables    = collectedIngredients.filter(isWashable)
  const allWashed    = washables.length === 0 ? collected > 0
    : washables.every(i => washedIngredients.includes(i.name))
  const sliceables   = collectedIngredients.filter(i => !!getSlicesForIngredient(i.name))
  const allSliced    = collected > 0 && sliceables.every(i => slicedIngredients.includes(i.name))
  const allMeasured  = measuredIngredients.length >= collected && collected > 0

  const stepDone: Record<KitchenStep, boolean> = {
    ingredients: allCollected, washing: allWashed,
    slicing: allSliced, measuring: allMeasured, cooking: false,
  }

  const advance = () => {
    const order: KitchenStep[] = ['ingredients','washing','slicing','measuring','cooking']
    const idx = order.indexOf(kitchenStep)
    if (stepDone[kitchenStep] && idx < order.length - 1)
      setStep(order[idx + 1] as KitchenStep)
    if (kitchenStep === 'cooking') setActive('stove')
  }

  const hint: Record<KitchenStep, string> = {
    ingredients: allCollected ? '✓ All collected!' : `Gather Ingredients — ${collected}/${req}`,
    washing:     allWashed    ? '✓ All washed!'   : `Open Sink — ${washedIngredients.length}/${washables.length} need washing`,
    slicing:     allSliced    ? '✓ All sliced!'   : `Open Prep Table — ${slicedIngredients.length}/${sliceables.length} need slicing`,
    measuring:   allMeasured  ? '✓ All measured!' : `Open Prep Table — ${measuredIngredients.length}/${collected} measured`,
    cooking:     'Open the Stove to cook!',
  }

  const knifeObj = selectedKnifeId
    ? toolCategories[0].types.find(k => k.id === selectedKnifeId) : null

  // ── Full-screen station views — all unlocked ──
  if (active === 'freezer') return <FridgeView onClose={() => setActive(null)} selectedRecipe={selectedRecipe} station="freezer" title="❄️ Freezer" />
  if (active === 'fridge')  return <FridgeView onClose={() => setActive(null)} selectedRecipe={selectedRecipe} station="fridge" title="🧊 Refrigerator" />
  if (active === 'shelf')   return <FridgeView onClose={() => setActive(null)} selectedRecipe={selectedRecipe} station="shelf" title="🥫 Pantry Shelf" />
  if (active === 'cabinet') return <CabinetView onClose={() => setActive(null)} />
  if (active === 'prep')    return <PrepView onClose={() => setActive(null)} />
  if (active === 'sink')    return <SinkView onClose={() => setActive(null)} />
  if (active === 'stove')   return <StoveView onClose={() => setActive(null)} onFinishCooking={onFinish} selectedRecipe={selectedRecipe} />

  return (
    <div className="ek-root">
      <div className="ek-bg" style={{ backgroundImage: "url('/assets/kitchen/kitchen-main.jpg')" }}>
        <div className="ek-bg-scrim" />
      </div>

      {/* Navbar */}
      <div className="ek-navbar">
        <button className="g-back-btn" onClick={onBack}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <div className="ek-nav-title">{selectedRecipe?.name ?? 'Kitchen'}</div>
        <div style={{ width: 80 }} />
      </div>

      {/* Step strip — hidden in challenge mode */}
      {!isChallengeMode && <div className="ek-steps-strip">
        {STEPS.map((s, i) => (
          <div key={s.key} className="ek-step-item">
            <div className={`ek-step-bubble ${stepDone[s.key] ? 'done' : kitchenStep === s.key ? 'active' : 'idle'}`}>
              {stepDone[s.key] ? <CheckCircle2 size={11} strokeWidth={3} /> : <span>{i + 1}</span>}
            </div>
            <span className={`ek-step-label ${kitchenStep === s.key ? 'active' : stepDone[s.key] ? 'done' : ''}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <div className={`ek-step-line ${stepDone[s.key] ? 'done' : ''}`} />}
          </div>
        ))}
      </div>}

      {/* Inventory Panel (slide-in from right) */}
      <InventoryPanel />

      {/* Station buttons — ALL UNLOCKED */}
      <div className="ek-stations">
        <motion.button className={`ek-stn-btn ${allCollected ? 'ek-stn-btn--done' : kitchenStep==='ingredients' ? 'ek-stn-btn--cta' : ''}`}
          style={{ left: '2%', top: '16%' }} onClick={() => setActive('freezer')}>
          <div className="ek-stn-icon"><Snowflake size={28} strokeWidth={1.5} /></div>
          <span>Freezer</span>
        </motion.button>

        <motion.button className={`ek-stn-btn ${allCollected ? 'ek-stn-btn--done' : kitchenStep==='ingredients' ? 'ek-stn-btn--cta' : ''}`}
          style={{ left: '2%', top: '44%' }} onClick={() => setActive('fridge')}>
          <div className="ek-stn-icon"><Refrigerator size={28} strokeWidth={1.5} /></div>
          <span>Refrigerator</span>
        </motion.button>

        <motion.button className={`ek-stn-btn ${allCollected ? 'ek-stn-btn--done' : kitchenStep==='ingredients' ? 'ek-stn-btn--cta' : ''}`}
          style={{ right: '16%', top: '10%' }} onClick={() => setActive('shelf')}>
          <div className="ek-stn-icon"><Package size={28} strokeWidth={1.5} /></div>
          <span>Pantry Shelf</span>
        </motion.button>

        <motion.button className={`ek-stn-btn ${inventoryToolIds.length > 0 ? 'ek-stn-btn--done' : ''}`}
          style={{ left: '26%', top: '8%' }} onClick={() => setActive('cabinet')}>
          <div className="ek-stn-icon"><GalleryVerticalEnd size={28} strokeWidth={1.5} /></div>
          <span>Cabinet</span>
          {inventoryToolIds.length > 0 && <span className="ek-stn-badge">{inventoryToolIds.length}</span>}
        </motion.button>

        <motion.button className={`ek-stn-btn ${allSliced ? 'ek-stn-btn--done' : kitchenStep==='slicing'||kitchenStep==='measuring' ? 'ek-stn-btn--cta' : ''}`}
          style={{ left: '26%', bottom: '22%' }} onClick={() => setActive('prep')}>
          <div className="ek-stn-icon"><Scissors size={28} strokeWidth={1.5} /></div>
          <span>Prep Table</span>
          {allSliced && <CheckCircle2 size={15} className="ek-stn-check" />}
        </motion.button>

        <motion.button className={`ek-stn-btn ${allWashed ? 'ek-stn-btn--done' : kitchenStep==='washing' ? 'ek-stn-btn--cta' : ''}`}
          style={{ right: '2%', top: '24%' }} onClick={() => setActive('sink')}>
          <div className="ek-stn-icon"><Droplets size={28} strokeWidth={1.5} /></div>
          <span>Sink</span>
          {allWashed && <CheckCircle2 size={15} className="ek-stn-check" />}
        </motion.button>

        <motion.button className={`ek-stn-btn ${kitchenStep === 'cooking' ? 'ek-stn-btn--cta' : ''}`}
          style={{ left: '50%', top: '58%', transform: 'translateX(-50%)' }}
          onClick={() => setActive('stove')}>
          <div className="ek-stn-icon"><Flame size={28} strokeWidth={1.5} /></div>
          <span>Stove</span>
        </motion.button>
      </div>

      {/* Action bar */}
      <div className="ek-action-bar">
        <p className="ek-action-hint">{hint[kitchenStep]}</p>
        <motion.button
          className={`g-btn ${stepDone[kitchenStep] ? 'g-btn--gold' : 'g-btn--dim'}`}
          onClick={advance} whileTap={stepDone[kitchenStep] ? { scale: 0.96 } : {}}>
          {stepDone[kitchenStep]
            ? <><span>Continue</span><ChevronRight size={18} strokeWidth={2.5} /></>
            : 'Complete this step first'}
        </motion.button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {currentFeedback && (
          <motion.div className={`ek-toast ek-toast--${currentFeedback.type}`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            {currentFeedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}