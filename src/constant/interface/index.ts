/**
 * Every `interface` in the game lives here; the `type` aliases live beside it
 * in ../types. The two files reference each other freely — TypeScript resolves
 * type-only cycles without trouble.
 *
 * Component prop interfaces are named after their component (`StoveViewProps`,
 * `SinkViewProps`, …) because thirteen separate files each declared their own
 * local `interface Props`, and those names collide once they share a file.
 */
import type { ReactNode } from 'react'
import type {
  CardState,
  CuttingTechnique,
  FeedbackType,
  GameIconName,
  GamePhase,
  Grade,
  HeatLevel,
  ScreenName,
  StationName,
} from '../types'

// ═══════════════════════════════════════════════════════════════
// Tools
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// Ingredients
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// Inventory
// ═══════════════════════════════════════════════════════════════
export interface InventoryItem {
  id: string
  name: string
  image: string
  type: 'ingredient' | 'tool'
  quantity?: string
  toolType?: ToolType
}

// ═══════════════════════════════════════════════════════════════
// Recipe / Level
// ═══════════════════════════════════════════════════════════════
export interface Recipe {
  id: number; name: string; level: number; category: string
  image: string; ingredients: string[]; tools: string[]; steps: string[]
  narrativeIngredients?: string[]; narrativeTools?: string[]; narrativeSteps?: string[]
  chronologicalIngredients?: string[]
  chronologicalSteps?: string[]
  minScore?: number
  // per-ingredient cut instructions
  cutInstructions?: Record<string, { technique: CuttingTechnique; size: string; description: string }>
  cookingDuration: number;
}

export interface Level {
  id: number; title: string; subtitle: string; recipes: number[]
  requirement: string; minScore: number; image: string; isFinalChallenge?: boolean
}

// ═══════════════════════════════════════════════════════════════
// Scoring
// ═══════════════════════════════════════════════════════════════
export interface Scores { accuracy: number; washing: number; cutting: number; measuring: number; cooking: number; timing: number }

// ═══════════════════════════════════════════════════════════════
// Feedback
// ═══════════════════════════════════════════════════════════════
export interface FeedbackMessage { message: string; type: FeedbackType; timestamp: number }
export interface CurrentFeedback  { message: string; type: FeedbackType }

// ═══════════════════════════════════════════════════════════════
// Progress
// ═══════════════════════════════════════════════════════════════
export interface RecipeMasteryData { completed: boolean; bestScore: number; stars: number; masteryPercentage: number }
export interface LevelProgressData { completed: boolean; averageScore: number; recipesCompleted: number }
export interface PlayerProfile { totalScore: number; recipesCompleted: number; currentLevel: number; achievementBadges: string[] }

// ═══════════════════════════════════════════════════════════════
// Audio
// ═══════════════════════════════════════════════════════════════
export interface AudioSettings { musicEnabled: boolean; sfxEnabled: boolean; masterVolume: number }

// ═══════════════════════════════════════════════════════════════
// Cooking step
// ═══════════════════════════════════════════════════════════════
export interface CookingStep { id: number; name: string; status: 'pending' | 'in-progress' | 'completed' }

/**
 * One recipe's pot artwork.
 *
 * Cooking has four end states, not two, and they are reached in two stages:
 * the dish finishes (or ruins itself) *in the pan*, and only reaches a bowl
 * when the player presses Serve. The old single `burnt` field collapsed those,
 * which is why some dishes appeared burnt already plated — the supplied image
 * for that field was the bowl shot.
 */
export interface CookingStepImageSet {
  steps: string[]
  /** Correctly cooked, still in the pan — shown when the timer completes. */
  done?: string
  /** Ruined, still in the pan — shown when the heat was left on too long. */
  burntPan?: string
  /** Plated and correct — shown only after Serve. */
  servedGood?: string
  /** Plated and ruined — shown only after Serve. */
  servedBurnt?: string
}

// ═══════════════════════════════════════════════════════════════
// Prep / cutting
// ═══════════════════════════════════════════════════════════════
export interface CutPattern {
  label: string
  description: string
  tip: string
  color: string
  linesNeeded: number   // tap count to complete
  icon: string          // emoji shorthand for the selector
}

// ═══════════════════════════════════════════════════════════════
// SOP compliance
// ═══════════════════════════════════════════════════════════════
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

