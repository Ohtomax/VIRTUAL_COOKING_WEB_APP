/**
 * GameLogo — the title logo, animated the way Terraria's is.
 *
 * Terraria's logo is never static: it breathes with a slow squash-and-stretch
 * and a gentle sway, and it reacts when you touch it. This does the same —
 * an idle bob/sway loop, a tilt that leans toward the pointer, and a springy
 * squash on click — plus a shine that sweeps across the artwork.
 */
import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import type { GameLogoProps } from '../../constant/interface'
export default function GameLogo({ src, alt = 'Virtual Cooking Laboratory' }: GameLogoProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [poked, setPoked] = useState(0)
  const reduceMotion = useReducedMotion()

  // Pointer position within the logo, -0.5 … 0.5 on each axis.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 190, damping: 16, mass: 0.6 }
  const sx = useSpring(px, spring)
  const sy = useSpring(py, spring)

  // Lean toward the pointer. Y drives rotateX inverted so the logo tips
  // *toward* the cursor rather than away from it.
  const rotateY = useTransform(sx, [-0.5, 0.5], [-13, 13])
  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9])
  // Slides the sheen's gradient across the (logo-masked) overlay.
  const shinePos = useTransform(sx, [-0.5, 0.5], ['100%', '0%'])

  const onMove = (e: React.PointerEvent) => {
    if (reduceMotion) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  const onLeave = () => { px.set(0); py.set(0) }

  return (
    <motion.div
      ref={ref}
      className="menu-logo-wrap"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerDown={() => setPoked(n => n + 1)}
      initial={{ scale: 0.8, opacity: 0, y: -18 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 14, stiffness: 180 }}
      style={{ perspective: 700 }}
    >
      <motion.div
        className="menu-logo-tilt"
        style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        // The idle loop: a slow breath plus a sway, on their own timings so the
        // two never line up into an obvious repeat.
        animate={reduceMotion ? undefined : {
          y: [0, -9, 0, -5, 0],
          rotate: [0, 1.4, 0, -1.4, 0],
          scaleX: [1, 1.035, 1, 0.975, 1],
          scaleY: [1, 0.968, 1, 1.03, 1],
        }}
        transition={reduceMotion ? undefined : {
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* The squash lives on its own node so a poke can play over the idle loop. */}
        <motion.div
          key={poked}
          className="menu-logo-squash"
          animate={poked === 0 || reduceMotion
            ? {}
            : { scaleX: [1, 1.18, 0.93, 1.05, 1], scaleY: [1, 0.8, 1.1, 0.97, 1] }}
          transition={{ duration: 0.72, ease: 'easeOut', times: [0, 0.18, 0.42, 0.68, 1] }}
          style={{ transformOrigin: '50% 85%' }}
        >
          <img src={src} alt={alt} className="menu-logo" draggable={false} />
          {!reduceMotion && (
            // Masked by the logo artwork so the sheen only lights the sign
            // itself — unmasked, the blurred band brightened the whole box.
            <motion.span
              className="menu-logo-shine"
              aria-hidden="true"
              style={{
                backgroundPositionX: shinePos,
                WebkitMaskImage: `url(${src})`,
                maskImage: `url(${src})`,
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
