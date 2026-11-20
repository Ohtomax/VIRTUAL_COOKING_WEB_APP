import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Square, ThermometerSun, Power, CheckCircle2 } from 'lucide-react'
import useGameStore from '../store/gameStore'
import type { MicrowaveViewProps } from '../constant/interface'
const OVEN_STEPS = [
  { img: '/assets/COOKING PART/17-king-ranch-chicken/8-preheat-the-oven.png', text: 'Preheat the oven to 350°F (175°C)', title: 'PREHEAT' },
  { img: '/assets/COOKING PART/17-king-ranch-chicken/10-open-the-oven.png', text: 'Open the oven door', title: 'OPEN OVEN' },
  { img: '/assets/COOKING PART/17-king-ranch-chicken/12-bake-for-30-50-mins.png', text: 'Place the baking dish inside and set timer for 30-35 mins', title: 'BAKE' },
  { img: '/assets/COOKING PART/17-king-ranch-chicken/13-make-it-bubbly&golden.png', text: 'Bake until bubbly and golden', title: 'CHECK PROGRESS' },
  { img: '/assets/COOKING PART/17-king-ranch-chicken/14-open-the-oven-with-dish.png', text: 'Open oven when done', title: 'FINISH BAKING' },
  { img: '/assets/COOKING PART/17-king-ranch-chicken/15-remove-the-dish.png', text: 'Carefully remove the dish', title: 'REMOVE DISH' },
  { img: '/assets/COOKING PART/17-king-ranch-chicken/16-ready-to-cut.png', text: 'Let it rest for a few minutes', title: 'REST' },
  { img: '/assets/COOKING PART/17-king-ranch-chicken/17-cutted-into-portion.png', text: 'Cut into portions', title: 'PORTION' },
]

export default function MicrowaveView({ onClose, onFinishCooking, selectedRecipe }: MicrowaveViewProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [temperature, setTemperature] = useState('350°F')
  const [served, setServed] = useState(false)

  const { addFeedback } = useGameStore()

  useEffect(() => {
    let timer: any
    if (isRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            setIsRunning(false)
            if (stepIndex === 2) {
              setStepIndex(3)
              addFeedback('Baking progress... looking good!', 'success')
            }
            return 0
          }
          return t - 1
        })
      }, 100)
    }
    return () => clearInterval(timer)
  }, [isRunning, timeRemaining, stepIndex, addFeedback])

  const handleNextStep = () => {
    if (stepIndex === 2 && !isRunning && timeRemaining > 0) {
      setIsRunning(true)
      return
    }
    
    if (stepIndex < OVEN_STEPS.length - 1) {
      setStepIndex(s => s + 1)
      if (stepIndex + 1 === 2) {
        setTimeRemaining(30)
      }
    } else {
      setServed(true)
    }
  }

  const handleServe = () => {
    addFeedback('King Ranch Chicken served perfectly!', 'success')
    onFinishCooking()
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const currentImg = served ? '/assets/COOKING PART/17-king-ranch-chicken/serve.png' : OVEN_STEPS[stepIndex].img
  const currentStepInfo = OVEN_STEPS[stepIndex]

  return (
    <div className="ek-microwave-view">
      <div className="ek-microwave-bg" />
      
      {/* Header */}
      <div className="g-navbar" style={{ position: 'relative', zIndex: 20, background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button className="g-back-btn" onClick={onClose} style={{ color: '#fff' }}>
          <X size={20} strokeWidth={2.5} /><span>Close Station</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="g-navbar-title" style={{ color: '#fff' }}>Oven</span>
          <span className="ek-microwave-subtitle">| King Ranch Chicken</span>
        </div>
      </div>

      <div className="ek-microwave-stage">
        {/* Left: the oven */}
        <div className="ek-microwave-chamber">
          <div className="ek-microwave-frame">
            <div className={`ek-microwave-window ${isRunning ? 'is-running' : ''}`}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImg}
                  src={currentImg}
                  className="ek-microwave-dish-img"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              {isRunning && <div className="ek-microwave-glow-overlay" />}
            </div>
            
            <div className="ek-microwave-caption">
              <div className="ek-microwave-step-num">Step {stepIndex + 1} of {OVEN_STEPS.length}</div>
              <h3 className="ek-microwave-step-title">{currentStepInfo.title}</h3>
              <p className="ek-microwave-step-desc">{currentStepInfo.text}</p>
            </div>
          </div>
        </div>

        {/* Right: Control Panel */}
        <div className="ek-microwave-panel">
          <div className="ek-microwave-led">
            <div className="ek-microwave-led-label">TIME REMAINING</div>
            <div className="ek-microwave-led-time">{formatTime(timeRemaining)}</div>
            <div className="ek-microwave-led-status">
              {isRunning ? 'HEATING...' : (timeRemaining === 0 ? 'DONE' : 'READY')}
            </div>
          </div>

          <div className="ek-microwave-temp-group">
            <label>Temperature / Power</label>
            <div className="ek-microwave-temp-buttons">
              <button className={`ek-temp-btn ${temperature === '350°F' ? 'active' : ''}`} onClick={() => setTemperature('350°F')}>350°F</button>
              <button className={`ek-temp-btn ${temperature === '375°F' ? 'active' : ''}`} onClick={() => setTemperature('375°F')}>375°F</button>
              <button className={`ek-temp-btn ${temperature === 'High' ? 'active' : ''}`} onClick={() => setTemperature('High')}>High</button>
            </div>
          </div>

          <div className="ek-microwave-btn-row">
            <button className="ek-ctrl-btn ek-ctrl-btn--start" onClick={() => setIsRunning(true)} disabled={isRunning || timeRemaining === 0 || served}>
              <Play size={18} fill="currentColor" /> Start
            </button>
            <button className="ek-ctrl-btn ek-ctrl-btn--stop" onClick={() => { setIsRunning(false); setTimeRemaining(30); }}>
              <Square size={16} fill="currentColor" /> Stop / Reset
            </button>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '4px 0' }} />

          <div className="ek-microwave-step-nav">
            <label>Sequence Control</label>
            <div className="ek-microwave-nav-buttons">
              {!served ? (
                <button 
                  className="ek-ctrl-btn ek-ctrl-btn--secondary" 
                  onClick={handleNextStep}
                  disabled={isRunning}
                  style={{ width: '100%' }}>
                  {stepIndex < OVEN_STEPS.length - 1 ? 'Next Step  →' : 'Finish Baking'}
                </button>
              ) : (
                <button 
                  className="ek-ctrl-btn ek-serve-btn" 
                  onClick={handleServe}
                  style={{ width: '100%', padding: '16px' }}>
                  <CheckCircle2 size={20} /> Serve King Ranch Chicken
                </button>
              )}
            </div>
            
            <div className="ek-microwave-dots">
              {OVEN_STEPS.map((_, i) => (
                <div key={i} className={`ek-dot ${i === stepIndex ? 'active' : ''} ${i < stepIndex ? 'done' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
