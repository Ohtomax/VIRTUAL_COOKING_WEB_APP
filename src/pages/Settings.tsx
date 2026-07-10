import type { SetScreenProps, AudioSettings } from '../types'
import useGameStore from '../store/gameStore'

interface Props extends SetScreenProps {
  audioSettings: AudioSettings
  setAudioSettings: (s: AudioSettings) => void
}

export default function Settings({ setScreen, audioSettings, setAudioSettings }: Props) {
  const { resetAll } = useGameStore()

  const updateSetting = (patch: Partial<AudioSettings>) => {
    const next = { ...audioSettings, ...patch }
    setAudioSettings(next)
    localStorage.setItem('audioSettings', JSON.stringify(next))
  }

  const handleReset = () => {
    if (window.confirm('This will erase ALL progress. Are you sure?')) {
      resetAll()
      localStorage.removeItem('cookingProgress')
      localStorage.removeItem('cooking-game-storage')
    }
  }

  return (
    <div className="panel settings-page" style={{ backgroundImage: "url('/assets/bg/main-bg.jpg')" }}>
      <div className="tools-overlay" />
      <button className="back-btn" onClick={() => setScreen('main-menu')}>← Back</button>

      <div className="settings-content">
        <h1>⚙️ Settings</h1>

        <div className="settings-section">
          <h2>Audio</h2>
          <label className="settings-toggle">
            <span>Background Music</span>
            <input type="checkbox" checked={audioSettings.musicEnabled} onChange={(e) => updateSetting({ musicEnabled: e.target.checked })} />
          </label>
          <label className="settings-toggle">
            <span>Sound Effects</span>
            <input type="checkbox" checked={audioSettings.sfxEnabled} onChange={(e) => updateSetting({ sfxEnabled: e.target.checked })} />
          </label>
          <label className="settings-range">
            <span>Volume: {audioSettings.masterVolume}%</span>
            <input type="range" min={0} max={100} value={audioSettings.masterVolume} onChange={(e) => updateSetting({ masterVolume: Number(e.target.value) })} />
          </label>
        </div>

        <div className="settings-section danger">
          <h2>Data</h2>
          <button className="reset-btn" onClick={handleReset}>🗑 Reset All Progress</button>
        </div>
      </div>
    </div>
  )
}
