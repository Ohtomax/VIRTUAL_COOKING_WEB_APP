import { Crown, Lock, Flame, Clock, Target, Zap } from 'lucide-react'
import useGameStore from '../store/gameStore'
import { recipes } from '../data/recipes'
import type { SetScreenProps } from '../types'

export default function MasterChefMode({ setScreen }: SetScreenProps) {
  const { levelProgress, setSelectedRecipe, resetGame } = useGameStore()
  const allLevelsComplete = [1, 2, 3, 4].every((id) => levelProgress[id]?.completed)

  const features = [
    { icon: <Clock size={24} />, title: 'Time Limit', desc: 'Cook under time pressure' },
    { icon: <Target size={24} />, title: 'No Guide', desc: 'No recipe steps shown' },
    { icon: <Zap size={24} />, title: 'Random Recipe', desc: 'Recipe selected at random' },
    { icon: <Flame size={24} />, title: 'Strict Scoring', desc: 'Higher accuracy required' },
  ]

  const handleStartChallenge = () => {
    // Pick a random recipe from all levels
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)]
    resetGame()
    setSelectedRecipe(randomRecipe)
    setScreen('kitchen')
  }

  if (!allLevelsComplete) {
    return (
      <div className="panel master-chef-locked" style={{ backgroundImage: "url('/assets/bg/main-bg.jpg')" }}>
        <div className="tools-overlay" />
        <button className="back-btn" onClick={() => setScreen('main-menu')}>← Back</button>
        <div className="master-chef-content">
          <Lock size={64} />
          <h1>Challenge Mode</h1>
          <p>Complete all 4 levels to unlock the Final Challenge</p>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel master-chef-unlocked" style={{ backgroundImage: "url('/assets/bg/main-bg.jpg')" }}>
      <div className="tools-overlay" />
      <button className="back-btn" onClick={() => setScreen('main-menu')}>← Back</button>
      <div className="master-chef-content">
        <Crown size={64} />
        <h1>🎯 Final Challenge Mode</h1>
        <p>Random recipe, no guide, time limit, strict scoring</p>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
        <button className="proceed-btn primary" onClick={handleStartChallenge}>
          ▶ Start Challenge
        </button>
      </div>
    </div>
  )
}
