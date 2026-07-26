import { motion } from 'framer-motion'

interface Props { onClick: () => void; label?: string }

export default function DoneFooterBtn({ onClick, label = 'Done — Back to Kitchen' }: Props) {
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