import { ChevronLeft, Utensils, ShoppingBasket, Waves, Scissors, Scale, Flame, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import type { SetScreenProps } from '../types'

const steps = [
  { Icon: Utensils,       title: 'Explore Tools',       desc: 'Learn all kitchen tools — knives, pans, utensils, and measuring tools. View every category to unlock cooking.' },
  { Icon: ShoppingBasket, title: 'Select a Recipe',      desc: 'Choose a level and recipe. Study the recipe card before entering the kitchen.' },
  { Icon: ShoppingBasket, title: 'Gather Ingredients',   desc: 'Open the refrigerator, cabinet, and table to collect the correct ingredients.' },
  { Icon: Waves,          title: 'Wash Ingredients',     desc: 'Turn on the sink faucet and tap each ingredient to clean it before preparation.' },
  { Icon: Scissors,       title: 'Slice & Prep',         desc: 'Select a cutting technique (chopping, slicing, dicing, julienne) and slice each ingredient.' },
  { Icon: Scale,          title: 'Measure Accurately',   desc: 'Use measuring cups and spoons. Precision directly affects your final score.' },
  { Icon: Flame,          title: 'Cook on the Stove',    desc: 'Select cookware, set heat level, and follow cooking steps. Too high and the food burns!' },
  { Icon: Star,           title: 'Earn Your Score',      desc: 'Scored on accuracy, washing, cutting, cooking, and timing. Reach 3 stars to master a recipe.' },
]

export default function Tutorial({ setScreen }: SetScreenProps) {
  return (
    <div className="g-page">
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => setScreen('main-menu')}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <span className="g-navbar-title">How to Play</span>
      </div>
      <div className="g-page-body">
        <div className="tut-list">
          {steps.map(({ Icon, title, desc }, i) => (
            <motion.div key={i} className="tut-row"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}>
              <div className="tut-num">{i+1}</div>
              <div className="tut-icon"><Icon size={22} strokeWidth={1.8} /></div>
              <div className="tut-info">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}