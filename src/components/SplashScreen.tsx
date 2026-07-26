/**
 * SplashScreen — branded loading screen shown once per session.
 */
import { motion } from 'framer-motion'

interface Props { onDone: () => void }

export default function SplashScreen({ onDone }: Props) {
  return (
    <motion.div className="splash"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => setTimeout(onDone, 2000)}>
      <div className="splash-inner">
        <motion.div className="splash-icon"
          initial={{ scale: 0.5, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12 }}>
          🍳
        </motion.div>
        <motion.h1 className="splash-title"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}>
          Virtual Cooking Laboratory
        </motion.h1>
        <motion.p className="splash-sub"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>
          Learn to cook. Master the kitchen.
        </motion.p>
        <motion.div className="splash-bar"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, delay: 0.4, ease: 'easeInOut' }} />
      </div>
    </motion.div>
  )
}