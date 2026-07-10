import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import useGameStore from '../../store/gameStore'
import type { Ingredient, Recipe, CookingStep, HeatLevel } from '../../types'

interface Props {
  selectedIngredients: Ingredient[]
  onClose: () => void
  onFinishCooking: () => void
  selectedRecipe: Recipe | null
}

type Cookware = { id: string; name: string; emoji: string }
const cookwareOptions: Cookware[] = [
  { id: 'pot', name: 'Pot', emoji: '🍲' },
  { id: 'pan', name: 'Pan', emoji: '🍳' },
]

const heatLevels: { key: HeatLevel; label: string; color: string }[] = [
  { key: 'low', label: '🔵 Low', color: '#3b82f6' },
  { key: 'medium', label: '🟢 Medium', color: '#22c55e' },
  { key: 'high', label: '🔴 High', color: '#ef4444' },
]

export default function StovePopup({ selectedIngredients, onClose, onFinishCooking, selectedRecipe }: Props) {
  const { setHeatLevel, heatLevel, setBurnedFood, setUndercookedFood, setCookingElapsedTime, startCooking, stopCooking } = useGameStore()

  const [cookware, setCookware] = useState<Cookware | null>(null)
  const [isStoveOn, setIsStoveOn] = useState(false)
  const [temperature, setTemperature] = useState(20)
  const [timer, setTimer] = useState(0)
  const [currentStepIdx, setCurrentStepIdx] = useState(0)
  const [isCookingComplete, setIsCookingComplete] = useState(false)

  const steps: CookingStep[] = selectedRecipe?.steps.map((s, i) => ({
    id: i + 1,
    name: s,
    status: i < currentStepIdx ? 'completed' : i === currentStepIdx ? 'in-progress' : 'pending',
  })) ?? []

  // Temperature simulation
  useEffect(() => {
    if (!isStoveOn) return
    const interval = setInterval(() => {
      setTemperature((prev) => {
        const target = heatLevel === 'high' ? 200 : heatLevel === 'medium' ? 120 : heatLevel === 'low' ? 70 : 20
        if (prev < target) return prev + 2
        if (prev > target) return prev - 1
        return prev
      })
    }, 200)
    return () => clearInterval(interval)
  }, [isStoveOn, heatLevel])

  // Timer
  useEffect(() => {
    if (!isStoveOn || !cookware) return
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isStoveOn, cookware])

  // Auto-advance steps based on temperature + timer
  useEffect(() => {
    if (!isStoveOn || isCookingComplete || !selectedRecipe) return
    const totalSteps = selectedRecipe.steps.length

    // Simple progression: advance step every ~15 seconds when temp is above 60
    if (temperature >= 60 && timer > 0 && timer % 15 === 0 && currentStepIdx < totalSteps) {
      setCurrentStepIdx((prev) => Math.min(prev + 1, totalSteps))
    }

    // Burn detection
    if (temperature > 180) {
      setBurnedFood(true)
    }

    // Complete check
    if (currentStepIdx >= totalSteps) {
      setIsCookingComplete(true)
      stopCooking()
      setCookingElapsedTime(timer)
    }
  }, [timer, temperature])

  const handleStoveToggle = () => {
    if (!cookware) return
    const next = !isStoveOn
    setIsStoveOn(next)
    if (next) {
      startCooking()
    } else {
      stopCooking()
      if (temperature < 60) setUndercookedFood(true)
    }
  }

  const handleHeat = (level: HeatLevel) => {
    setHeatLevel(level)
  }

  const handleFinish = () => {
    setCookingElapsedTime(timer)
    onFinishCooking()
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <motion.div className="station-popup-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="station-popup-panel stove-panel"
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.85 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="station-close-btn" onClick={onClose}>✕</button>

        <div className="stove-layout">
          {/* Left — Cooking Steps */}
          <div className={`stove-steps-panel ${!cookware || !isStoveOn ? 'disabled' : ''}`}>
            <h3>Cooking Steps</h3>
            {steps.map((step) => (
              <div key={step.id} className={`stove-step ${step.status}`}>
                <span className="step-num">{step.id}</span>
                <span className="step-text">{step.name}</span>
                <span className="step-icon">
                  {step.status === 'completed' ? '✅' : step.status === 'in-progress' ? '🔄' : '⏳'}
                </span>
              </div>
            ))}
            {isCookingComplete && (
              <motion.div className="cooking-complete-banner" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                🎉 Cooking Complete!
                <button className="proceed-btn primary" onClick={handleFinish}>
                  View Results
                </button>
              </motion.div>
            )}
          </div>

          {/* Right — Controls */}
          <div className="stove-controls-panel">
            <h3>Cooking HUD</h3>

            {/* Temperature */}
            <div className="stove-temp-display">
              <span className="temp-label">Temperature</span>
              <span className="temp-value">{Math.round(temperature)}°C</span>
              <div className="temp-bar">
                <div className="temp-fill" style={{ width: `${Math.min(100, ((temperature - 20) / 180) * 100)}%` }} />
              </div>
            </div>

            {/* Timer */}
            <div className="stove-timer-display">
              <span>⏱ {formatTime(timer)}</span>
            </div>

            {/* Cookware Selection */}
            {!cookware ? (
              <div className="cookware-selection">
                <p>Select cookware:</p>
                <div className="cookware-options">
                  {cookwareOptions.map((c) => (
                    <button key={c.id} className="cookware-btn" onClick={() => setCookware(c)}>
                      {c.emoji} {c.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="cookware-selected">
                <span>{cookware.emoji} {cookware.name}</span>
              </div>
            )}

            {/* Burner Toggle */}
            <button
              className={`burner-toggle ${isStoveOn ? 'on' : ''}`}
              onClick={handleStoveToggle}
              disabled={!cookware}
            >
              {isStoveOn ? '🔥 Burner ON' : '⭕ Turn Burner ON'}
            </button>

            {/* Heat Controls */}
            {isStoveOn && (
              <div className="heat-controls">
                {heatLevels.map((h) => (
                  <button
                    key={h.key}
                    className={`heat-btn ${heatLevel === h.key ? 'active' : ''}`}
                    onClick={() => handleHeat(h.key)}
                    style={{ borderColor: heatLevel === h.key ? h.color : 'transparent' }}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            )}

            {/* Warnings */}
            {temperature > 180 && <div className="cooking-warning">🔴 Heat too high! Food is burning!</div>}
            {isStoveOn && heatLevel === 'off' && <div className="cooking-warning">🔵 Set a heat level to start cooking</div>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
