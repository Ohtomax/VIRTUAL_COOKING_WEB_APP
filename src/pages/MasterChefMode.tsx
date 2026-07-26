import { ChevronLeft, Trophy, Lock, Clock, Target, Zap, Flame } from 'lucide-react'
import { motion } from 'framer-motion'
import useGameStore from '../store/gameStore'
import { recipes } from '../data/recipes'
import type { SetScreenProps } from '../types'

export default function MasterChefMode({ setScreen }: SetScreenProps) {
  const { levelProgress, setSelectedRecipe, resetGame } = useGameStore()
  const allDone = [1,2,3,4].every(id => levelProgress[id]?.completed)

  const feats = [
    { Icon: Clock,   name: 'Time Limit',     desc: 'Cook under pressure'     },
    { Icon: Target,  name: 'No Guide',       desc: 'No recipe steps shown'   },
    { Icon: Zap,     name: 'Random Recipe',  desc: 'Unknown until you start'  },
    { Icon: Flame,   name: 'Strict Scoring', desc: 'Higher accuracy needed'  },
  ]

  const start = () => {
    const r = recipes[Math.floor(Math.random() * recipes.length)]
    resetGame(); setSelectedRecipe(r); useGameStore.setState({ isChallengeMode: true }); setScreen('kitchen')
  }

  return (
    <div className="g-page mc-page">
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => setScreen('main-menu')}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <span className="g-navbar-title">Challenge Mode</span>
      </div>

      <motion.div className={`mc-badge ${!allDone ? 'locked' : ''}`}
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 16 }}>
        {allDone ? <Trophy size={52} strokeWidth={1.4} /> : <Lock size={52} strokeWidth={1.4} />}
      </motion.div>

      <motion.h1 className="mc-title"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        {allDone ? 'Final Challenge' : 'Locked'}
      </motion.h1>
      <motion.p className="mc-desc"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>
        {allDone
          ? 'Prove your culinary skills in the ultimate cooking assessment.'
          : 'Complete all 4 levels to unlock the Final Challenge Mode.'}
      </motion.p>

      <div className="mc-features">
        {feats.map(({ Icon, name, desc }, i) => (
          <motion.div key={i} className="mc-feat"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 + i * 0.07 }}>
            <div className="mc-feat-icon"><Icon size={24} strokeWidth={1.8} /></div>
            <div className="mc-feat-name">{name}</div>
            <div className="mc-feat-desc">{desc}</div>
          </motion.div>
        ))}
      </div>

      {allDone && (
        <motion.button className="g-btn g-btn--gold" style={{ minWidth: 280 }}
          whileTap={{ scale: 0.95 }} onClick={start}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}>
          Start Challenge
        </motion.button>
      )}
    </div>
  )
}