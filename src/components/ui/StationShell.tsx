/**
 * StationShell — shared wrapper for every full-screen station view.
 * Provides: background image, dark scrim, top navbar, bottom footer.
 */
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  bg: string
  bgSize?: string
  bgColor?: string
  title: string
  counter?: ReactNode
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
}

export default function StationShell({
  bg, bgSize = 'cover', bgColor = 'transparent',
  title, counter, onClose, footer, children,
}: Props) {
  return (
    <motion.div
      className="sv-root"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <div
        className="sv-bg"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: bgSize,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: bgColor,
        }}
      />
      <div className="sv-bg-scrim" />

      {/* Navbar */}
      <div className="sv-navbar">
        <button className="g-back-btn" onClick={onClose}>
          <ChevronLeft size={22} strokeWidth={2.5} />
          <span>Kitchen</span>
        </button>
        <div className="sv-navbar-title">{title}</div>
        {counter != null
          ? <div className="sv-counter">{counter}</div>
          : <div style={{ minWidth: 70 }} />
        }
      </div>

      {/* Main content */}
      <div className="sv-body">{children}</div>

      {/* Footer */}
      {footer && <div className="sv-footer">{footer}</div>}
    </motion.div>
  )
}