export interface SOPRule {
  id: string
  ruleText: string
  stationTarget: 'stove' | 'prep' | 'sink'
  scoringCategory: 'cooking' | 'cutting' | 'washing'
}

export interface SOP {
  id: string
  title: string
  description: string
  rules: SOPRule[]
  tips: string[]
}

// ═══════════════════════════════════════════════════════════════
// Persistence (SQLite)
// ═══════════════════════════════════════════════════════════════
export interface PlayerRow {
  id: number
  username: string
  display_name: string
  created_at: string
  last_seen: string
  total_score: number
  recipes_done: number
  current_level: number
  badges: string[]
}

export interface PlayerSession {
  player: PlayerRow | null
  isReady: boolean
  login: (username: string, displayName?: string) => Promise<void>
  logout: () => void
}

// ═══════════════════════════════════════════════════════════════
// Store shape
// ═══════════════════════════════════════════════════════════════
export interface GameState {
  // Navigation
  currentPhase: GamePhase

  // Selection
  selectedLevel: Level | null
  selectedRecipe: Recipe | null

  // Ingredient Selection
  collectedIngredients: Ingredient[]
  selectedIngredients: Ingredient[]
  requiredIngredients: RequiredIngredient[]
  ingredientErrors: number

  // Preparation
  washedIngredients: string[]
  slicedIngredients: string[]
  measuredIngredients: string[]
  washingProgress: Record<string, number>
  cuttingProgress: Record<string, { technique: CuttingTechnique; progress: number }>
  measuringProgress: Record<string, { amount: number; accuracy: number }>

  // Cutting
  cuttingTechnique: CuttingTechnique | null
  unsafeCuttingDetected: boolean
  safetyWarnings: number
  expectedCutType: Record<string, CuttingTechnique>
  actualCutType: Record<string, CuttingTechnique>

  // Cooking
  isChallengeMode: boolean
  heatLevel: HeatLevel
  cookingDuration: number
  isCooking: boolean
  burnedFood: boolean
  undercookedFood: boolean
  stirCount: number
  requiredStirs: number
  cookingElapsedTime: number
  cookedIngredients: string[]
  chronologicalOrderMistakes: number

  // SOP Compliance
  sopCompliance: Record<string, SOPComplianceEntry>
  cookwareMatchScore: number
  flameCenteringScore: number
  knifeStabilityScore: number
  cutUniformityScore: number
  washThoroughnessScore: number
  ingredientDropScore: number
  sopResults: SOPResultSummary[]
  lastDropTimestamp: number
  flameCenteringChecks: number
  flameCenteringResponses: number
  stabilizedIngredients: string[]

  // Scoring
  scores: Scores
  totalScore: number
  starRating: number
  grade: Grade | null

  // Feedback
  feedbackMessages: FeedbackMessage[]
  currentFeedback: CurrentFeedback | null

  // Progression (persisted)
  recipeMastery: Record<number, RecipeMasteryData>
  levelProgress: Record<number, LevelProgressData>
  unlockedRecipes: number[]
  unlockedLevels: number[]
  playerProfile: PlayerProfile
  toolsViewed: number[]
  selectedKnifeId: string | null  // knife chosen from cabinet
  inventoryToolIds: string[]       // all tools picked from cabinet
}

export interface GameActions {
  // Phase
  setPhase: (phase: GamePhase) => void
  setSelectedLevel: (level: Level | null) => void
  setSelectedRecipe: (recipe: Recipe | null) => void

  // Ingredients
  initializeIngredients: (recipe: Recipe) => void
  selectIngredient: (ingredient: Ingredient) => boolean

  // Preparation
  washIngredient: (name: string) => void
  sliceIngredient: (name: string, technique: CuttingTechnique) => void
  measureIngredient: (name: string, amount: number, accuracy: number) => void
  detectUnsafeCutting: (unsafe: boolean) => void
  setExpectedCutType: (ingredient: string, cut: CuttingTechnique) => void
  setActualCutType: (ingredient: string, cut: CuttingTechnique) => void

