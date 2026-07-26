import { ChefHat, BookOpen, BarChart3, Settings, Trophy, Lock, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import useGameStore from '../store/gameStore'
import type { SetScreenProps } from '../types'
import logo from '../../public/assets/bg/upperlogo.png'

const MENU_ITEMS = (allDone: boolean) => [
  { icon: ChefHat,                 label: 'Start Game',    sub: 'Begin your cooking journey',      screen: 'kitchen-tools'    as const, primary: true,  locked: false     },
  { icon: BookOpen,                label: 'Tutorial',      sub: 'Learn how to play',               screen: 'tutorial'         as const, primary: false, locked: false     },
  { icon: BarChart3,               label: 'Progress',      sub: 'View your cooking history',        screen: 'progress'         as const, primary: false, locked: false     },
  { icon: Settings,                label: 'Settings',      sub: 'Audio & preferences',             screen: 'settings'         as const, primary: false, locked: false     },
  { icon: allDone ? Trophy : Lock, label: 'Challenge',     sub: allDone ? 'Final assessment' : 'Complete all levels first', screen: 'master-chef-mode' as const, primary: false, locked: !allDone },
]

export default function MainMenu({ setScreen }: SetScreenProps) {
  const { levelProgress } = useGameStore()
  const allDone = [1, 2, 3, 4].every(id => levelProgress[id]?.completed)
  const items   = MENU_ITEMS(allDone)

  return (
    <div className="main-menu" style={{ backgroundImage: "url('/assets/bg/main-bg.jpg')" }}>
      <div className="menu-scrim" />

      <div className="menu-inner">
        {/* Logo */}
        <motion.img src={logo} alt="Logo" className="menu-logo"
          initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }} />

        <motion.h1 className="menu-title"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          Virtual Cooking Lab
        </motion.h1>
        <motion.p className="menu-tagline"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}>
          Learn to cook. Master the kitchen.
        </motion.p>

        {/* Menu buttons — compact sizing */}
        <div className="menu-list">
          {items.map(({ icon: Icon, label, sub, screen, primary, locked }, i) => (
            <motion.button key={label}
              className={`menu-item ${primary ? 'menu-item--primary' : ''} ${locked ? 'menu-item--locked' : ''}`}
              onClick={() => !locked && setScreen(screen)}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 + i * 0.06, type: 'spring', damping: 20 }}
              whileTap={!locked ? { scale: 0.97 } : {}}>
              <div className="menu-item-icon">
                <Icon size={20} strokeWidth={2} />
              </div>
              <div className="menu-item-text">
                <span className="menu-item-title">{label}</span>
                <span className="menu-item-sub">{sub}</span>
              </div>
              <ChevronRight size={16} strokeWidth={2.5} className="menu-item-arrow" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}