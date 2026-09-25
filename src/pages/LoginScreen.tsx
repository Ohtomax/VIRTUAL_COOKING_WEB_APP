/**
 * LoginScreen — shown once on first launch (or when no player is active).
 * Player types their name → creates or resumes a local SQLite profile.
 */
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChefHat, UserPlus, LogIn, Loader2 } from 'lucide-react'
import { getAllPlayers, type PlayerRow } from '../db/database'
import { usePlayerContext } from '../db/PlayerContext'

interface Props { onDone: () => void }

export default function LoginScreen({ onDone }: Props) {
  const { login, isReady } = usePlayerContext()
  const [existing, setExisting] = useState<PlayerRow[]>([])
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (isReady) setExisting(getAllPlayers())
  }, [isReady])

  const handleLogin = async (username: string, displayName?: string) => {
    if (!username.trim()) { setError('Please enter your name.'); return }
    setLoading(true); setError('')
    try {
      await login(username, displayName)
      onDone()
    } catch (e) {
      setError('Could not load profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isReady) {
    return (
      <div className="login-page">
        <Loader2 size={32} className="login-spinner" />
        <p style={{ color: 'var(--text-2)', marginTop: 12 }}>Initialising database…</p>
      </div>
    )
  }

  return (
    <div className="login-page">
      <motion.div className="login-card"
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 18 }}>

        {/* Header */}
        <div className="login-header">
          <div className="login-icon"><ChefHat size={38} strokeWidth={1.4} /></div>
          <h1 className="login-title">Virtual Cooking Lab</h1>
          <p className="login-sub">Enter your name to save your progress locally.</p>
        </div>

        {/* Existing players */}
        {existing.length > 0 && (
          <div className="login-existing">
            <p className="login-section-label">Continue as…</p>
            <div className="login-player-list">
              {existing.map(p => (
                <motion.button key={p.id} className="login-player-row"
                  whileTap={{ scale: 0.96 }} onClick={() => handleLogin(p.username, p.display_name)}>
                  <div className="login-avatar">{p.display_name[0].toUpperCase()}</div>
                  <div className="login-player-info">
                    <span className="login-player-name">{p.display_name}</span>
                    <span className="login-player-meta">
                      {p.recipes_done} recipes · Level {p.current_level} · {p.total_score} pts
                    </span>
                  </div>
                  <LogIn size={18} strokeWidth={2} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* New player */}
        <div className="login-new">
          <p className="login-section-label">
            {existing.length > 0 ? 'Or create a new profile' : 'Create your profile'}
          </p>
          <input
            className="login-input"
            placeholder="Your name…"
            value={name}
            maxLength={32}
            onChange={e => { setName(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin(name)}
            autoFocus
          />
          <AnimatePresence>
            {error && (
              <motion.p className="login-error"
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button className="g-btn g-btn--gold g-btn--full"
            whileTap={{ scale: 0.96 }} onClick={() => handleLogin(name)}
            disabled={loading || !name.trim()}>
            {loading
              ? <><Loader2 size={18} className="login-spinner-inline" /> Loading…</>
              : <><UserPlus size={18} /> Start Cooking</>}
          </motion.button>
        </div>

        <p className="login-footnote">
          💾 Your progress is saved locally on this device using SQLite.
        </p>
      </motion.div>
    </div>
  )
}