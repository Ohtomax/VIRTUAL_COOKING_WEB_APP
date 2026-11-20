/**
 * OrientationGate — asks for landscape on handheld screens.
 *
 * The kitchen is a wide scene: in portrait the stage scales to the narrow
 * width and everything becomes unreadably small. Rather than ship a cramped
 * portrait layout, we hold a full-screen prompt until the device is turned.
 *
 * It only applies to touch devices — a narrow desktop window is still played,
 * just at a smaller scale.
 */
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import GameIcon from './GameIcon'

/** Below this, portrait is too narrow to play comfortably. */
const MAX_PORTRAIT_WIDTH = 1024

export default function OrientationGate() {
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const check = () => {
      const portrait = window.innerHeight > window.innerWidth
      // `pointer: coarse` means a finger — desktop windows are left alone even
      // when they happen to be taller than they are wide.
      const touch = window.matchMedia('(pointer: coarse)').matches
      setBlocked(portrait && touch && window.innerWidth < MAX_PORTRAIT_WIDTH)
    }
    check()
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  return (
    <AnimatePresence>
      {blocked && (
        <motion.div
          className="rotate-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alertdialog"
          aria-label="Please rotate your device"
        >
          <motion.div
            className="rotate-gate-phone"
            animate={{ rotate: [0, 0, -90, -90, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.25, 0.5, 0.85, 1], ease: 'easeInOut' }}
          >
            <div className="rotate-gate-phone-screen" />
          </motion.div>

          <RotateCcw className="rotate-gate-arrow" size={34} strokeWidth={2.4} />

          <h2 className="rotate-gate-title">Turn your device sideways</h2>
          <p className="rotate-gate-text">
            The kitchen needs a wide screen. Rotate to landscape to start cooking.
          </p>
          <GameIcon name="chefHat" size={54} className="rotate-gate-hat" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
