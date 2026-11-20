/**
 * Every `type` alias in the game lives here; the `interface` declarations live
 * beside it in ../interface. The two files reference each other freely —
 * TypeScript resolves type-only cycles without trouble.
 */
import { GAME_ICONS } from '../../data/gameIcons'
import type { GameActions, GameState } from '../interface'

// ═══════════════════════════════════════════════════════════════
// Screen / Navigation
// ═══════════════════════════════════════════════════════════════
export type ScreenName =
  | 'main-menu' | 'kitchen-tools' | 'level-select' | 'recipe-select'
  | 'recipe-card' | 'kitchen' | 'tutorial' | 'progress'
  | 'settings' | 'master-chef-mode' | 'results' | 'level-complete' | 'pre-test' | 'post-test'

export type GamePhase =
  | 'menu' | 'tools-exploration' | 'level-select' | 'recipe-select'
  | 'recipe-card' | 'ingredient-selection' | 'preparation' | 'cooking' | 'results' | 'level-complete' | 'pre-test' | 'post-test'

/** Stations as the kitchen map addresses them — includes the oven and "none". */
export type KitchenStation =
  | 'freezer' | 'fridge' | 'shelf' | 'cabinet' | 'prep' | 'sink' | 'stove' | 'microwave' | null

/** The five-step progression shown in the kitchen's step strip. */
export type KitchenStep = 'ingredients' | 'washing' | 'slicing' | 'measuring' | 'cooking'

// ═══════════════════════════════════════════════════════════════
// Preparation / cooking
// ═══════════════════════════════════════════════════════════════
export type PreparationTask = 'washing' | 'slicing' | 'measuring'
export type HeatLevel       = 'off' | 'low' | 'medium' | 'high'
export type CuttingTechnique =
  | 'chopping' | 'slicing' | 'dicing' | 'julienne'
  | 'brunoise' | 'mince' | 'cube' | 'chiffonade'
  | 'crushed' | 'diagonal cut' | 'straight cut'
  | 'mixed cut' | 'slice' | 'chop' | 'dice'
export type CookwareType    = 'pot' | 'pan' | 'wok'
export type StationName     = 'fridge' | 'freezer' | 'shelf' | 'cabinet' | 'table' | 'sink' | 'stove' | 'tools'

/** Prep-table cutting board lifecycle. */
export type PrepPhase = 'empty' | 'placed' | 'stabilizing' | 'stabilized' | 'cutting' | 'done'

/** Stove lifecycle, from cold pan through to a served (or ruined) dish. */
export type CookState = 'idle' | 'cooking' | 'done' | 'served' | 'burnt' | 'served-burnt'

// ═══════════════════════════════════════════════════════════════
// UI state
// ═══════════════════════════════════════════════════════════════
export type CardState = 'needed' | 'collected' | 'wrong' | 'done' | 'idle' | 'default' | 'active'

/** The two tabs in the inventory panel. */
export type InventoryTab = 'ingredients' | 'tools'

// ═══════════════════════════════════════════════════════════════
// Scoring
// ═══════════════════════════════════════════════════════════════
export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D'

// ═══════════════════════════════════════════════════════════════
// Feedback
// ═══════════════════════════════════════════════════════════════
export type FeedbackType = 'success' | 'warning' | 'error' | 'info'

// ═══════════════════════════════════════════════════════════════
// Assets
// ═══════════════════════════════════════════════════════════════
/** Derived from the icon map itself, so a new icon is instantly addressable. */
export type GameIconName = keyof typeof GAME_ICONS

/** Ingredient name → its sliced artwork. */
export type SliceMap = Record<string, string>

// ═══════════════════════════════════════════════════════════════
// Persistence (SQLite)
// ═══════════════════════════════════════════════════════════════
/** One row as sql.js hands it back, before it is shaped into a typed record. */
export type DbRow = Record<string, string | number | null>

// ═══════════════════════════════════════════════════════════════
// Store
// ═══════════════════════════════════════════════════════════════
export type GameStore = GameState & GameActions
