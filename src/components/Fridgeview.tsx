/**
 * FridgeView — Cooking Fever style: ingredients sit ON the fridge shelves.
 * Tap an item → it flies down to the counter tray with a spring arc.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Search, X } from 'lucide-react'
import { getIngredientsByStation, matchesIngredient } from '../data/ingredients'
import useGameStore from '../store/gameStore'
import GameTray from './ui/GameTray.tsx'
import type { Recipe, Ingredient, StationName } from '../types'
import GameTooltip from './ui/GameTooltip.tsx'

interface Props { onClose: () => void; selectedRecipe: Recipe | null; station: StationName; title: string }

/** Shelf rows mapped over fridge-bg.jpg open-fridge zones */
const SHELF_TOPS = ['16%', '30%', '44%', '58%', '74%']

export default function FridgeView({ onClose, selectedRecipe, station, title }: Props) {
  const { selectIngredient, collectedIngredients, requiredIngredients, currentFeedback, clearFeedback } = useGameStore()
  const [search, setSearch] = useState('')
  const [flying, setFlying] = useState<Ingredient | null>(null)

  useEffect(() => {
    if (!currentFeedback) return
    const t = setTimeout(clearFeedback, 2200)
    return () => clearTimeout(t)
  }, [currentFeedback, clearFeedback])

  const isCollected = (id: string) => collectedIngredients.some(i => i.id === id)
  // ID-based: an item is "needed" if it resolves to an uncollected required slot
  const isRequired = (ing: { id: string; name: string }) =>
    requiredIngredients.some(r =>
      r.ingredientId ? r.ingredientId === ing.id : matchesIngredient(ing.name, r.name))

  const stationIngredients = getIngredientsByStation(station)
  const list = stationIngredients.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()))
  // Removed dynamic sorting to maintain the strict shelf order from ingredients.ts
  const sorted = [...list]

  const collectedCount = selectedRecipe
    ? collectedIngredients.filter(i =>
        selectedRecipe.ingredients.some(r => matchesIngredient(i.name, r))).length
    : collectedIngredients.length

  const handleTap = (ing: Ingredient) => {
    if (isCollected(ing.id)) { selectIngredient(ing); return } // toggle off
    setFlying(ing)
    setTimeout(() => setFlying(null), 650)
    selectIngredient(ing)
  }

  const perShelf = 10;

  return (
    <motion.div className="sv-root gf-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="sv-bg" style={{ backgroundImage: station === 'shelf' ? "none" : "url('/assets/kitchen/fridge-bg.jpg')", backgroundColor: station === 'shelf' ? '#2c221a' : 'transparent' }} />
      <div className="gf-scrim" />

      <div className="sv-navbar">
        <button className="g-back-btn" onClick={onClose}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Kitchen</span>
        </button>
        <div className="sv-navbar-title">{title}</div>
        <div className="sv-counter">{collectedCount}/{selectedRecipe?.ingredients.length ?? '∞'}</div>
      </div>

      <div className="fridge-search-wrap">
        <Search size={16} className="fridge-search-icon" />
        <input className="fridge-search" placeholder="Search ingredients…"
          value={search} onChange={e => setSearch(e.target.value)} />
        {search && <button className="fridge-search-clear" onClick={() => setSearch('')}><X size={14} /></button>}
      </div>

      {/* Shelves — items sit inside the fridge like sprites */}
      <div className="gf-shelves">
        {SHELF_TOPS.map((top, s) => {
          const items = sorted.slice(s * perShelf, (s + 1) * perShelf)
          if (!items.length) return null
          return (
            <div key={s} className="gf-shelf" style={{ top }}>
              <div className="gf-shelf-row">
                {items.map((ing, i) => {
                  const coll = isCollected(ing.id)
                  const req  = isRequired(ing)
                  return (
                    <motion.button key={ing.id}
                      className={`gf-item ${coll ? 'taken' : ''} ${req ? 'glow' : ''}`}
                      onClick={() => handleTap(ing)}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: coll ? 0.82 : 1 }}
                      transition={{ delay: s * 0.08 + i * 0.03, type: 'spring', damping: 15 }}
                      whileHover={{ scale: coll ? 0.82 : 1.14, y: -6 }}
                      whileTap={{ scale: 0.85 }}
                      title={`${ing.name} · ${ing.quantity}`}>
                      <img src={ing.image} alt={ing.name}
                        onError={e => { (e.target as HTMLImageElement).src = '/assets/ingredients/onion.png' }} />
                      {req && !coll && <span className="gf-item-need">!</span>}
                      {coll && <span className="gf-item-taken">✓</span>}
                      <span className="gf-item-label">{ing.name}</span>
                    </motion.button>
                  )
                })}
              </div>
              <div className="gf-shelf-glass" />
            </div>
          )
        })}
      </div>

      {/* Fly-to-tray animation */}
      <AnimatePresence>
        {flying && (
          <motion.img key={flying.id} src={flying.image} className="gf-fly"
            initial={{ top: '38%', left: '50%', scale: 1.1, opacity: 1 }}
            animate={{ top: '86%', left: '50%', scale: 0.5, opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.3, 0.9, 0.4, 1] }} />
        )}
      </AnimatePresence>

      {/* Feedback toast — visible inside the fridge */}
      <AnimatePresence>
        {currentFeedback && (
          <motion.div
            className={`ek-toast ek-toast--${currentFeedback.type}`}
            style={{ position: 'absolute', bottom: 126, left: '50%', transform: 'translateX(-50%)', zIndex: 60 }}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }}>
            {currentFeedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      <GameTooltip id="fridge" text="Tap ingredients to collect them! Gold ones are needed for your recipe." />

      <GameTray highlight="none" />
    </motion.div>
  )
}