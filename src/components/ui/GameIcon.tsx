/**
 * GameIcon — renders one of the game's painted icons at a given size.
 * Takes either a name from GAME_ICONS or a path, so callers can pass a value
 * straight out of the tool-category map.
 */
import { GAME_ICONS } from '../../data/gameIcons'
import type { GameIconProps } from '../../constant/interface'
export default function GameIcon({ name, src, size = 28, alt = '', className = '' }: GameIconProps) {
  const url = src ?? (name ? GAME_ICONS[name] : undefined)
  if (!url) return null

  return (
    <img
      src={url}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={`game-icon ${className}`.trim()}
      style={{ width: size, height: size }}
      draggable={false}
    />
  )
}
