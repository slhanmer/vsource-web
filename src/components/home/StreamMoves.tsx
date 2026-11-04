import type { Stream } from '@/data/types'
import CutPhoto from '@/components/photos/CutPhoto'
import MovesFocus from './MovesFocus'

/**
 * "What changes": the three streams, as a before and an after, swapped in
 * place on a stage that holds still while the page scrolls.
 *
 * The section heading promises a change ("Where you are now, and what you have
 * instead"), so each row shows one, in the site's own material:
 *
 *   1. The stream's name, cut into the plate the way the hero's word is. It is
 *      the row's label and its <h3>.
 *   2. "Now": the situation someone is in today, in a recessed plate, at
 *      body-large size in the secondary colour. The past is cut in.
 *   3. "Instead": the `instead` line on the surface, the largest text in the
 *      row and the line the eye should land on.
 *   4. The `solution`, as body copy: the why behind it.
 *   5. The way through to the stream's page.
 *
 * THE STAGE. The section is a tall track, and inside it a sticky stage, one
 * screen tall, holds the heading and the three rows stacked in one place. As
 * the page scrolls past the track the stage stays put, and the rows swap on it
 * — Software for its third of the track, a short crossfade, Robotics, then
 * Websites, which stays until the section scrolls away. One stream in focus at
 * a time, with the heading above it the whole way.
 *
 * Why this is safe to do to a page:
 *
 *   - It is native scrolling. The page moves exactly as it would without the
 *     stage — no snapping, no wheel or touch handling, no scroll position set
 *     by script (bar one case, below). `position: sticky` only stops the stage
 *     leaving while its own section is still passing.
 *   - The swap is CSS. Each row's opacity runs on the section's scroll
 *     timeline (`view-timeline` and `animation-range`, in home.scss); nothing
 *     reads the scroll position in JavaScript.
 *   - It falls back to plain flow, completely. Without scroll-driven
 *     animations (Firefox today), under prefers-reduced-motion, on a screen
 *     too small for the tallest row to fit on the stage, or before any CSS
 *     support check passes, there is no track, no sticky and no stacking: the
 *     three rows are one after another, all visible, as an ordinary section.
 *     No JavaScript is needed for any of it, so turning it off changes nothing.
 *
 * Every row stays in the DOM and in the accessibility tree; a row that is not
 * showing is transparent and ignores the pointer, but is never hidden from a
 * screen reader. The one script is MovesFocus: a keyboard user who tabs into
 * a stacked row that is not the one showing is scrolled to that row's third
 * of the track, so the focused link is never sitting under another row.
 */
export default function StreamMoves({ streams }: { streams: Stream[] }) {
  return (
    <section id="what-changes" className="home-moves" aria-labelledby="moves-heading">
      <div className="home-moves__stage">
        <div className="home-moves__head">
          <p className="home-eyebrow">What changes</p>
          <h2 id="moves-heading" className="home-moves__title">
            <span className="home-moves__line">Where you are now,</span>{' '}
            <span className="home-moves__line">and what you have instead.</span>
          </h2>
        </div>

        <div className="home-moves__rows">
          {streams.map((stream, i) => (
            <article
              key={stream.slug}
              id={stream.slug}
              className="home-step"
              data-index={i}
              aria-labelledby={`${stream.slug}-name`}
            >
              <div className="home-step__inner">
                {/* The box is styling on the heading, not a wrapper round it. */}
                <h3 id={`${stream.slug}-name`} className="home-step__name cut-slot">
                  {stream.name}
                </h3>

                <div className="home-step__past">
                  <span className="home-step__eyebrow">Now</span>
                  <p className="home-step__problem">{stream.problem}</p>
                </div>

                <div className="home-step__media">
                  <CutPhoto
                    photo={stream.stepPhoto}
                    sizes="(max-width: 979px) 92vw, (max-width: 1440px) 44vw, 600px"
                    className="home-step__photo"
                  />
                </div>

                <div className="home-step__answer">
                  <span className="home-step__eyebrow">Instead</span>
                  <p className="home-step__instead">{stream.instead}</p>
                  <p className="home-step__solution">{stream.solution}</p>
                  <p className="home-step__go">
                    <span className="home-step__ask">Sounds familiar?</span>
                    <span className="home-step__dot" aria-hidden="true">
                      &middot;
                    </span>
                    <a className="home-step__link" href={stream.href}>
                      See how it works
                    </a>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <MovesFocus count={streams.length} />
    </section>
  )
}
