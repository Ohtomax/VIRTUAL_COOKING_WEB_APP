import { ChevronLeft, Volume2, Music, Trash2 } from 'lucide-react'
import useGameStore from '../store/gameStore'
import type { SetScreenProps, AudioSettings } from '../types'

interface Props extends SetScreenProps { audioSettings: AudioSettings; setAudioSettings: (s: AudioSettings) => void }

export default function Settings({ setScreen, audioSettings, setAudioSettings }: Props) {
  const { resetAll } = useGameStore()
  const upd = (patch: Partial<AudioSettings>) => {
    const next = { ...audioSettings, ...patch }
    setAudioSettings(next)
    localStorage.setItem('audioSettings', JSON.stringify(next))
  }
  const handleReset = () => {
    if (window.confirm('This will erase ALL progress. Are you sure?')) {
      resetAll(); localStorage.removeItem('cooking-game-storage')
    }
  }

  return (
    <div className="g-page">
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => setScreen('main-menu')}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <span className="g-navbar-title">Settings</span>
      </div>
      <div className="g-page-body">

        <div className="g-section-label">Audio</div>
        <div className="settings-list">
          <div className="settings-row" style={{cursor:'default'}}>
            <div className="settings-row-icon" style={{background:'var(--gold-dim)',color:'var(--gold)'}}><Music size={18} strokeWidth={2}/></div>
            <span className="settings-row-label">Background Music</span>
            <div className={`g-toggle ${audioSettings.musicEnabled ? 'on' : ''}`}
              onClick={() => upd({ musicEnabled: !audioSettings.musicEnabled })} />
          </div>
          <div className="settings-row" style={{cursor:'default'}}>
            <div className="settings-row-icon" style={{background:'var(--green-dim)',color:'var(--green)'}}><Volume2 size={18} strokeWidth={2}/></div>
            <span className="settings-row-label">Sound Effects</span>
            <div className={`g-toggle ${audioSettings.sfxEnabled ? 'on' : ''}`}
              onClick={() => upd({ sfxEnabled: !audioSettings.sfxEnabled })} />
          </div>
          <div className="settings-row" style={{cursor:'default',flexDirection:'column',alignItems:'stretch',gap:12}}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div className="settings-row-icon" style={{background:'var(--amber-dim)',color:'var(--gold)'}}><Volume2 size={18} strokeWidth={2}/></div>
              <span className="settings-row-label">Volume</span>
              <span className="settings-row-value">{audioSettings.masterVolume}%</span>
            </div>
            <input type="range" min={0} max={100} value={audioSettings.masterVolume}
              onChange={e => upd({ masterVolume: Number(e.target.value) })}
              className="g-slider" />
          </div>
        </div>

        <div className="g-section-label">Data</div>
        <div className="settings-list">
          <div className="settings-row" onClick={handleReset}>
            <div className="settings-row-icon" style={{background:'rgba(255,59,48,0.15)',color:'var(--red)'}}><Trash2 size={18} strokeWidth={2}/></div>
            <span className="settings-row-label" style={{color:'var(--red)'}}>Reset All Progress</span>
          </div>
        </div>

        <p style={{fontSize:13,color:'var(--text-3)',textAlign:'center',marginTop:28,lineHeight:1.6}}>
          Virtual Cooking Laboratory v1.0<br/>All data stored locally on this device.
        </p>
      </div>
    </div>
  )
}