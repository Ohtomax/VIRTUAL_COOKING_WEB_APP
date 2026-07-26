import { ChevronLeft, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { levels, recipes } from '../data/recipes'
import useGameStore from '../store/gameStore'
import type { SetScreenProps } from '../types'

export default function Progress({ setScreen }: SetScreenProps) {
  const { recipeMastery, levelProgress, playerProfile, toolsViewed } = useGameStore()
  const completedLevels = Object.values(levelProgress).filter(l => l.completed).length
  const pct  = Math.round((completedLevels / 4) * 100)
  const rank = ['Novice Chef','Apprentice Chef','Skilled Chef','Expert Chef','Master Chef'][Math.min(4, Math.floor(pct/25))]

  return (
    <div className="g-page">
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => setScreen('main-menu')}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <span className="g-navbar-title">Progress</span>
      </div>
      <div className="g-page-body">

        <motion.div className="prog-rank"
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="prog-rank-icon"><Trophy size={40} strokeWidth={1.4} /></div>
          <div className="prog-rank-name">{rank}</div>
          <div className="prog-rank-pct">{pct}% overall progress</div>
          <div className="prog-rank-bar">
            <div className="g-bar-track">
              <div className="g-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </motion.div>

        <div className="prog-stats">
          <div className="prog-stat">
            <span className="prog-stat-val">{playerProfile.recipesCompleted}</span>
            <span className="prog-stat-label">Recipes Done</span>
          </div>
          <div className="prog-stat">
            <span className="prog-stat-val">{toolsViewed.length}/5</span>
            <span className="prog-stat-label">Tools Explored</span>
          </div>
        </div>

        <div className="g-section-label">Levels</div>
        <div className="prog-level-list">
          {levels.map((lv, i) => {
            const lp   = levelProgress[lv.id]
            const done = lv.recipes.filter(r => recipeMastery[r]?.completed).length
            return (
              <motion.div key={lv.id} className="prog-level-row"
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}>
                <div className="prog-level-name">{lv.title}</div>
                <div className="prog-level-meta">{done}/{lv.recipes.length} recipes · avg {Math.round(lp?.averageScore ?? 0)}%</div>
                <div className="g-bar-track">
                  <div className="g-bar-fill" style={{ width: `${(done/lv.recipes.length)*100}%` }} />
                </div>
                <div className="prog-recipe-rows">
                  {lv.recipes.map(rid => {
                    const r = recipes.find(x => x.id === rid)
                    const m = recipeMastery[rid]
                    if (!r) return null
                    return (
                      <div key={rid} className="prog-recipe-row">
                        <span className="prog-recipe-name">{r.name}</span>
                        <span className="prog-recipe-stars">{'★'.repeat(m?.stars ?? 0)}{'☆'.repeat(3 - (m?.stars ?? 0))}</span>
                        <span className="prog-recipe-score">{m?.bestScore ?? '—'}%</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}