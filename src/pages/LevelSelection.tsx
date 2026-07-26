import { useState } from 'react'
import { ChevronLeft, ChevronRight, Lock, CheckCircle2, Star, Clock, AlertCircle, ChefHat } from 'lucide-react'
import { motion } from 'framer-motion'
import { levels, recipes, getCategoriesInLevel } from '../data/recipes'
import useGameStore from '../store/gameStore'
import type { SetScreenProps, Level, Recipe } from '../types'

const catIcons = [ChefHat, Star, Clock, CheckCircle2]

export default function LevelSelection({ setScreen }: SetScreenProps) {
  const { setSelectedRecipe, resetGame, unlockedLevels, unlockedRecipes, recipeMastery, levelProgress } = useGameStore()
  const [activeLevel, setActiveLevel]       = useState<Level | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [levelIndex, setLevelIndex]         = useState(0)

  const isLocked   = (id: number) => id !== 1 && !unlockedLevels.includes(id)
  const isUnlocked = (id: number) => unlockedRecipes.includes(id)
  const isDone     = (id: number) => recipeMastery[id]?.completed ?? false

  const goPrevLevel = () => setLevelIndex(i => Math.max(0, i - 1))
  const goNextLevel = () => setLevelIndex(i => Math.min(levels.length - 1, i + 1))

  const pct = (levelId: number) => {
    const lv = levels.find(l => l.id === levelId)
    if (!lv) return 0
    return (lv.recipes.filter(r => isDone(r)).length / lv.recipes.length) * 100
  }

  const pick = (r: Recipe) => {
    if (!isUnlocked(r.id)) return
    resetGame(); setSelectedRecipe(r); setScreen('recipe-card')
  }

  /* ── Level carousel ── */
  if (!activeLevel) return (
    <div className="g-page">
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => setScreen('kitchen-tools')}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <span className="g-navbar-title">Levels</span>
      </div>
      <div className="g-page-body g-page-body--no-sheet">
        <h1 className="ls-page-title">Select Level</h1>
        <p className="ls-page-sub">Complete all recipes in a level to unlock the next one.</p>

        <div className="kt-carousel">
          <button
            className="kt-carousel-arrow"
            onClick={goPrevLevel}
            disabled={levelIndex === 0}
            aria-label="Previous level">
            <ChevronLeft size={34} strokeWidth={2.5} />
          </button>

          <div className="ls-carousel-viewport">
            {levels.map((lv, i) => {
              const locked    = isLocked(lv.id)
              const completed = levelProgress[lv.id]?.completed ?? false
              const offset    = i - levelIndex
              if (Math.abs(offset) > 1) return null

              return (
                <motion.div key={lv.id}
                  className={`ls-card ls-carousel-card ${locked ? 'locked' : ''} ${completed ? 'completed' : ''} ${offset === 0 ? 'ls-carousel-card--active' : 'ls-carousel-card--peek'}`}
                  onClick={() => offset === 0 ? (!locked && setActiveLevel(lv)) : setLevelIndex(i)}
                  animate={{
                    x: offset * 640,
                    scale: offset === 0 ? 1 : 0.8,
                    opacity: offset === 0 ? 1 : 0.4,
                    zIndex: offset === 0 ? 10 : 1,
                  }}
                  initial={false}
                  transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                  whileHover={offset === 0 && !locked ? { scale: 1.015 } : {}}
                  whileTap={offset === 0 && !locked ? { scale: 0.98 } : {}}>
                  {locked    && <div className="ls-badge ls-badge-lock"><Lock size={18} /></div>}
                  {completed && <div className="ls-badge ls-badge-done"><CheckCircle2 size={18} /></div>}
                  <img src={lv.image} alt={lv.title}
                    className={`ls-card-img ${locked ? 'dim' : ''}`}
                    onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                  <div className="ls-card-body">
                    <div className="ls-card-eyebrow">Level {String(lv.id).padStart(2,'0')}</div>
                    <div className="ls-card-title">{lv.title}</div>
                    <div className="ls-card-sub">{lv.subtitle}</div>
                    <div className="g-bar-track"><div className="g-bar-fill" style={{ width: `${pct(lv.id)}%` }} /></div>
                    <div className="ls-card-meta">
                      <span><Star size={14} /> Min {lv.minScore}%</span>
                      <span><Clock size={14} /> {lv.recipes.length} recipes</span>
                    </div>
                    <button className={`ls-card-btn ${locked ? 'locked-btn' : completed ? 'done-btn' : ''}`} disabled={locked}>
                      {locked ? <><Lock size={16} /> Locked</> : completed ? <><CheckCircle2 size={16} /> Completed</> : <>Start Level <ChevronRight size={16} /></>}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <button
            className="kt-carousel-arrow"
            onClick={goNextLevel}
            disabled={levelIndex === levels.length - 1}
            aria-label="Next level">
            <ChevronRight size={34} strokeWidth={2.5} />
          </button>
        </div>

        <div className="kt-carousel-dots">
          {levels.map((lv, i) => (
            <button
              key={lv.id}
              className={`kt-carousel-dot ${i === levelIndex ? 'active' : ''} ${levelProgress[lv.id]?.completed ? 'viewed' : ''}`}
              onClick={() => setLevelIndex(i)}
              aria-label={`Go to ${lv.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  )

  /* ── Category selection ── */
  const cats = getCategoriesInLevel(activeLevel.id)
  if (cats.length > 1 && !activeCategory) return (
    <div className="g-page">
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => setActiveLevel(null)}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <span className="g-navbar-title">{activeLevel.title}</span>
      </div>
      <div className="g-page-body">
        <div className="ls-cats-header">
          <h1 className="ls-page-title">{activeLevel.title}</h1>
          <p className="ls-page-sub" style={{ marginBottom: 0 }}>Choose a category to begin</p>
        </div>
        <div className="ls-notice">
          <AlertCircle size={18} />{activeLevel.requirement}
        </div>

        <div className="ls-cat-list">
          {cats.map((cat, i) => {
            const ids  = recipes.filter(r => r.level === activeLevel.id && r.category === cat).map(r => r.id)
            const done = ids.filter(isDone).length
            const isComplete = done === ids.length
            const CatIcon = catIcons[i % catIcons.length]
            return (
              <motion.div key={cat}
                className={`ls-cat-card ${isComplete ? 'done' : ''}`}
                onClick={() => setActiveCategory(cat)}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }} whileTap={{ scale: 0.99 }}>
                <div className="ls-cat-icon"><CatIcon size={26} strokeWidth={1.8} /></div>
                <div className="ls-cat-body">
                  <div className="ls-cat-name">
                    {cat}
                    {isComplete && <CheckCircle2 size={16} className="ls-cat-arrow" style={{ color: 'var(--green)' }} />}
                  </div>
                  <div className="ls-cat-count">{done}/{ids.length} recipes completed</div>
                  <div className="g-bar-track">
                    <div className={`g-bar-fill ${isComplete ? 'g-bar-fill--green' : ''}`} style={{ width: `${(done/ids.length)*100}%` }} />
                  </div>
                </div>
                <ChevronRight size={22} className="ls-cat-arrow" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )

  /* ── Recipe grid ── */
  const list = activeCategory
    ? recipes.filter(r => r.level === activeLevel.id && r.category === activeCategory)
    : recipes.filter(r => activeLevel.recipes.includes(r.id))

  return (
    <div className="g-page">
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => activeCategory ? setActiveCategory(null) : setActiveLevel(null)}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <span className="g-navbar-title">{activeCategory ?? activeLevel.title}</span>
      </div>
      <div className="g-page-body">
        <h1 className="ls-page-title">{activeCategory ?? activeLevel.title}</h1>
        <div className="ls-notice">
          <AlertCircle size={18} />{activeLevel.requirement}
        </div>
        <div className="ls-recipe-grid">
          {list.map((r, i) => {
            const unlocked = isUnlocked(r.id); const done = isDone(r.id)
            return (
              <motion.div key={r.id}
                className={`ls-recipe-card ${!unlocked ? 'locked' : ''} ${done ? 'completed' : ''}`}
                onClick={() => pick(r)}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileTap={unlocked ? { scale: 0.96 } : {}}>
                {!unlocked && <div className="ls-badge ls-badge-lock" style={{top:8,right:8,width:28,height:28}}><Lock size={14}/></div>}
                {done      && <div className="ls-badge ls-badge-done" style={{top:8,right:8,width:28,height:28}}><CheckCircle2 size={14}/></div>}
                <img src={r.image} alt={r.name}
                  className={`ls-recipe-img ${!unlocked ? 'dim' : ''}`}
                  onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                <div className="ls-recipe-body">
                  <div className="ls-recipe-name">{r.name}</div>
                  <div className="ls-recipe-meta">{r.ingredients.length} ingredients · {r.tools.length} tools</div>
                  {done && recipeMastery[r.id] && (
                    <div className="ls-recipe-stars">{'★'.repeat(recipeMastery[r.id].stars)} {recipeMastery[r.id].bestScore}%</div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}