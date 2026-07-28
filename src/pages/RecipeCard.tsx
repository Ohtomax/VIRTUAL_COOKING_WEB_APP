/**
 * RecipeCard — preview page before cooking.
 * Shows: dish hero image, meta pills, stats strip, ingredients list with icons,
 * required tools with icons, cooking steps timeline, and bottom CTA.
 */
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ListChecks, UtensilsCrossed, BookOpen, Award, Target, Flame } from 'lucide-react'
import useGameStore from '../store/gameStore'
import { resolveIngredientByName } from '../data/ingredients'
import { toolCategories } from '../data/tools'
import type { SetScreenProps } from '../types'

function resolveToolByName(name: string) {
  const n = name.toLowerCase()
  for (const cat of toolCategories) {
    const found = cat.types.find(t => t.name.toLowerCase() === n || t.id === n || t.name.toLowerCase().includes(n))
    if (found) return found
  }
  return null
}

export default function RecipeCard({ setScreen }: SetScreenProps) {
  const { selectedRecipe } = useGameStore()

  if (!selectedRecipe) {
    return (
      <div className="g-page">
        <div className="g-navbar">
          <button className="g-back-btn" onClick={() => setScreen('level-select')}>
            <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
          </button>
          <span className="g-navbar-title">Recipe</span>
        </div>
        <div className="g-page-body" style={{ textAlign: 'center', paddingTop: 80 }}>
          <p style={{ color: 'var(--text-2)', fontSize: 17 }}>No recipe selected. Go back and pick a dish.</p>
          <button className="g-btn g-btn--gold" style={{ marginTop: 24 }}
            onClick={() => setScreen('level-select')}>Pick a Recipe</button>
        </div>
      </div>
    )
  }

  return (
    <div className="g-page rc-page" style={{ overflowY: 'auto', paddingBottom: 110 }}>
      {/* Top Navbar */}
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => setScreen('level-select')}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <span className="g-navbar-title">Recipe Card</span>
        <div style={{ width: 60 }} />
      </div>

      {/* Hero Banner with Dish Image */}
      <div className="rc-hero-wrap">
        <div className="rc-hero-bg-plate">
          <motion.img
            src={selectedRecipe.image}
            alt={selectedRecipe.name}
            className="rc-hero-img"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            onError={e => { (e.target as HTMLImageElement).src = '/assets/kitchen/table-bg.jpg' }}
          />
        </div>
        <div className="rc-hero-gradient" />
        
        <div className="rc-hero-content">
          <div className="rc-meta-pills">
            <span className="rc-meta-pill rc-meta-pill--gold">
              <Award size={14} /> Level {selectedRecipe.level}
            </span>
            <span className="rc-meta-pill">
              <Flame size={14} /> {selectedRecipe.category}
            </span>
            <span className="rc-meta-pill">
              <Target size={14} /> Min Score: {selectedRecipe.minScore ?? 70}%
            </span>
          </div>
          <h1 className="rc-dish-name">{selectedRecipe.name}</h1>
        </div>
      </div>

      {/* Stats Strip Overlap */}
      <div className="rc-stats-strip" style={{ maxWidth: 640, margin: '-24px auto 0' }}>
        <div className="rc-stat">
          <span className="rc-stat-icon"><ListChecks /></span>
          <span className="rc-stat-value">{selectedRecipe.ingredients.length}</span>
          <span className="rc-stat-label">Ingredients</span>
        </div>
        <div className="rc-stat">
          <span className="rc-stat-icon"><UtensilsCrossed /></span>
          <span className="rc-stat-value">{selectedRecipe.tools.length}</span>
          <span className="rc-stat-label">Tools</span>
        </div>
        <div className="rc-stat">
          <span className="rc-stat-icon"><BookOpen /></span>
          <span className="rc-stat-value">{selectedRecipe.steps.length}</span>
          <span className="rc-stat-label">Steps</span>
        </div>
      </div>

      {/* Main Recipe Content Body */}
      <div className="rc-body" style={{ maxWidth: 640, margin: '24px auto 0' }}>
        {/* Ingredients Block */}
        <div className="rc-block">
          <div className="rc-block-header">
            <ListChecks />
            <span>Ingredients</span>
            <span className="rc-block-count">{selectedRecipe.ingredients.length} Items</span>
          </div>
          <div className="rc-chips">
            {selectedRecipe.ingredients.map((ing, i) => {
              const resolved = resolveIngredientByName(ing)
              return (
                <motion.div key={i} className="rc-chip"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}>
                  {resolved?.image ? (
                    <img src={resolved.image} alt={ing} style={{ width: 26, height: 26, objectFit: 'contain', borderRadius: 4 }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <span className="rc-chip-dot" />
                  )}
                  <span>{ing}</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Required Tools Block */}
        <div className="rc-block">
          <div className="rc-block-header">
            <UtensilsCrossed />
            <span>Required Tools</span>
            <span className="rc-block-count">{selectedRecipe.tools.length} Tools</span>
          </div>
          <div className="rc-chips">
            {selectedRecipe.tools.map((tool, i) => {
              const resolvedTool = resolveToolByName(tool)
              return (
                <motion.div key={i} className="rc-chip rc-chip--tool"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}>
                  {resolvedTool?.image ? (
                    <img src={resolvedTool.image} alt={tool} style={{ width: 24, height: 24, objectFit: 'contain' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <span className="rc-chip-dot" />
                  )}
                  <span>{tool}</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Cooking Steps Timeline */}
        <div className="rc-block">
          <div className="rc-block-header">
            <BookOpen />
            <span>Cooking Steps</span>
          </div>
          <div className="rc-steps">
            {selectedRecipe.steps.map((step, i) => (
              <motion.div key={i} className="rc-step-row"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}>
                <div className="rc-section-num">{i + 1}</div>
                <div className="rc-step-text">{step}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="g-sheet" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(18, 12, 5, 0.94)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(245, 166, 35, 0.25)', padding: '12px 20px 16px'
      }}>
        <p className="g-sheet-hint" style={{ margin: '0 0 8px', fontSize: 13, textAlign: 'center', color: 'rgba(255, 239, 213, 0.75)' }}>
          Review the recipe above, then head to the kitchen!
        </p>
        <motion.button className="g-btn g-btn--gold g-btn--full"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => setScreen('kitchen')}
          style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, fontSize: 16, fontWeight: 700 }}>
          <span>Proceed to Kitchen</span> <ChevronRight size={20} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  )
}