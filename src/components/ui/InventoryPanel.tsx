/**
 * InventoryPanel — game-style floating inventory HUD.
 * Shows two tabs: Ingredients (collected from fridge) | Tools (from cabinet).
 * Displayed as a collapsible side panel on the main kitchen scene.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package2, Utensils, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { toolCategories } from '../../data/tools'
import useGameStore from '../../store/gameStore'

type Tab = 'ingredients' | 'tools'

export default function InventoryPanel() {
  const [open, setOpen]     = useState(false)
  const [tab, setTab]       = useState<Tab>('ingredients')
  const { collectedIngredients, inventoryToolIds, selectedKnifeId, washedIngredients, slicedIngredients } = useGameStore()

  const allTools = toolCategories.flatMap(c => c.types)
  const inventoryTools = inventoryToolIds.map(id => allTools.find(t => t.id === id)).filter(Boolean)

  const ingCount  = collectedIngredients.length
  const toolCount = inventoryToolIds.length

  return (
    <>
      {/* Toggle tab (always visible on right edge) */}
      <button
        className="inv-toggle-tab"
        onClick={() => setOpen(o => !o)}
        title="Toggle Inventory"
      >
        <Package2 size={18} strokeWidth={2} />
        {(ingCount + toolCount) > 0 && (
          <span className="inv-toggle-badge">{ingCount + toolCount}</span>
        )}
        <ChevronRight size={14} strokeWidth={2.5} />
      </button>

      {/* Sliding panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="inv-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {/* Header */}
            <div className="inv-panel-header">
              <button className="inv-close-btn" onClick={() => setOpen(false)}>
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
              <span className="inv-panel-title">Inventory</span>
            </div>

            {/* Tabs */}
            <div className="inv-tabs">
              <button
                className={`inv-tab ${tab === 'ingredients' ? 'active' : ''}`}
                onClick={() => setTab('ingredients')}
              >
                <Package2 size={15} strokeWidth={2} />
                Ingredients
                <span className="inv-tab-count">{ingCount}</span>
              </button>
              <button
                className={`inv-tab ${tab === 'tools' ? 'active' : ''}`}
                onClick={() => setTab('tools')}
              >
                <Utensils size={15} strokeWidth={2} />
                Tools
                <span className="inv-tab-count">{toolCount}</span>
              </button>
            </div>

            {/* Content */}
            <div className="inv-content">
              {tab === 'ingredients' && (
                <>
                  {collectedIngredients.length === 0 ? (
                    <div className="inv-empty">
                      <Package2 size={32} strokeWidth={1.4} />
                      <p>No ingredients yet.</p>
                      <span>Open the Refrigerator to collect ingredients.</span>
                    </div>
                  ) : (
                    <div className="inv-grid">
                      {collectedIngredients.map(ing => {
                        const washed = washedIngredients.includes(ing.name)
                        const sliced = slicedIngredients.includes(ing.name)
                        return (
                          <div key={ing.id} className="inv-card">
                            <div className="inv-card-img-wrap">
                              <img src={ing.image} alt={ing.name} className="inv-card-img"
                                onError={e => { (e.target as HTMLImageElement).src = '/assets/ingredients/onion.png' }} />
                              {sliced && <div className="inv-card-badge inv-badge--sliced">✂</div>}
                              {washed && !sliced && <div className="inv-card-badge inv-badge--washed">💧</div>}
                            </div>
                            <span className="inv-card-name">{ing.name}</span>
                            <div className="inv-card-status">
                              <span className={washed ? 'inv-status--done' : 'inv-status--pending'}>
                                {washed ? '✓ Washed' : '○ Unwashed'}
                              </span>
                              <span className={sliced ? 'inv-status--done' : 'inv-status--pending'}>
                                {sliced ? '✓ Sliced' : '○ Raw'}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}

              {tab === 'tools' && (
                <>
                  {inventoryTools.length === 0 ? (
                    <div className="inv-empty">
                      <Utensils size={32} strokeWidth={1.4} />
                      <p>No tools yet.</p>
                      <span>Open the Cabinet to add tools.</span>
                    </div>
                  ) : (
                    <div className="inv-grid">
                      {inventoryTools.map(tool => {
                        if (!tool) return null
                        const isKnife = tool.id === selectedKnifeId
                        return (
                          <div key={tool.id} className={`inv-card ${isKnife ? 'inv-card--active' : ''}`}>
                            <div className="inv-card-img-wrap">
                              <img src={tool.image} alt={tool.name} className="inv-card-img"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                              {isKnife && (
                                <div className="inv-card-badge inv-badge--active">
                                  <CheckCircle2 size={10} strokeWidth={2.5} />
                                </div>
                              )}
                            </div>
                            <span className="inv-card-name">{tool.name}</span>
                            {isKnife && <span className="inv-card-knife-label">Selected Knife</span>}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}