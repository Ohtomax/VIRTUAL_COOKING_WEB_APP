/**
 * LevelComplete — shown when all recipes in a level pass the min score.
 * Game narrative §10: Recipes Completed, Average Score, Next Level / Replay.
 */
import { motion } from 'framer-motion'
import { Trophy, ChevronRight, RotateCcw, Home, Star } from 'lucide-react'
import useGameStore from '../store/gameStore'
import { recipes, levels } from '../data/recipes'
import type { SetScreenProps } from '../types'

export default function LevelComplete({ setScreen }: SetScreenProps) {
  const { selectedRecipe, recipeMastery, levelProgress, unlockedLevels } = useGameStore()
  const levelId = selectedRecipe?.level ?? 1
  const level   = levels.find(l => l.id === levelId)
  const lp      = levelProgress[levelId]
  const allDone = [1,2,3,4].every(id => levelProgress[id]?.completed)

  const lvRecipes = recipes.filter(r => r.level === levelId)
  const nextLevel = levels.find(l => l.id === levelId + 1)
  const nextUnlocked = unlockedLevels.includes(levelId + 1)

  if (allDone) {
    // All 4 levels done → congratulations
    return (
      <div className="g-page lc-page">
        <div className="lc-body">
          <motion.div className="lc-badge lc-badge--gold"
            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12 }}>
            <Trophy size={56} strokeWidth={1.3} />
          </motion.div>
          <motion.h1 className="lc-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}>
            🎉 Congratulations!
          </motion.h1>
          <motion.p className="lc-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            You have completed all cooking levels!
          </motion.p>
          <motion.div className="lc-stats" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}>
            <div className="lc-stat">
              <span className="lc-stat-val">{Object.values(recipeMastery).filter(m => m.completed).length}</span>
              <span className="lc-stat-label">Recipes Mastered</span>
            </div>
            <div className="lc-stat">
              <span className="lc-stat-val">
                {Math.round(Object.values(recipeMastery).reduce((s, m) => s + (m.bestScore ?? 0), 0) /
                  Math.max(1, Object.values(recipeMastery).filter(m => m.completed).length))}%
              </span>
              <span className="lc-stat-label">Average Score</span>
            </div>
            <div className="lc-stat">
              <span className="lc-stat-val">
                {Object.values(recipeMastery).reduce((s, m) => s + (m.stars ?? 0), 0)}⭐
              </span>
              <span className="lc-stat-label">Total Stars</span>
            </div>
          </motion.div>
          <div className="lc-badge-earned">🏅 Kitchen Ready Badge Earned!</div>
          <div className="lc-actions">
            <motion.button className="g-btn g-btn--gold" whileTap={{ scale: 0.96 }}
              onClick={() => setScreen('master-chef-mode')}>
              🎯 Challenge Mode <ChevronRight size={18} />
            </motion.button>
            <button className="g-btn g-btn--ghost" onClick={() => setScreen('main-menu')}>
              <Home size={16} /> Main Menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="g-page lc-page">
      <div className="lc-body">
        <motion.div className="lc-badge"
          initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12 }}>
          <Trophy size={48} strokeWidth={1.4} />
        </motion.div>

        <motion.h1 className="lc-title" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          {level?.title ?? 'Level'} Complete!
        </motion.h1>
        <motion.p className="lc-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Average Score: {Math.round(lp?.averageScore ?? 0)}%
        </motion.p>

        {/* Per-recipe breakdown */}
        <div className="lc-recipe-list">
          {lvRecipes.map((r, i) => {
            const m = recipeMastery[r.id]
            return (
              <motion.div key={r.id} className="lc-recipe-row"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}>
                <img src={r.image} alt={r.name} className="lc-recipe-img"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <div className="lc-recipe-info">
                  <span className="lc-recipe-name">{r.name}</span>
                  <span className="lc-recipe-score">{m?.bestScore ?? 0}%</span>
                </div>
                <div className="lc-recipe-stars">
                  {'★'.repeat(m?.stars ?? 0)}{'☆'.repeat(3 - (m?.stars ?? 0))}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="lc-actions">
          {nextLevel && nextUnlocked && (
            <motion.button className="g-btn g-btn--gold" whileTap={{ scale: 0.96 }}
              onClick={() => setScreen('level-select')}>
              Next: {nextLevel.title} <ChevronRight size={18} />
            </motion.button>
          )}
          <button className="g-btn g-btn--ghost" onClick={() => setScreen('level-select')}>
            <RotateCcw size={16} /> Replay Level
          </button>
          <button className="g-btn g-btn--ghost" onClick={() => setScreen('main-menu')}>
            <Home size={16} /> Main Menu
          </button>
        </div>
      </div>
    </div>
  )
}