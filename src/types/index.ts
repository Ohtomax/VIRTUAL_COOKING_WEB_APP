// ─── Screen / Navigation ───────────────────────────────────────
export type ScreenName =
  | 'main-menu' | 'kitchen-tools' | 'level-select' | 'recipe-select'
  | 'recipe-card' | 'kitchen' | 'tutorial' | 'progress'
  | 'settings' | 'master-chef-mode' | 'results' | 'level-complete' | 'pre-test' | 'post-test'

export type GamePhase =
  | 'menu' | 'tools-exploration' | 'level-select' | 'recipe-select'
  | 'recipe-card' | 'ingredient-selection' | 'preparation' | 'cooking' | 'results' | 'level-complete' | 'pre-test' | 'post-test'

export type PreparationTask = 'washing' | 'slicing' | 'measuring'
export type HeatLevel       = 'off' | 'low' | 'medium' | 'high'
export type CuttingTechnique =
  | 'chopping' | 'slicing' | 'dicing' | 'julienne'
  | 'brunoise' | 'mince' | 'cube' | 'chiffonade'
  | 'crushed' | 'diagonal cut' | 'straight cut'
  | 'mixed cut' | 'slice' | 'chop' | 'dice'
export type CookwareType    = 'pot' | 'pan' | 'wok'
export type StationName     = 'fridge' | 'freezer' | 'shelf' | 'cabinet' | 'table' | 'sink' | 'stove' | 'tools'

// ─── Tools ─────────────────────────────────────────────────────
export interface ToolType {
  id: string
  name: string
  image: string
  use: string
  bestFor: string
  category: 'knife' | 'pot' | 'pan' | 'utensil' | 'measuring'
  canCut?: boolean           // knives can be selected for prep stage
  cutTechnique?: CuttingTechnique  // default technique for this knife
}

export interface ToolCategory {
  id: number
  name: string
  icon: string
  description: string
  types: ToolType[]
}

export interface ToolItem {
  id: string; name: string; image: string; category: string
}

// ─── Ingredients ───────────────────────────────────────────────
export interface Ingredient {
  id: string; name: string; image: string; quantity: string; location: 'freezer' | 'fridge' | 'shelf'
}

export interface RequiredIngredient {
  id: number
  name: string            // display name (resolved fridge name when possible)
  collected: boolean
  location: StationName
  ingredientId?: string   // resolved fridge ingredient id — matching is ID-based
  image?: string          // resolved fridge ingredient image
}

// ─── Inventory ─────────────────────────────────────────────────
export interface InventoryItem {
  id: string
  name: string
  image: string
  type: 'ingredient' | 'tool'
  quantity?: string
  toolType?: ToolType
}

// ─── Recipe / Level ────────────────────────────────────────────
export interface Recipe {
  id: number; name: string; level: number; category: string
  image: string; ingredients: string[]; tools: string[]; steps: string[]
  minScore?: number
  // per-ingredient cut instructions
  cutInstructions?: Record<string, { technique: CuttingTechnique; size: string; description: string }>
  cookingDuration: number;
}

export interface Level {
  id: number; title: string; subtitle: string; recipes: number[]
  requirement: string; minScore: number; image: string; isFinalChallenge?: boolean
}

// ─── Scoring ───────────────────────────────────────────────────
export interface Scores { accuracy: number; washing: number; cutting: number; measuring: number; cooking: number; timing: number }
export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D'

// ─── Feedback ──────────────────────────────────────────────────
export type FeedbackType = 'success' | 'warning' | 'error' | 'info'
export interface FeedbackMessage { message: string; type: FeedbackType; timestamp: number }
export interface CurrentFeedback  { message: string; type: FeedbackType }

// ─── Progress ──────────────────────────────────────────────────
export interface RecipeMasteryData { completed: boolean; bestScore: number; stars: number; masteryPercentage: number }
export interface LevelProgressData { completed: boolean; averageScore: number; recipesCompleted: number }
export interface PlayerProfile { totalScore: number; recipesCompleted: number; currentLevel: number; achievementBadges: string[] }

// ─── Audio ─────────────────────────────────────────────────────
export interface AudioSettings { musicEnabled: boolean; sfxEnabled: boolean; masterVolume: number }

// ─── Cooking step ──────────────────────────────────────────────
export interface CookingStep { id: number; name: string; status: 'pending' | 'in-progress' | 'completed' }

// ─── SOP Compliance ────────────────────────────────────────────
export interface SOPComplianceEntry {
  followed: boolean
  details: string
}

export interface SOPResultSummary {
  sopId: string
  title: string
  status: 'pass' | 'warn' | 'fail'
  feedback: string
}

// ─── Shared props ──────────────────────────────────────────────
export interface SetScreenProps { setScreen: (screen: ScreenName) => void }