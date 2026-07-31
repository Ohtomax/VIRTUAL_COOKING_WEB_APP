import type { CuttingTechnique } from '../types'

export interface CutPattern {
  label: string
  description: string
  tip: string
  color: string
  linesNeeded: number   // tap count to complete
  icon: string          // emoji shorthand for the selector
}

export const CUT_PATTERNS: Partial<Record<CuttingTechnique, CutPattern>> = {
  chopping: {
    label: 'Chopping',
    description: 'Large irregular cuts with quick downward motions.',
    tip: 'Use a chef\'s knife or cleaver. Keep fingers curled back.',
    color: '#F5A623',
    linesNeeded: 3,
    icon: '🔪',
  },
  slicing: {
    label: 'Slicing',
    description: 'Long, even strokes in a gentle back-and-forth motion.',
    tip: 'Keep the tip of the knife on the board. Move in an arc.',
    color: '#0A84FF',
    linesNeeded: 4,
    icon: '✂️',
  },
  dicing: {
    label: 'Dicing',
    description: 'Uniform small cubes — slice first, then rotate 90° and repeat.',
    tip: 'First make planks, then strips, then cross-cut into cubes.',
    color: '#34C759',
    linesNeeded: 4,
    icon: '🎲',
  },
  julienne: {
    label: 'Julienne',
    description: 'Very thin matchstick cuts with precise straight strokes.',
    tip: 'Slice into thin planks, stack, then cut into fine strips.',
    color: '#BF5AF2',
    linesNeeded: 5,
    icon: '🥕',
  },
}

export const CUT_TECHNIQUES = Object.keys(CUT_PATTERNS) as CuttingTechnique[]