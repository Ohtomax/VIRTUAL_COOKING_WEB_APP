import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, CheckCircle2, AlertCircle, XCircle, Unlock, Trophy, Shield } from 'lucide-react'
import useGameStore from '../store/gameStore'
import { recipes } from '../data/recipes'
import { COOKING_STEP_IMAGES, resolveOutcomeImages } from '../data/cookingStepImages'
import type { SetScreenProps } from '../constant/interface'
export default function ResultsScreen({ setScreen }: SetScreenProps) {
  const { selectedRecipe, calculateScores, saveRecipeProgress,
    totalScore, starRating, grade, scores, ingredientErrors, safetyWarnings,
    unlockedRecipes, unlockedLevels, washedIngredients, resetGame, sopResults,
    burnedFood } = useGameStore()

  // Snapshot unlocks BEFORE saving, so we can show what's newly unlocked
  const preRecipes = useRef<number[]>([])
  const preLevels  = useRef<number[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const st = useGameStore.getState()
    // Guard: only score when the player actually cooked something this session.
    // collectedIngredients being empty means the session was reset before we rendered.
    if (st.collectedIngredients.length === 0 && !st.isCooking) {
      setSaved(true)
      return
    }
    preRecipes.current = [...st.unlockedRecipes]
    preLevels.current  = [...st.unlockedLevels]
    const r = calculateScores()
    if (selectedRecipe) saveRecipeProgress(selectedRecipe.id, r.totalScore, r.starRating)
    setSaved(true)
  }, [])

  // Burning the food is a failed cook, whatever the other categories scored.
  const passed = totalScore >= (selectedRecipe?.minScore ?? 70) && !burnedFood

  // The dish reveal used to always show the recipe's glossy promo photo, so an
  // overcooked dish was presented as a perfect result. A burnt cook now reveals
  // the recipe's burnt frame, or the final frame charred in CSS when the recipe
  // ships no burnt asset.
  const burntOutcome = selectedRecipe && burnedFood
    ? resolveOutcomeImages(selectedRecipe.id, true)
    : null
  const dishImage = burntOutcome?.served ?? selectedRecipe?.image

  const newRecipes = saved
    ? recipes.filter(r => unlockedRecipes.includes(r.id) && !preRecipes.current.includes(r.id))
    : []
  const newLevels = saved
    ? unlockedLevels.filter(l => !preLevels.current.includes(l))
    : []

  // Weighted contribution of each category (sums to totalScore).
  // Weights MUST match the formula in gameStore.calculateScores().
  const rows = [
    { label: 'Ingredient Accuracy', w: '15%', val: scores.accuracy  * 0.15, show: true },
    { label: 'Proper Washing',      w: '10%', val: scores.washing    * 0.10, show: true },
    { label: 'Cutting Technique',   w: '20%', val: scores.cutting    * 0.20, show: true },
    { label: 'Measuring Accuracy',  w: '15%', val: scores.measuring  * 0.15, show: true },
    { label: 'Cooking Accuracy',    w: '30%', val: scores.cooking    * 0.30, show: true },
    { label: 'Time Management',     w: '10%', val: scores.timing     * 0.10, show: true },
  ].filter(r => r.show)

  const printReport = () => {
    const w = window.open('', '_blank')
    if (!w) return
    const starStr = '★'.repeat(starRating) + '☆'.repeat(3 - starRating)
    const breakdownRows = rows
      .map(r => `<tr><td>${r.label}</td><td>${r.w}</td><td>${Math.round(r.val)}%</td></tr>`)
      .join('')
    const sopRows = (sopResults ?? [])
      .map(s => `<tr><td>${s.title}</td><td>${s.status === 'pass' ? '✓ Pass' : s.status === 'warn' ? '⚠ Warning' : '✗ Fail'}</td><td>${s.feedback}</td></tr>`)
      .join('')
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cooking Report</title>
    <style>body{font-family:sans-serif;max-width:600px;margin:40px auto;color:#333}
    h1{color:#8a5a30;border-bottom:3px solid #f0b73c;padding-bottom:8px}
    h2{color:#8a5a30;margin-top:24px}
    table{width:100%;border-collapse:collapse;margin:16px 0}
    td,th{padding:8px 12px;border:1px solid #ddd;text-align:left}
    th{background:#f5f0e8}
    .stars{color:#f0b73c;font-size:20px;text-align:center}
    .score{font-size:48px;font-weight:900;color:#8a5a30;text-align:center}
    .grade{text-align:center;font-size:24px;color:#666}
    .footer{margin-top:24px;font-size:12px;color:#999;text-align:center}</style></head><body>
    <h1>Virtual Cooking Laboratory — Cooking Report</h1>
    <p><strong>Recipe:</strong> ${selectedRecipe?.name ?? 'N/A'}</p>
    <p><strong>Level:</strong> ${selectedRecipe?.level ?? 'N/A'} &nbsp;·&nbsp; <strong>Category:</strong> ${selectedRecipe?.category ?? 'N/A'}</p>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    <div class="score">${totalScore}%</div>
    <div class="grade">Grade: ${grade ?? '-'}</div>
    <div class="stars">${starStr}</div>
    <h2>Score Breakdown</h2>
    <table><tr><th>Category</th><th>Weight</th><th>Score</th></tr>
    ${breakdownRows}
    <tr style="font-weight:bold"><td>Total</td><td>100%</td><td>${totalScore}%</td></tr>
    </table>
    <h2>SOP Compliance</h2>
    <table><tr><th>SOP</th><th>Status</th><th>Feedback</th></tr>
    ${sopRows || '<tr><td colspan="3">No SOP data recorded.</td></tr>'}
    </table>
    <div class="footer">Generated by Virtual Cooking Laboratory · ${new Date().toLocaleString()}</div>
    </body></html>`
    w.document.write(html)
    w.document.close()
    w.focus()
    w.print()
  }

  return (
    <div className="g-page rs-page">
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => setScreen('main-menu')}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Menu</span>
        </button>
        <span className="g-navbar-title">Results</span>
      </div>

      <motion.div className="rs-body"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 22 }}>

        {/* ── Dish reveal ── */}
        {selectedRecipe && (
          <div className="rs-reveal">
            {(passed || burnedFood) && (
              <motion.div className={`rs-reveal-caption ${burnedFood ? 'rs-reveal-caption--burnt' : ''}`}
                initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 12, delay: 0.15 }}>
                {burnedFood ? '🔥 Burnt! The dish was overcooked.' : '🎉 Dish Complete!'}
              </motion.div>
            )}
            <motion.div className={`rs-dish-frame ${passed ? 'passed' : 'failed'} ${burnedFood ? 'burnt' : ''}`.trim()}
              initial={{ scale: 0.4, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 13, delay: 0.05 }}>
              <img src={dishImage} alt={selectedRecipe.name}
                className={`rs-dish-img-big ${burntOutcome?.charred ? 'rs-dish-img-big--charred' : ''}`.trim()}
                onError={e => {
                  // Comment 14: never leave the circle empty — fall back to the plated
                  // cooking image, then a neutral placeholder, instead of hiding the dish.
                  const el = e.target as HTMLImageElement
                  const done = COOKING_STEP_IMAGES[selectedRecipe.id]?.done
                  if (done && !el.dataset.fb1) {
                    el.dataset.fb1 = '1'; el.src = done
                    // The "done" frame is the good-looking one, so char it when burnt.
                    if (burnedFood) el.classList.add('rs-dish-img-big--charred')
                    return
                  }
                  if (!el.dataset.fb2) { el.dataset.fb2 = '1'; el.src = '/assets/kitchen/table-bg.jpg' }
                }} />
              {passed && [...Array(6)].map((_, i) => (
                <motion.span key={i} className="rs-sparkle"
                  style={{ left: `${8 + i * 16}%`, top: i % 2 ? '6%' : '78%' }}
                  animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.25 }}>
                  ✨
                </motion.span>
              ))}
            </motion.div>
            <div className="rs-dish-name">{selectedRecipe.name}</div>
          </div>
        )}

        {/* ── Score ── */}
        <div className="rs-score-card">
          <motion.span className="rs-score-num"
            initial={{ scale: 0.5 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 14, delay: 0.1 }}>
            {totalScore}%
          </motion.span>
          <span className="rs-score-grade">{grade}</span>
          <div className="rs-stars">{'★'.repeat(starRating)}{'☆'.repeat(3 - starRating)}</div>
        </div>

        {/* ── Newly unlocked ── */}
        {newLevels.length > 0 && (
          <motion.div className="rs-unlock rs-unlock--level"
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.35 }}>
            <Trophy size={22} strokeWidth={2} />
            <span>Level {newLevels[0]} Unlocked!</span>
          </motion.div>
        )}
        {newRecipes.map((r, i) => (
          <motion.div key={r.id} className="rs-unlock"
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', damping: 16, delay: 0.45 + i * 0.12 }}>
            <div className="rs-unlock-badge"><Unlock size={16} strokeWidth={2.5} /></div>
            <img src={r.image} alt={r.name} className="rs-unlock-img"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            <div className="rs-unlock-info">
              <span className="rs-unlock-label">New dish unlocked!</span>
              <span className="rs-unlock-name">{r.name}</span>
            </div>
          </motion.div>
        ))}

        <div className="g-section-label">Score Breakdown</div>
        <div className="rs-table">
          {rows.map((r, i) => (
            <div key={i} className="rs-row">
              <span className="rs-row-label">{r.label} ({r.w})</span>
              <span className="rs-row-val">{Math.round(r.val)}%</span>
            </div>
          ))}
        </div>

        <div className="rs-feedback">
          {totalScore >= 95 && <div className="rs-feedback-row good"><CheckCircle2 size={16}/> Outstanding performance!</div>}
          {totalScore >= 80 && totalScore < 95 && <div className="rs-feedback-row good"><CheckCircle2 size={16}/> Well done!</div>}
          {ingredientErrors > 0 && <div className="rs-feedback-row warn"><AlertCircle size={16}/> {ingredientErrors} wrong ingredient(s) selected</div>}
          {safetyWarnings  > 0 && <div className="rs-feedback-row warn"><AlertCircle size={16}/> {safetyWarnings} safety warning(s)</div>}
          {!passed && <div className="rs-feedback-row bad"><XCircle size={16}/> Score {selectedRecipe?.minScore ?? 70}% or higher to unlock the next dish!</div>}
        </div>

        {/* SOP Compliance Section */}
        {sopResults && sopResults.length > 0 && (
          <>
            <div className="g-section-label" style={{ marginTop: 16 }}><Shield size={16} strokeWidth={2} /> SOP Compliance</div>
            <div className="rs-sop-section">
              {sopResults.map((sop, i) => (
                <motion.div key={sop.sopId} className={`rs-sop-row rs-sop-row--${sop.status}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}>
                  <div className="rs-sop-icon">
                    {sop.status === 'pass' && <CheckCircle2 size={18} strokeWidth={2.5} />}
                    {sop.status === 'warn' && <AlertCircle size={18} strokeWidth={2.5} />}
                    {sop.status === 'fail' && <XCircle size={18} strokeWidth={2.5} />}
                  </div>
                  <div className="rs-sop-info">
                    <span className="rs-sop-title">{sop.title}</span>
                    <span className="rs-sop-feedback">{sop.feedback}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        <div className="rs-actions">
          {!passed && (
            <button className="g-btn g-btn--gold g-btn--full" onClick={() => { resetGame(true); setScreen('recipe-card') }}>
              Retry Recipe
            </button>
          )}
          {passed && newLevels.length > 0 && (
            <motion.button className="g-btn g-btn--gold g-btn--full"
              whileTap={{ scale: 0.96 }} onClick={() => setScreen('level-complete')}>
              🏆 Level Complete! View Summary →
            </motion.button>
          )}
          {passed && newLevels.length === 0 && (
            <motion.button className="g-btn g-btn--gold g-btn--full"
              whileTap={{ scale: 0.96 }} onClick={() => { resetGame(); setScreen('level-select') }}>
              {newRecipes.length > 0 ? `Play ${newRecipes[0].name} →` : 'Next Recipe'}
            </motion.button>
          )}
          <button className="g-btn g-btn--ghost g-btn--full" onClick={() => { resetGame(); setScreen('level-select') }}>
            Level Select
          </button>
          <button className="g-btn g-btn--ghost g-btn--full" onClick={printReport}>
            📄 Download Report
          </button>
        </div>
      </motion.div>
    </div>
  )
}