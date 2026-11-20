import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MainMenu from './pages/MainMenu'
import KitchenTools from './pages/KitchenTools'
import LevelSelection from './pages/LevelSelection'
import RecipeCard from './components/RecipeCard'
import EducationalKitchen from './pages/EducationalKitchen'
import ResultsScreen from './components/ResultsScreen'
import SplashScreen from './components/SplashScreen'
import LevelComplete from './pages/LevelComplete'
import KnowledgeTest from './pages/KnowledgeTest'
import Tutorial from './pages/Tutorial'
import Progress from './components/Progress'
import Settings from './pages/Settings'
import MasterChefMode from './pages/MasterChefMode'
import LoginScreen from './pages/LoginScreen'
import GameStage from './components/ui/GameStage'
import OrientationGate from './components/ui/OrientationGate'
import { usePlayerContext } from './db/PlayerContext'
import { useAudio } from './hooks/useAudio'
import useGameStore from './store/gameStore'
import type { ScreenName } from './constant/types'
import type { AudioSettings } from './constant/interface'
import '../src/styles/app.css'
import '../src/styles/kitchen.css'
import '../src/styles/educational.css'
// Order matters: clay sets the surface language, character then gives it voice
// (type, material, hierarchy) and pulls back clay's uniform glow.
import '../src/styles/clay.css'
import '../src/styles/character.css'

export default function App() {
  const [screen, setScreen] = useState<ScreenName>('main-menu')
  const [showSplash, setShowSplash] = useState(true)
  const [showLogin, setShowLogin] = useState(true)
  const { player, isReady } = usePlayerContext()
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
    <>
      <GameStage>
      <div className="app-root">
      {/* Splash first, then the profile form — the game introduces itself
          before asking the player for anything. */}
      <AnimatePresence>
        {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
        {!showSplash && isReady && showLogin && <LoginScreen onDone={() => setShowLogin(false)} />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.div key={screen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ width: '100%', height: '100%' }}>
      {screen === 'main-menu' && <MainMenu setScreen={setScreen} />}
      {screen === 'kitchen-tools' && <KitchenTools setScreen={setScreen} />}
      {screen === 'level-select' && <LevelSelection setScreen={setScreen} />}
      {screen === 'recipe-card' && <RecipeCard setScreen={setScreen} />}
      {screen === 'kitchen' && <EducationalKitchen onBack={() => setScreen('recipe-card')} onFinish={() => setScreen('results')} />}
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
      </GameStage>
      {/* Outside the stage: the prompt must cover the real viewport at full
          size, not be scaled down with the game. */}
      <OrientationGate />
    </>
  )
}