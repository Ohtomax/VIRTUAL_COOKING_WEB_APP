/**
 * GameStage — fills the window without ever reflowing the layout.
 *
 * The game is laid out at one fixed design resolution, and the stage is then
 * sized and scaled so it covers the viewport exactly — no letterbox bars.
 *
 * Two rules do the work:
 *
 *   1. **Never magnify.** The scale is capped at 1, so on a desktop window at
 *      or above the design size everything renders at its native size: the
 *      original look, not a zoomed one. A window smaller than the design size
 *      scales down so nothing is cut off.
 *
 *   2. **Grow the stage, don't bar it.** Whatever space the scale leaves over
 *      is given to the stage as extra design-space width or height
 *      (`viewport / scale`), so the stage always renders at exactly the
 *      viewport size. Backgrounds are full-bleed and stations are positioned
 *      in percentages, so the extra space becomes more kitchen — the same
 *      thing that happened when the app simply filled the window.
 *
 * The result: identical element sizes everywhere, and no dead space on any
 * screen. It also means the 7,000+ lines of existing px-based CSS keep
 * working as-is.
 *
 * Children that use `position: fixed` stay inside the stage, because a
 * transformed ancestor becomes their containing block — and since the stage
 * now matches the viewport, they land on the true window edges. Anything
 * portalled to `document.body` would escape, so portals target `#game-stage`
 * instead (see STAGE_ID).
 */
import { useEffect, useState } from 'react'
import type { GameStageProps } from '../../constant/interface'

/** The resolution the game is designed at. */
export const STAGE_WIDTH = 1280
export const STAGE_HEIGHT = 800

/**
 * Never scale past 1:1. Magnifying a desktop window would make the game look
 * zoomed rather than original; shrinking is only ever a fallback for screens
 * smaller than the design size.
 */
const MAX_SCALE = 1

/** Portal targets must mount inside the stage, not on <body>. */
export const STAGE_ID = 'game-stage'

export function getStageRoot(): HTMLElement {
  return document.getElementById(STAGE_ID) ?? document.body
}

interface Fit {
  scale: number
  width: number
  height: number
}

const DESIGN_FIT: Fit = { scale: 1, width: STAGE_WIDTH, height: STAGE_HEIGHT }

function measure(): Fit {
  const vw = window.innerWidth
  const vh = window.innerHeight
  // A hidden or zero-sized window makes the scale 0, and dividing by it would
  // hand React a NaN width. Fall back to the design size until it has a size.
  if (!vw || !vh) return DESIGN_FIT
  // The limiting axis decides the scale, so the design size is never cropped.
  const scale = Math.min(MAX_SCALE, vw / STAGE_WIDTH, vh / STAGE_HEIGHT)
  // Size the stage so that stage * scale === viewport, leaving no dead space.
  return {
    scale,
    width: Math.max(STAGE_WIDTH, vw / scale),
    height: Math.max(STAGE_HEIGHT, vh / scale),
  }
}

export default function GameStage({ children }: GameStageProps) {
  const [fit, setFit] = useState<Fit>(() =>
    typeof window === 'undefined' ? DESIGN_FIT : measure(),
  )

  useEffect(() => {
    const update = () => setFit(measure())
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return (
    <div className="game-viewport">
      <div
        id={STAGE_ID}
        className="game-stage"
        style={{
          width: fit.width,
          height: fit.height,
          transform: `scale(${fit.scale})`,
          // `vw`/`vh` inside the stage would resolve against the real viewport,
          // not the (larger, scaled) stage — so the CSS uses these instead.
          '--stage-w': `${fit.width}px`,
          '--stage-h': `${fit.height}px`,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  )
}
