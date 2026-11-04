import { PHOTOS, STREAMS } from '@constants'
import CutPhoto from '@/components/photos/CutPhoto'

/**
 * "What changes": the three streams, one at a time, as a before and an after.
 *
 * The section heading promises exactly that ("Where you are now, and what you
 * have instead"), so each row is built to show the change rather than describe
 * it, in the site's own material:
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
 * ONE STREAM IN FOCUS AT A TIME. With all three rows on screen together the
 * section was too busy to read as three separate changes. So each row is one
 * screen tall, and as the page scrolls a row fades in, holds while it is the
 * one being read, and fades out as the next arrives. At any scroll position at
 * most one row is more than half visible.
 *
 * The page still scrolls normally, and that part is not up for debate: no
 * pinning, no sticky stage, no scroll-jacking, no snapping. A row is an
 * ordinary block in the flow, and only its opacity responds to where it is.
 * That is done entirely in CSS (`animation-timeline`, in home.scss), so this
 * is a server component with nothing to hydrate, and with JavaScript off, in a
 * browser without scroll-driven animations, or under prefers-reduced-motion,
 * every row is simply visible. The words are in the HTML for a crawler either
 * way.
 */
export default function StreamMoves() {
  return (
    <section id="what-changes" className="home-moves" aria-labelledby="moves-heading">
      <div className="home-moves__head">
        <p className="home-eyebrow">What changes</p>
        <h2 id="moves-heading" className="home-moves__title">
          <span className="home-moves__line">Where you are now,</span>{' '}
          <span className="home-moves__line">and what you have instead.</span>
        </h2>
      </div>

      {STREAMS.map((stream) => (
        <article
          key={stream.id}
          id={stream.id}
          className="home-step"
          aria-labelledby={`${stream.id}-name`}
        >
          {/* The one thing that fades. The row around it is the timeline. */}
          <div className="home-step__inner">
            {/* The box is styling on the heading, not a wrapper round it. */}
            <h3 id={`${stream.id}-name`} className="home-step__name cut-slot">
              {stream.name}
            </h3>

            <div className="home-step__past">
              <span className="home-step__eyebrow">Now</span>
              <p className="home-step__problem">{stream.problem}</p>
            </div>

            <div className="home-step__media">
              <CutPhoto
                photo={PHOTOS.streams[stream.id].step}
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
    </section>
  )
}
