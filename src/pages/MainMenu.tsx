import { BookOpen, BarChart3, Settings, Trophy, Lock, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import useGameStore from '../store/gameStore'
import GameLogo from '../components/ui/GameLogo'
import GameIcon from '../components/ui/GameIcon'
import type { SetScreenProps } from '../constant/interface'
const logo = '/assets/bg/upperlogo.png'

const MENU_ITEMS = (allDone: boolean) => [
  { icon: null,  art: 'chefHat' as const, label: 'Start Game',    sub: 'Pick a dish and get on the line',      screen: 'kitchen-tools'    as const, primary: true,  locked: false     },
  { icon: BookOpen,                label: 'Tutorial',      sub: 'How the kitchen works',               screen: 'tutorial'         as const, primary: false, locked: false     },
  { icon: BarChart3,               label: 'Progress',      sub: 'Every dish you have plated',        screen: 'progress'         as const, primary: false, locked: false     },
  { icon: Settings,                label: 'Settings',      sub: 'Sound and preferences',             screen: 'settings'         as const, primary: false, locked: false     },
  { icon: allDone ? Trophy : Lock, label: 'Challenge',     sub: allDone ? 'Service, no recipe card' : 'Finish every level first', screen: 'master-chef-mode' as const, primary: false, locked: !allDone },
]

export default function MainMenu({ setScreen }: SetScreenProps) {
  const { levelProgress } = useGameStore()
  const allDone = [1, 2, 3, 4].every(id => levelProgress[id]?.completed)
  const items   = MENU_ITEMS(allDone)

  return (
    <div className="main-menu" style={{ backgroundImage: "url('/assets/bg/main-bg.jpg')" }}>
      <div className="menu-scrim" />

      <div className="menu-inner">
        {/* Logo — Terraria-style: never still, and it reacts to you. */}
        <GameLogo src={logo} />

        <motion.h1 className="menu-title"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}>
          Virtual Cooking Lab
        </motion.h1>
        <motion.p className="menu-tagline"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.18 }}>
          Mise en place, then heat.
        </motion.p>

        {/* Menu buttons — compact sizing */}
        <div className="menu-list">
          {items.map(({ icon: Icon, art, label, sub, screen, primary, locked }: any, i: number) => (
            <motion.button key={label}
              className={`menu-item ${primary ? 'menu-item--primary' : ''} ${locked ? 'menu-item--locked' : ''}`}
              onClick={() => !locked && setScreen(screen)}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.22 + i * 0.06, type: 'spring', damping: 20 }}
              whileTap={!locked ? { scale: 0.97 } : {}}>
              <div className="menu-item-icon">
                {art ? <GameIcon name={art} size={26} /> : <Icon size={20} strokeWidth={2} />}
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