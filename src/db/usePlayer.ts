/**
 * usePlayer — manages the active player session.
 *
 * Responsibilities:
 *  - Hold the current player's DB row (id, username, display_name, …)
 *  - Expose a login/register function (upserts to DB)
 *  - Sync Zustand store's persisted progress FROM the DB on login
 *  - Sync Zustand store's progress TO the DB whenever it changes
 *
 * Usage:
 *   const { player, login, isReady } = usePlayer()
 */

import { useState, useEffect, useRef } from 'react'
import {
  initDB, upsertPlayer, getRecipeMastery, getLevelProgress,
  getUnlockedLevels, getUnlockedRecipes, getToolsViewed,
  upsertRecipeMastery, upsertLevelProgress, unlockLevel,
  unlockRecipe, markToolViewedDB, updatePlayerStats,
  type PlayerRow,
} from './database'
import useGameStore from '../store/gameStore'

export interface PlayerSession {
  player: PlayerRow | null
  isReady: boolean
  login: (username: string, displayName?: string) => Promise<void>
  logout: () => void
}

export function usePlayer(): PlayerSession {
  const [player, setPlayer] = useState<PlayerRow | null>(null)
  const [isReady, setIsReady] = useState(false)
  const syncedRef = useRef(false)

  // Init DB on mount
  useEffect(() => {
    initDB().then(() => setIsReady(true))
  }, [])

  // After login: load all progress from DB into Zustand store
  const syncFromDB = async (p: PlayerRow) => {
    const mastery          = getRecipeMastery(p.id)
    const levelProg        = getLevelProgress(p.id)
    const unlockedLevels   = getUnlockedLevels(p.id)
    const unlockedRecipes  = getUnlockedRecipes(p.id)
    const toolsViewed      = getToolsViewed(p.id)

    // Convert DB mastery to Zustand shape
    const recipeMastery: Record<number, { completed: boolean; bestScore: number; stars: number; masteryPercentage: number }> = {}
    for (const [id, m] of Object.entries(mastery)) {
      recipeMastery[Number(id)] = {
        completed: m.completed,
        bestScore: m.bestScore,
        stars: m.stars,
        masteryPercentage: m.bestScore,
      }
    }

    // Ensure level 1 always unlocked
    const finalLevels = unlockedLevels.includes(1) ? unlockedLevels : [1, ...unlockedLevels]
    const finalRecipes = unlockedRecipes.includes(1) ? unlockedRecipes : [1, ...unlockedRecipes]

    useGameStore.setState({
      recipeMastery,
      levelProgress: levelProg,
      unlockedLevels: finalLevels,
      unlockedRecipes: finalRecipes,
      toolsViewed,
      playerProfile: {
        totalScore: p.total_score,
        recipesCompleted: p.recipes_done,
        currentLevel: p.current_level,
        achievementBadges: p.badges,
      },
    })
    syncedRef.current = true
  }

  // Watch Zustand store changes and push them back to DB
  useEffect(() => {
    if (!player) return

    const unsub = useGameStore.subscribe(state => {
      if (!syncedRef.current) return

      // Sync recipe mastery
      for (const [idStr, m] of Object.entries(state.recipeMastery)) {
        upsertRecipeMastery(player.id, Number(idStr), m.bestScore, m.stars, m.completed)
      }

      // Sync level progress
      for (const [idStr, lp] of Object.entries(state.levelProgress)) {
        upsertLevelProgress(player.id, Number(idStr), lp.completed, lp.averageScore, lp.recipesCompleted)
      }

      // Sync unlocked levels
      for (const levelId of state.unlockedLevels) {
        unlockLevel(player.id, levelId)
      }

      // Sync unlocked recipes
      for (const recipeId of state.unlockedRecipes) {
        unlockRecipe(player.id, recipeId)
      }

      // Sync tools viewed
      for (const toolId of state.toolsViewed) {
        markToolViewedDB(player.id, toolId)
      }

      // Sync player profile
      updatePlayerStats(
        player.id,
        state.playerProfile.totalScore,
        state.playerProfile.recipesCompleted,
        state.playerProfile.currentLevel,
      )
    })

    return unsub
  }, [player])

  const login = async (username: string, displayName?: string) => {
    await initDB()
    const p = upsertPlayer(username.trim().toLowerCase(), displayName ?? username)
    setPlayer(p)
    await syncFromDB(p)
  }

  const logout = () => {
    syncedRef.current = false
    setPlayer(null)
    useGameStore.getState().resetAll()
  }

  return { player, isReady, login, logout }
}