import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toolCategories } from '../data/tools'
import { useCarouselSlide } from '../hooks/useCarouselSlide'
import ChefMascot from '../components/ui/ChefMascot'
import GameIcon from '../components/ui/GameIcon'
import { TOOL_CATEGORY_ICONS, GAME_ICONS } from '../data/gameIcons'
import useGameStore from '../store/gameStore'
import type { SetScreenProps, ToolCategory } from '../constant/interface'
export default function KitchenTools({ setScreen }: SetScreenProps) {
  const [selected, setSelected] = useState<ToolCategory | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [typeIndex, setTypeIndex] = useState(0)
  const { toolsViewed, markToolViewed, isAllToolsViewed } = useGameStore()
  // Must match the card max-width in app.css (.kt-carousel-card / .kt-type-carousel-card).
  const cats  = useCarouselSlide(840)
  const types = useCarouselSlide(840)
  const allViewed = isAllToolsViewed()
  const total     = toolCategories.length

  const goPrev = () => setCarouselIndex(i => Math.max(0, i - 1))
  const goNext = () => setCarouselIndex(i => Math.min(toolCategories.length - 1, i + 1))

  const goPrevType = () => setTypeIndex(i => Math.max(0, i - 1))
  const goNextType = () => setTypeIndex(i => Math.min((selected?.types.length ?? 1) - 1, i + 1))

  const openCategory = (cat: ToolCategory) => {
    setSelected(cat)
    setTypeIndex(0)
  }

  return (
    <div className="g-page">
      <ChefMascot size={124} corner="bottom-left" />
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => selected ? setSelected(null) : setScreen('main-menu')}>
          <ChevronLeft size={20} strokeWidth={2.5} />
          <span>{selected ? selected.name : 'Back'}</span>
        </button>
        <span className="g-navbar-title">{selected ? selected.name : 'Kitchen Tools'}</span>
      </div>

      <div className="g-page-body g-page-body--no-sheet g-page-body--wide">
        {!selected ? (
          <>
            <div className="kt-banner">
              <div className="kt-banner-row">
                <div className="kt-banner-icon"><GameIcon name="utensils" size={34} /></div>
                <div>
                  <div className="kt-banner-label">Categories Explored</div>
                  <div className="kt-banner-count">
                    {toolsViewed.length}<span className="kt-banner-count-total"> / {total}</span>
                  </div>
                  <div className="kt-banner-sub">Know your tools before you cook</div>
                </div>
              </div>
              <div className="kt-banner-progress">
                <div className="kt-banner-pips">
                  {toolCategories.map(cat => (
                    <div key={cat.id} className={`kt-banner-pip ${toolsViewed.includes(cat.id) ? 'filled' : ''}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="g-section-label">Tool Categories</div>

            <div className="kt-carousel">
              <button
                className="kt-carousel-arrow kt-carousel-arrow--left"
                onClick={goPrev}
                disabled={carouselIndex === 0}
                aria-label="Previous category">
                <ChevronLeft size={34} strokeWidth={2.5} />
              </button>

              <div className="kt-carousel-viewport" ref={cats.ref}>
                {toolCategories.map((cat, i) => {
                  const viewed  = toolsViewed.includes(cat.id)
                  const offset  = i - carouselIndex
                  if (Math.abs(offset) > 1) return null

                  return (
                    <motion.div key={cat.id}
                      className={`kt-card kt-carousel-card ${viewed ? 'viewed' : ''} ${offset === 0 ? 'kt-carousel-card--active' : 'kt-carousel-card--peek'}`}
                      onClick={() => offset === 0 ? openCategory(cat) : setCarouselIndex(i)}
                      animate={{
                        x: offset * cats.slide,
                        scale: offset === 0 ? 1 : 0.82,
                        opacity: offset === 0 ? 1 : 0.45,
                        zIndex: offset === 0 ? 10 : 1,
                      }}
                      initial={false}
                      transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                      whileHover={offset === 0 ? { scale: 1.03 } : {}}
                      whileTap={{ scale: offset === 0 ? 0.97 : 0.82 }}>
                      <div className="kt-card-icon"><GameIcon src={TOOL_CATEGORY_ICONS[cat.id] ?? GAME_ICONS.utensils} size={64} /></div>
                      <div className="kt-card-name">{cat.name}</div>
                      <div className="kt-card-desc">{cat.description}</div>
                      {viewed && (
                        <div className="kt-card-viewed">
                          <CheckCircle2 size={17} strokeWidth={2.5} /> Viewed
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              <button
                className="kt-carousel-arrow kt-carousel-arrow--right"
                onClick={goNext}
                disabled={carouselIndex === toolCategories.length - 1}
                aria-label="Next category">
                <ChevronRight size={34} strokeWidth={2.5} />
              </button>
            </div>

            <div className="kt-carousel-dots">
              {toolCategories.map((cat, i) => (
                <button
                  key={cat.id}
                  className={`kt-carousel-dot ${i === carouselIndex ? 'active' : ''} ${toolsViewed.includes(cat.id) ? 'viewed' : ''}`}
                  onClick={() => setCarouselIndex(i)}
                  aria-label={`Go to ${cat.name}`}
                />
              ))}
            </div>

            <div className="kt-footer">
              <p className={`kt-footer-hint ${allViewed ? 'ready' : ''}`}>
                {allViewed ? 'Tools learned — the kitchen is open' : 'Walk the five racks to continue'}
              </p>
              <button
                className="kt-btn-minimal"
                disabled={!allViewed}
                onClick={() => allViewed && setScreen('level-select')}>
                Continue to Levels
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="g-section-label">Types of {selected.name}</div>

            <div className="kt-carousel">
              <button
                className="kt-carousel-arrow"
                onClick={goPrevType}
                disabled={typeIndex === 0}
                aria-label="Previous type">
                <ChevronLeft size={34} strokeWidth={2.5} />
              </button>

              <div className="kt-type-carousel-viewport" ref={types.ref}>
                {selected.types.map((t, i) => {
                  const offset = i - typeIndex
                  if (Math.abs(offset) > 1) return null

                  return (
                    <motion.div key={i}
                      className={`kt-type-card kt-type-carousel-card ${offset === 0 ? 'kt-type-carousel-card--active' : 'kt-type-carousel-card--peek'}`}
                      onClick={() => offset !== 0 && setTypeIndex(i)}
                      animate={{
                        x: offset * types.slide,
                        scale: offset === 0 ? 1 : 0.82,
                        opacity: offset === 0 ? 1 : 0.45,
                        zIndex: offset === 0 ? 10 : 1,
                      }}
                      initial={false}
                      transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                      whileHover={offset === 0 ? { scale: 1.03 } : {}}>
                      <img src={t.image} alt={t.name} className="kt-type-img kt-type-img--big"
                        onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                      <div className="kt-type-name">{t.name}</div>
                      <div className="kt-type-info">
                        <span className="kt-type-label">How to use</span>{t.use}
                        <span className="kt-type-label">Best for</span>{t.bestFor}
                        <span className="kt-type-label">Tip</span>
                        Wipe it down after every use — a dull, dirty tool is a slow one.
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <button
                className="kt-carousel-arrow"
                onClick={goNextType}
                disabled={typeIndex === selected.types.length - 1}
                aria-label="Next type">
                <ChevronRight size={34} strokeWidth={2.5} />
              </button>
            </div>

            <div className="kt-carousel-dots">
              {selected.types.map((_, i) => (
                <button
                  key={i}
                  className={`kt-carousel-dot ${i === typeIndex ? 'active' : ''}`}
                  onClick={() => setTypeIndex(i)}
                  aria-label={`Go to type ${i + 1}`}
                />
              ))}
            </div>

            <div className="kt-footer">
              <button className="kt-btn-minimal kt-btn-minimal--solid"
                onClick={() => { markToolViewed(selected.id); setSelected(null) }}>
                <CheckCircle2 size={18} strokeWidth={2.5} /> Mark as Viewed
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}