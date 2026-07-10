import { ChefHat, BookOpen, BarChart3, Settings, Crown, Lock } from 'lucide-react'
import useGameStore from '../store/gameStore'
import type { SetScreenProps } from '../types'

export default function MainMenu({ setScreen }: SetScreenProps) {
  const { levelProgress, recipeMastery } = useGameStore()

  // Challenge mode unlocks after completing levels 1–4
  const allLevelsComplete = [1, 2, 3, 4].every((id) => levelProgress[id]?.completed)

  return (
    <div className="main-menu" style={{ backgroundImage: "url('/assets/bg/main-bg.jpg')" }}>
      <div className="menu-overlay" />

      <div className="center-menu-container">
        <img src="/assets/ui/game-logo.png" alt="Virtual Cooking Laboratory" className="game-logo" />

        <div className="wood-menu-wrapper">
          {/* Start Game → Tool Identification first */}
          <button className="wood-menu-btn start-btn" onClick={() => setScreen('kitchen-tools')}>
            <div className="btn-icon"><ChefHat size={26} /></div>
            <div className="btn-content"><span className="btn-title">START GAME</span></div>
          </button>

          <button className="wood-menu-btn" onClick={() => setScreen('tutorial')}>
            <div className="btn-icon"><BookOpen size={26} /></div>
            <div className="btn-content"><span className="btn-title">TUTORIAL</span></div>
          </button>

          <button className="wood-menu-btn" onClick={() => setScreen('progress')}>
            <div className="btn-icon"><BarChart3 size={26} /></div>
            <div className="btn-content"><span className="btn-title">PROGRESS</span></div>
          </button>

          <button className="wood-menu-btn" onClick={() => setScreen('settings')}>
            <div className="btn-icon"><Settings size={26} /></div>
            <div className="btn-content"><span className="btn-title">SETTINGS</span></div>
          </button>

          <button
            className={`wood-menu-btn master-chef-btn ${!allLevelsComplete ? 'locked-btn' : ''}`}
            onClick={() => allLevelsComplete && setScreen('master-chef-mode')}
          >
            <div className="btn-icon">{allLevelsComplete ? <Crown size={26} /> : <Lock size={26} />}</div>
            <div className="btn-content">
              <span className="btn-title">CHALLENGE MODE</span>
              <small>{allLevelsComplete ? 'Final Challenge Unlocked' : 'Complete All Levels First'}</small>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
