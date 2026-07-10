// ==========================================
// GAME TYPE DEFINITIONS
// ==========================================

// --- Screen / Navigation ---
export type ScreenName =
  | 'main-menu'
  | 'kitchen-tools'
  | 'level-select'
  | 'recipe-select'
  | 'recipe-card'
  | 'kitchen'
  | 'tutorial'
  | 'progress'
  | 'settings'
  | 'achievements'
  | 'player-stats'
  | 'master-chef-mode'
  | 'results'

// --- Game Phase ---
export type GamePhase =
  | 'menu'
  | 'tools-exploration'
  | 'level-select'
  | 'recipe-select'
  | 'recipe-card'
  | 'ingredient-selection'
  | 'preparation'
  | 'cooking'
  | 'results'

// --- Preparation Sub-Phases ---
export type PreparationTask = 'washing' | 'slicing' | 'measuring'

// --- Cooking ---
export type HeatLevel = 'off' | 'low' | 'medium' | 'high'
export type CuttingTechnique = 'chopping' | 'slicing' | 'dicing' | 'julienne'
export type CookwareType = 'pot' | 'pan' | 'wok'
export type StationName = 'fridge' | 'cabinet' | 'table' | 'sink' | 'stove' | 'tools'

// --- Tool Data ---
export interface ToolType {
  name: string
  image: string
  use: string
  bestFor: string
}

export interface ToolCategory {
  id: number
  name: string
  icon: string
  description: string
  types: ToolType[]
}

export interface ToolItem {
  id: string
  name: string
  image: string
  category: string
}

// --- Ingredient Data ---
export interface Ingredient {
  id: string
  name: string
  image: string
  quantity: string
}

export interface RequiredIngredient {
  id: number
  name: string
  collected: boolean
  location: StationName
}

// --- Recipe Data ---
export interface Recipe {
  id: number
  name: string
  level: number
  category: string
  image: string
  ingredients: string[]
  tools: string[]
  steps: string[]
  minScore?: number
}

// --- Level Data ---
export interface Level {
  id: number
  title: string
  subtitle: string
  recipes: number[]
  requirement: string
  minScore: number
  image: string
  isFinalChallenge?: boolean
}

// --- Scoring ---
export interface Scores {
  accuracy: number
  washing: number
  cutting: number
  cooking: number
  timing: number
}

export type Grade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D'

// --- Feedback ---
export type FeedbackType = 'success' | 'warning' | 'error' | 'info'

export interface FeedbackMessage {
  message: string
  type: FeedbackType
  timestamp: number
}

export interface CurrentFeedback {
  message: string
  type: FeedbackType
}

// --- Mastery & Progress ---
export interface RecipeMasteryData {
  completed: boolean
  bestScore: number
  stars: number
  masteryPercentage: number
}

export interface LevelProgressData {
  completed: boolean
  averageScore: number
  recipesCompleted: number
}

export interface PlayerProfile {
  totalScore: number
  recipesCompleted: number
  currentLevel: number
  achievementBadges: string[]
}

// --- Audio Settings ---
export interface AudioSettings {
  musicEnabled: boolean
  sfxEnabled: boolean
  masterVolume: number
}

// --- Cooking Step ---
export interface CookingStep {
  id: number
  name: string
  status: 'pending' | 'in-progress' | 'completed'
}

// --- Shared Props ---
export interface SetScreenProps {
  setScreen: (screen: ScreenName) => void
}