  // Cooking
  setHeatLevel: (level: HeatLevel) => void
  setCookingDuration: (duration: number) => void
  startCooking: () => void
  stopCooking: () => void
  incrementStirCount: () => void
  setBurnedFood: (burned: boolean) => void
  setUndercookedFood: (undercooked: boolean) => void
  setCookingElapsedTime: (time: number) => void
  setCookedIngredients: (ingredients: string[]) => void
  recordChronologicalMistake: () => void

  // SOP Compliance
  setCookwareMatch: (score: number) => void
  setFlameCentering: (score: number) => void
  setKnifeStability: (score: number) => void
  setCutUniformity: (score: number) => void
  setWashThoroughness: (score: number) => void
  setIngredientDropScore: (score: number) => void
  recordSopCompliance: (sopId: string, followed: boolean, details: string) => void
  recordLastDropTimestamp: (ts: number) => void
  recordFlameCenteringCheck: () => void
  recordFlameCenteringResponse: () => void
  addStabilizedIngredient: (name: string) => void

  // Scoring
  calculateScores: () => { totalScore: number; starRating: number; grade: Grade }

  // Progression
  saveRecipeProgress: (recipeId: number, score: number, stars: number) => void
  saveLevelProgress: (levelId: number, score: number) => void
  markToolViewed: (toolId: number) => void
  isAllToolsViewed: () => boolean
  setSelectedKnife: (id: string | null) => void
  addInventoryTool: (id: string) => void
  removeInventoryTool: (id: string) => void

  // Feedback
  addFeedback: (message: string, type: FeedbackType) => void
  clearFeedback: () => void

  // Reset
  resetGame: (keepRecipe?: boolean) => void
  resetAll: () => void
}

// ═══════════════════════════════════════════════════════════════
// Knowledge test
// ═══════════════════════════════════════════════════════════════
export interface Question { q: string; opts: string[]; answer: number }

// ═══════════════════════════════════════════════════════════════
// Component props
// ═══════════════════════════════════════════════════════════════
export interface SetScreenProps { setScreen: (screen: ScreenName) => void }

// ── Pages ──
export interface EducationalKitchenProps { onBack: () => void; onFinish: () => void }
export interface KnowledgeTestProps extends SetScreenProps { mode: 'pre' | 'post' }
export interface LoginScreenProps { onDone: () => void }
export interface SettingsProps extends SetScreenProps {
  audioSettings: AudioSettings
  setAudioSettings: (s: AudioSettings) => void
}

// ── Station views ──
export interface CabinetViewProps { onClose: () => void }
export interface PrepViewProps { onClose: () => void }
export interface SinkViewProps { onClose: () => void }

export interface FridgeViewProps {
  onClose: () => void
  selectedRecipe: Recipe | null
  station: StationName
  title: string
}

export interface StoveViewProps {
  onClose: () => void
  onFinishCooking: () => void
  selectedRecipe: Recipe | null
}

export interface MicrowaveViewProps {
  onClose: () => void
  onFinishCooking: () => void
  selectedRecipe: Recipe | null
}

// ── Shared components ──
export interface RecipeCardProps extends SetScreenProps {
  isPopup?: boolean;
  onClose?: () => void;
}

export interface SplashScreenProps { onDone: () => void }

export interface StationShellProps {
  bg: string
  bgSize?: string
  bgColor?: string
  title: string
  counter?: ReactNode
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
}

export interface DoneFooterBtnProps { onClick: () => void; label?: string }

export interface IngredientCardProps {
  ingredient: Ingredient
  state?: CardState
  statusLabel?: string
  showQty?: boolean
  delay?: number
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export interface RecipeCardSlotProps {
  /** 'tray' = pinned slot in the counter tray; 'dock' = segment of the right-edge HUD dock */
  variant?: 'tray' | 'dock'
}

export interface GameStageProps { children: ReactNode }

// mascot interface
export interface MascotProps {
  size?: number
  corner?: 'bottom-left' | 'bottom-right'
  className?: string
}

// game icon interface
export interface GameIconProps {
  name?: GameIconName
  src?: string
  size?: number
  alt?: string
  className?: string
}

// game logo interface
export interface GameLogoProps {
  src: string
  alt?: string
}

// game tooltip interface
export interface GameTooltipProps { id: string; text: string; position?: 'top' | 'bottom' }

// game tray interface
export interface GameTrayProps {
  highlight?: 'wash' | 'slice' | 'none'
  onItemTap?: (name: string) => void
}
