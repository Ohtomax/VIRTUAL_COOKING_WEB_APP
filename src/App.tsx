import { useState, useEffect } from 'react'
import MainMenu from './pages/MainMenu'
import KitchenTools from './pages/KitchenTools'
import LevelSelection from './pages/LevelSelection'
import RecipeCard from './pages/RecipeCard'
import EducationalKitchen from './pages/EducationalKitchen'
import ResultsScreen from './pages/ResultsScreen'
import Tutorial from './pages/Tutorial'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import MasterChefMode from './pages/MasterChefMode'
import { useAudio } from './hooks/useAudio'
import useGameStore from './store/gameStore'
import type { ScreenName, AudioSettings } from './types'

import './styles/app.css'
import './styles/kitchen.css'
import './styles/educational.css'

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('main-menu')
  const { selectedRecipe } = useGameStore()
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    musicEnabled: true,
    sfxEnabled: true,
    masterVolume: 80,
  })

  useEffect(() => {
    const saved = localStorage.getItem('audioSettings')
    if (saved) {
      try {
        setAudioSettings(JSON.parse(saved))
      } catch {
        // ignore corrupt settings
      }
    }
  }, [])

  useAudio(audioSettings)

  return (
    <div className="app-root">
      {screen === 'main-menu' && <MainMenu setScreen={setScreen} />}
      {screen === 'kitchen-tools' && <KitchenTools setScreen={setScreen} />}
      {screen === 'level-select' && <LevelSelection setScreen={setScreen} />}
      {screen === 'recipe-card' && <RecipeCard setScreen={setScreen} />}
      {screen === 'kitchen' && <EducationalKitchen onBack={() => setScreen('level-select')} onFinish={() => setScreen('results')} />}
      {screen === 'results' && <ResultsScreen setScreen={setScreen} />}
      {screen === 'tutorial' && <Tutorial setScreen={setScreen} />}
      {screen === 'progress' && <Progress setScreen={setScreen} />}
      {screen === 'settings' && (
        <Settings setScreen={setScreen} audioSettings={audioSettings} setAudioSettings={setAudioSettings} />
      )}
      {screen === 'master-chef-mode' && <MasterChefMode setScreen={setScreen} />}
    </div>
  )
}
