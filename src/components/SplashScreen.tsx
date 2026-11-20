/**
 * SplashScreen — the first thing shown, before the profile form.
 *
 * Uses the same animated logo as the main menu so the game introduces itself
 * with one mark rather than two, with a loading bar underneath while the
 * database and assets warm up.
 */
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import GameLogo from './ui/GameLogo'
import type { SplashScreenProps } from '../constant/interface'

const LOGO = '/assets/bg/upperlogo.png'

/** How long the splash holds before handing over to the profile form. */
const HOLD_MS = 2600

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Creep towards full while the app boots, then hand over. The bar is a
    // progress *indication*, not a measurement — there is nothing meaningful
    // to measure, so it must never look stuck at a number.
    const started = Date.now()
    const tick = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - started) / HOLD_MS) * 100)
      setProgress(pct)
    }, 60)
    const done = setTimeout(onDone, HOLD_MS)
    return () => {
      clearInterval(tick)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <motion.div
      className="splash"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="splash-inner">
        <GameLogo src={LOGO} />

        <div className="splash-load">
          <div className="splash-bar-track">
            <motion.div
              className="splash-bar-fill"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear', duration: 0.08 }}
            />
          </div>
          <div className="splash-load-row">
            <span className="splash-spinner" aria-hidden="true" />
            <span className="splash-load-text">Heating the kitchen…</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
