/**
 * PlayerContext — provides active player session to the whole app.
 *
 * Wrap <App /> with <PlayerProvider>.
 * Any component calls: const { player, login } = usePlayerContext()
 */

import { createContext, useContext, type ReactNode } from 'react'
import { usePlayer, type PlayerSession } from './usePlayer'

const PlayerContext = createContext<PlayerSession | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const session = usePlayer()
  return <PlayerContext.Provider value={session}>{children}</PlayerContext.Provider>
}

export function usePlayerContext(): PlayerSession {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayerContext must be used inside <PlayerProvider>')
  return ctx
}