'use client'

import { useEffect } from 'react'

/**
 * Keyboard support for the "What changes" stage, and the only script it has.
 *
 * On the pinned stage the three rows are stacked in one place and scroll
 * position decides which one shows. Tabbing moves focus from one row's link to
 * the next, but the browser does not scroll — the next link is already "in
 * view", underneath the row that is showing — so focus would land on an
 * invisible link sitting under a visible one. Forcing the focused row opaque
 * in CSS instead would put two rows on top of each other.
 *
 * So when focus enters a row that is not the one showing, #main is scrolled to
 * the middle of that row's third of the track, where it is the only row at
 * full opacity. Instantly, not smoothly: this answers a keypress.
 *
 * Does nothing at all when the stage is not pinned (plain flow — no scroll
 * support, reduced motion, a small screen), because there the rows are
 * already one after another and the browser scrolls to them as normal. Renders
 * nothing.
 */
export default function MovesFocus({ count }: { count: number }) {
  useEffect(() => {
    const section = document.getElementById('what-changes')
    const scroller = document.getElementById('main')
    const stage = section?.querySelector<HTMLElement>('.home-moves__stage')
    if (!section || !scroller || !stage) return

    const onFocus = (event: FocusEvent) => {
      if (getComputedStyle(stage).position !== 'sticky') return
      const row = (event.target as HTMLElement).closest<HTMLElement>('.home-step')
      const index = Number(row?.dataset.index)
      if (!row || Number.isNaN(index)) return

      // The pinned phase is the section's `contain` range: from its top at the
      // top of the scroller to its bottom at the bottom of it.
      const sectionTop =
        scroller.scrollTop +
        section.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top
      const track = section.offsetHeight - scroller.clientHeight
      if (track <= 0) return

      const progress = (scroller.scrollTop - sectionTop) / track
      const showing = Math.min(count - 1, Math.max(0, Math.floor(progress * count)))
      if (showing === index && progress >= 0 && progress <= 1) return

      scroller.scrollTo({ top: sectionTop + ((index + 0.5) / count) * track, behavior: 'instant' })
    }

    section.addEventListener('focusin', onFocus)
    return () => section.removeEventListener('focusin', onFocus)
  }, [count])

  return null
}
