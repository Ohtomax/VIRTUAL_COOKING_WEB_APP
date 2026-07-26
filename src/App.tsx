import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MainMenu from './pages/MainMenu'
import KitchenTools from './pages/KitchenTools'
import LevelSelection from './pages/LevelSelection'
import RecipeCard from './pages/RecipeCard'
import EducationalKitchen from './pages/EducationalKitchen'
import ResultsScreen from './pages/ResultsScreen'
import SplashScreen from './components/SplashScreen'
import LevelComplete from './pages/LevelComplete'
import KnowledgeTest from './pages/KnowledgeTest'
import Tutorial from './pages/Tutorial'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import MasterChefMode from './pages/MasterChefMode'
import { useAudio } from './hooks/useAudio'
import useGameStore from './store/gameStore'
import type { ScreenName, AudioSettings } from './types'

import '../src/styles/app.css'
import '../src/styles/kitchen.css'
import '../src/styles/educational.css'

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('main-menu')
  const [showSplash, setShowSplash] = useState(true)
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
      <AnimatePresence>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ width: '100%', height: '100%' }}>
      {screen === 'main-menu' && <MainMenu setScreen={setScreen} />}
      {screen === 'kitchen-tools' && <KitchenTools setScreen={setScreen} />}
      {screen === 'level-select' && <LevelSelection setScreen={setScreen} />}
      {screen === 'recipe-card' && <RecipeCard setScreen={setScreen} />}
      {screen === 'kitchen' && <EducationalKitchen onBack={() => setScreen('level-select')} onFinish={() => setScreen('results')} />}
      {screen === 'results' && <ResultsScreen setScreen={setScreen} />}
      {screen === 'level-complete' && <LevelComplete setScreen={setScreen} />}
      {screen === 'pre-test' && <KnowledgeTest setScreen={setScreen} mode="pre" />}
      {screen === 'post-test' && <KnowledgeTest setScreen={setScreen} mode="post" />}
      {screen === 'tutorial' && <Tutorial setScreen={setScreen} />}
      {screen === 'progress' && <Progress setScreen={setScreen} />}
      {screen === 'settings' && (
        <Settings setScreen={setScreen} audioSettings={audioSettings} setAudioSettings={setAudioSettings} />
      )}
      {screen === 'master-chef-mode' && <MasterChefMode setScreen={setScreen} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}