/**
 * ChefMascot — the chef character, in one place so every screen that shows him
 * points at the same sprite sheets and sizing.
 *
 * `corner` parks him against a page corner (menus and list screens); without it
 * he is laid out inline by whatever wraps him (the kitchen positions him above
 * the action bar itself).
 */
import { Mascot } from 'page-mascot'
import type { MascotProps } from '../../constant/interface'
export default function ChefMascot({ size = 132, corner, className = '' }: MascotProps) {
  const cls = ['chef-mascot', corner ? `chef-mascot--${corner}` : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls}>
      <Mascot
        directions="/assets/mascot/chef-directions.webp"
        reactions="/assets/mascot/chef-reactions.webp"
        size={size}
        label="Chef mascot"
      />
    </div>
  )
}
