import { useEffect, useRef, useState } from 'react'

/**
 * Measures a carousel viewport and returns how far the peek cards sit to each
 * side. The slide distance used to be a hardcoded px value that had to be kept
 * in sync by hand with the card width in CSS — widening a card then left the
 * peeks overlapping it. Measuring instead keeps them lined up at any width.
 *
 * @param maxCard  the card's max width (must match the CSS `max-width`)
 * @param widthPct the card's share of the viewport below that max
 */
export function useCarouselSlide(maxCard: number, widthPct = 0.78) {
  const ref = useRef<HTMLDivElement>(null)
  const [slide, setSlide] = useState(maxCard * 0.95)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const card = Math.min(maxCard, el.clientWidth * widthPct)
      // Slightly less than a full card width so the neighbours stay visible.
      setSlide(card * 0.95)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [maxCard, widthPct])

  return { ref, slide }
}
