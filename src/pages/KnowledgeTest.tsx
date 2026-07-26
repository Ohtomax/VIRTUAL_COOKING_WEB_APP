/**
 * KnowledgeTest — Pre/post test measuring culinary knowledge.
 * Shows 10 multiple-choice questions. Stores scores in localStorage.
 * Pre-test before Level 1; Post-test after Challenge Mode.
 */
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react'
import type { SetScreenProps } from '../types'

interface Question { q: string; opts: string[]; answer: number }

const QUESTIONS: Question[] = [
  { q: 'Which knife is best for slicing bread?', opts: ["Chef's knife", 'Bread knife', 'Paring knife', 'Cleaver'], answer: 1 },
  { q: 'What is the first thing you should do before cutting vegetables?', opts: ['Sharpen knife', 'Preheat oven', 'Wash them', 'Oil the board'], answer: 2 },
  { q: 'What does "julienne" mean?', opts: ['Mash into paste', 'Cut into thin matchsticks', 'Dice into cubes', 'Tear by hand'], answer: 1 },
  { q: 'Which tool measures small amounts of spices?', opts: ['Kitchen scale', 'Measuring cup', 'Measuring spoons', 'Ladle'], answer: 2 },
  { q: 'What happens if cooking heat is too high?', opts: ['Food cooks faster and better', 'Food may burn', 'Food becomes healthier', 'Nothing'], answer: 1 },
  { q: 'What is a "mirepoix"?', opts: ['A French sauce', 'Diced onion, carrot, and celery', 'A type of pasta', 'A dessert'], answer: 1 },
  { q: 'Which pan is best for stir-frying?', opts: ['Sauce pan', 'Roasting pan', 'Wok', 'Paella pan'], answer: 2 },
  { q: 'What does "simmer" mean?', opts: ['Boil rapidly', 'Cook just below boiling point', 'Fry in oil', 'Bake in oven'], answer: 1 },
  { q: 'Why should you curl your fingers when cutting?', opts: ['Looks professional', 'Keeps food steady', 'Prevents cutting your fingertips', 'Makes cuts faster'], answer: 2 },
  { q: 'What is the correct order of cooking preparation?', opts: ['Cook → Wash → Slice', 'Slice → Cook → Wash', 'Wash → Slice/Measure → Cook', 'Measure → Wash → Cook'], answer: 2 },
]

interface Props extends SetScreenProps { mode: 'pre' | 'post' }

export default function KnowledgeTest({ setScreen, mode }: Props) {
  const [idx, setIdx]       = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null))
  const [submitted, setSubmitted] = useState(false)

  const current = QUESTIONS[idx]
  const score   = answers.filter((a, i) => a === QUESTIONS[i].answer).length
  const pct     = Math.round((score / QUESTIONS.length) * 100)
  const preScore = parseInt(localStorage.getItem('preTestScore') ?? '0', 10)

  const pick = (optIdx: number) => {
    if (submitted) return
    const next = [...answers]; next[idx] = optIdx; setAnswers(next)
  }

  const submit = () => {
    localStorage.setItem(`${mode}TestScore`, String(pct))
    setSubmitted(true)
  }

  const finish = () => {
    if (mode === 'pre') setScreen('level-select')
    else setScreen('main-menu')
  }

  if (submitted) {
    return (
      <div className="g-page kt-page">
        <div className="g-page-body" style={{ textAlign: 'center', paddingTop: 60 }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>{pct >= 70 ? '🎉' : '📚'}</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>
              {mode === 'pre' ? 'Pre-Test' : 'Post-Test'} Score: {pct}%
            </h1>
            <p style={{ color: 'var(--text-2)', marginBottom: 8 }}>{score}/{QUESTIONS.length} correct</p>
            {mode === 'post' && (
              <div className="kt-comparison">
                <div className="kt-comp-row">
                  <span>Pre-test:</span><strong>{preScore}%</strong>
                </div>
                <div className="kt-comp-row">
                  <span>Post-test:</span><strong>{pct}%</strong>
                </div>
                <div className="kt-comp-row kt-comp-diff">
                  <span>Improvement:</span>
                  <strong style={{ color: pct - preScore > 0 ? 'var(--green)' : 'var(--red)' }}>
                    {pct - preScore > 0 ? '+' : ''}{pct - preScore}%
                  </strong>
                </div>
              </div>
            )}
            <motion.button className="g-btn g-btn--gold" style={{ marginTop: 24 }}
              whileTap={{ scale: 0.96 }} onClick={finish}>
              {mode === 'pre' ? 'Start Cooking! →' : 'Back to Menu'}
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="g-page kt-page">
      <div className="g-navbar">
        <button className="g-back-btn" onClick={() => setScreen('main-menu')}>
          <ChevronLeft size={20} strokeWidth={2.5} /><span>Back</span>
        </button>
        <span className="g-navbar-title">{mode === 'pre' ? 'Pre-Test' : 'Post-Test'}</span>
      </div>
      <div className="g-page-body">
        <div className="kt-progress">Question {idx + 1} of {QUESTIONS.length}</div>
        <div className="g-bar-track" style={{ marginBottom: 20 }}>
          <div className="g-bar-fill" style={{ width: `${((idx + 1) / QUESTIONS.length) * 100}%` }} />
        </div>

        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="kt-question">{current.q}</h2>
          <div className="kt-options">
            {current.opts.map((opt, oi) => (
              <button key={oi}
                className={`kt-option ${answers[idx] === oi ? 'selected' : ''}`}
                onClick={() => pick(oi)}>
                <span className="kt-option-letter">{String.fromCharCode(65 + oi)}</span>
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="kt-nav">
          {idx > 0 && (
            <button className="g-btn g-btn--ghost" onClick={() => setIdx(i => i - 1)}>
              <ChevronLeft size={16} /> Previous
            </button>
          )}
          <div style={{ flex: 1 }} />
          {idx < QUESTIONS.length - 1 ? (
            <button className={`g-btn ${answers[idx] !== null ? 'g-btn--gold' : 'g-btn--dim'}`}
              onClick={() => answers[idx] !== null && setIdx(i => i + 1)}>
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button className={`g-btn ${answers.every(a => a !== null) ? 'g-btn--gold' : 'g-btn--dim'}`}
              onClick={() => answers.every(a => a !== null) && submit()}>
              Submit Test
            </button>
          )}
        </div>
      </div>
    </div>
  )
}