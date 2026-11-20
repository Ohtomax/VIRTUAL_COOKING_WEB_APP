import { motion } from 'framer-motion'
import type { DoneFooterBtnProps } from '../../constant/interface'


export default function DoneFooterBtn({ onClick, label = 'Done — Back to Kitchen' }: DoneFooterBtnProps) {
  return (
    <motion.button
      className="g-btn g-btn--gold g-btn--full"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  )
}