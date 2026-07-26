/**
 * GameTooltip — first-time contextual hint that shows once per station per session.
 * Dismissed on tap. Stored in localStorage so it doesn't repeat.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props { id: string; text: string; position?: 'top' | 'bottom' }

export default function GameTooltip({ id, text, position = 'bottom' }: Props) {
  const key = `tip-${id}`
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(key)) {
      const t = setTimeout(() => setShow(true), 600)
      return () => clearTimeout(t)
    }
  }, [key])

  const dismiss = () => { setShow(false); localStorage.setItem(key, '1') }

  return (
    <AnimatePresence>
      {show && (
        <motion.div className={`game-tip game-tip--${position}`}
          initial={{ opacity: 0, y: position === 'top' ? -10 : 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={dismiss}>
          <span className="game-tip-text">{text}</span>
          <span className="game-tip-dismiss">Tap to dismiss</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}