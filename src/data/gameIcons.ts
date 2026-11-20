/**
 * The game's own painted icon set (public/assets/icons).
 *
 * These replace the generic outline icons and emoji that used to stand in for
 * the kitchen's stations and tool racks. One map so the same station shows the
 * same picture everywhere — the Cabinet and the Kitchen Tools page previously
 * disagreed about what a "Knives" category looks like.
 */
export const GAME_ICONS = {
  // Tool categories (ids match toolCategories in tools.ts)
  knives: '/assets/icons/knives.png',
  pots: '/assets/icons/pot.png',
  pans: '/assets/icons/pans.png',
  utensils: '/assets/icons/utensils.png',
  measuring: '/assets/icons/measure.png',

  // Kitchen stations
  freezer: '/assets/icons/freezer.png',
  refrigerator: '/assets/icons/refrigerator.png',
  pantry: '/assets/icons/pantry.png',
  cabinet: '/assets/icons/cabinet.png',
  prep: '/assets/icons/chopping-board.png',
  sink: '/assets/icons/sink.png',
  stove: '/assets/icons/stove.png',
  oven: '/assets/icons/oven.png',

  // Brand
  chefHat: '/assets/icons/chef-hat.png',
} as const


/** Tool-category id (tools.ts) → icon. */
export const TOOL_CATEGORY_ICONS: Record<number, string> = {
  1: GAME_ICONS.knives,
  2: GAME_ICONS.pots,
  3: GAME_ICONS.pans,
  4: GAME_ICONS.utensils,
  5: GAME_ICONS.measuring,
}
