/**
 * gameConfig — single source of truth for all game constants.
 * Referenced by station views and scoring logic.
 */
export const GAME_CONFIG = {
  /** Sink: milliseconds to wash one ingredient */
  washDurationMs: 1400,
  /** Stove: seconds of buffer after done before burning */
  burnBuffer: 12,
  /** Fridge: number of shelf rows */
  shelfRows: 5,
  /** Score weights (must sum to 1.0) */
  scoreWeights: {
    accuracy: 0.15,
    cutting: 0.20,
    measuring: 0.15,
    cooking: 0.35,
    timing: 0.15,
  },
} as const