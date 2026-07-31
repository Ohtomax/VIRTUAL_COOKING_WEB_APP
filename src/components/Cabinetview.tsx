/**
 * CabinetView — Cooking Fever style: tools sit on wooden shelves.
 * Tap a tool → flies into your kit. Knives get a "select" star like
 * equipping an upgrade in Cooking Fever.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, X, Info } from 'lucide-react'
import { toolCategories } from '../data/tools'
import useGameStore from '../store/gameStore'
import type { ToolType } from '../types'

interface Props { onClose: () => void }

export default function CabinetView({ onClose }: Props) {
  const { selectedKnifeId, inventoryToolIds, setSelectedKnife, addInventoryTool, removeInventoryTool } = useGameStore()
  const [activeCat, setActiveCat] = useState(0)
  const [detail, setDetail]       = useState<ToolType | null>(null)

  const category = toolCategories[activeCat]
  const inInv    = (id: string) => inventoryToolIds.includes(id)
  const isKnife  = (id: string) => selectedKnifeId === id

  const tapTool = (tool: ToolType) => {
    if (tool.canCut) {
      addInventoryTool(tool.id)
      setSelectedKnife(isKnife(tool.id) ? null : tool.id)
    } else if (inInv(tool.id)) {
      removeInventoryTool(tool.id)
    } else {
      addInventoryTool(tool.id)
    }
  }

  // split current category tools into shelf rows of 4
  const rows: ToolType[][] = []
  for (let i = 0; i < category.types.length; i += 4) rows.push(category.types.slice(i, i + 4))

  return (
    <motion.div className="sv-root gf-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="sv-bg" style={{ backgroundImage: "url('/assets/kitchen/kitchen-main.jpg')", filter: 'blur(3px) brightness(0.55)' }} />
      <div className="gf-scrim" />

      <div className="sv-navbar">
        <button className="g-back-btn" onClick={onClose}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Kitchen</span>
        </button>
        <div className="sv-navbar-title">🗄️ Cabinet</div>
        <div className="sv-counter">{inventoryToolIds.length} in kit</div>
      </div>

      {/* Category tabs */}
      <div className="cab-tabs" style={{ position: 'relative', zIndex: 10 }}>
        {toolCategories.map((cat, i) => (
          <button key={cat.id} className={`cab-tab ${activeCat === i ? 'active' : ''}`} onClick={() => setActiveCat(i)}>
            <span className="cab-tab-icon">{cat.icon}</span>
            <span className="cab-tab-name">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Wooden shelves with tool sprites */}
      <div className="gc-shelves">
        {rows.map((row, r) => (
          <div key={r} className="gc-shelf">
            <div className="gc-shelf-row">
              {row.map((tool, i) => {
                const owned  = inInv(tool.id)
                const knifed = isKnife(tool.id)
                return (
                  <motion.div key={tool.id}
                    role="button" tabIndex={0}
                    className={`gc-tool ${owned ? 'owned' : ''} ${knifed ? 'knifed' : ''}`}
                    onClick={() => tapTool(tool)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') tapTool(tool) }}
                    initial={{ opacity: 0, y: 14, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: r * 0.08 + i * 0.04, type: 'spring', damping: 15 }}
                    whileHover={{ scale: 1.8, y: -6 }} whileTap={{ scale: 2 }}>
                    <button className="gc-info" onClick={e => { e.stopPropagation(); setDetail(tool) }}>
                      <Info size={11} strokeWidth={2.5} />
                    </button>
                    <img src={tool.image} alt={tool.name}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    {knifed && <motion.span className="gc-star" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}>⭐</motion.span>}
                    {owned && !knifed && <span className="gc-owned">✓</span>}
                    <span className="gc-tool-label">{tool.name}</span>
                    {tool.canCut && <span className="gc-cut-tag">{tool.cutTechnique}</span>}
                  </motion.div>
                )
              })}
            </div>
            <div className="gc-plank" />
          </div>
        ))}
      </div>

      <p className="gs-hint" style={{ position: 'relative', zIndex: 10 }}>
        {category.id === 1
          ? (selectedKnifeId ? '⭐ Knife equipped — ready to cut!' : 'Tap a knife to equip it for the Prep Table')
          : 'Tap tools to add them to your kit'}
      </p>

      {/* Detail modal */}
      <AnimatePresence>
        {detail && (
          <motion.div className="cab-detail-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDetail(null)}>
            <motion.div className="cab-detail-panel" initial={{ scale: 0.88, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.88, y: 30 }}
              onClick={e => e.stopPropagation()}>
              <button className="cab-detail-close" onClick={() => setDetail(null)}><X size={17} /></button>
              <img src={detail.image} alt={detail.name} className="cab-detail-img"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
              <h2 className="cab-detail-name">{detail.name}</h2>
              {detail.canCut && <div className="cab-detail-badge">Cut style: <strong>{detail.cutTechnique}</strong></div>}
              <div className="cab-detail-rows">
                <div className="cab-detail-row"><span>Use</span><p>{detail.use}</p></div>
                <div className="cab-detail-row"><span>Best for</span><p>{detail.bestFor}</p></div>
              </div>
              <button className="g-btn g-btn--gold" style={{ width: '100%', marginTop: 12 }}
                onClick={() => { tapTool(detail); setDetail(null) }}>
                {detail.canCut ? (isKnife(detail.id) ? 'Unequip Knife' : 'Equip This Knife')
                  : (inInv(detail.id) ? 'Remove from Kit' : 'Add to Kit')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}