import { Trophy, ChefHat } from 'lucide-react'
import { levels } from '../data/recipes'
import useGameStore from '../store/gameStore'
import type { SetScreenProps } from '../types'

export default function Progress({ setScreen }: SetScreenProps) {
  const { recipeMastery, levelProgress, playerProfile, toolsViewed } = useGameStore()

  const totalLevels = 4
  const completedLevels = Object.values(levelProgress).filter((lp) => lp.completed).length
  const overallProgress = Math.round((completedLevels / totalLevels) * 100)

  const getRank = () => {
    if (overallProgress >= 100) return 'Master Chef'
    if (overallProgress >= 75) return 'Expert Chef'
    if (overallProgress >= 50) return 'Skilled Chef'
    if (overallProgress >= 25) return 'Apprentice Chef'
    return 'Novice Chef'
  }

  return (
    <div className="panel progress-page" style={{ backgroundImage: "url('/assets/bg/main-bg.jpg')" }}>
      <div className="tools-overlay" />
      <button className="back-btn" onClick={() => setScreen('main-menu')}>← Back</button>

      <div className="progress-content">
        <div className="progress-header-section">
          <Trophy size={40} />
          <h1>Cooking Progress</h1>
        </div>

        <div className="rank-card">
          <ChefHat size={32} />
          <div>
            <h2>{getRank()}</h2>
            <p>{overallProgress}% Overall</p>
          </div>
        </div>

        <div className="progress-levels-list">
          <div className="progress-level-item">
            <span>🔧 Kitchen Tools</span>
            <span>{toolsViewed.length}/5 explored</span>
          </div>
          {levels.map((level) => {
            const lp = levelProgress[level.id]
            const done = level.recipes.filter((rid) => recipeMastery[rid]?.completed).length
            return (
              <div key={level.id} className="progress-level-item">
                <span>{level.title}</span>
                <span>{done}/{level.recipes.length} recipes • {Math.round(lp?.averageScore ?? 0)}% avg</span>
              </div>
            )
          })}
        </div>

        <div className="progress-stats">
          <div className="stat-box"><span className="stat-value">{playerProfile.recipesCompleted}</span><span className="stat-label">Recipes Done</span></div>
          <div className="stat-box"><span className="stat-value">{playerProfile.totalScore}</span><span className="stat-label">Total Score</span></div>
        </div>
      </div>
    </div>
  )
}
