import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getCrew, getPartners, getSite, getStreams } from '@/data'
import { HeroRunProvider } from '@/components/home/HeroRun'
import HeroStage from '@/components/home/HeroStage'
import MillLines from '@/components/home/MillLines'
import Reveal from '@/components/home/Reveal'
import RotatingHeadline from '@/components/home/RotatingHeadline'
import StreamMoves from '@/components/home/StreamMoves'
import CutPhoto from '@/components/photos/CutPhoto'
import TerminalTile from '@/components/photos/TerminalTile'
import './styles/pages.scss'
import './styles/home.scss'
// The clip player's frame and control (.built-media), for the What changes
// clip (home-tweaks).
import './styles/built.scss'

/** "software, robotics and websites": the visible streams, lower case. */
function streamList(names: string[]): string {
  const lower = names.map((name) => name.toLowerCase())
  return lower.length > 1
    ? `${lower.slice(0, -1).join(', ')} and ${lower.at(-1)}`
    : (lower[0] ?? '')
}

/* From the visible streams (hide-websites), so a hidden stream is not named
   in the title or the description either. */
export async function generateMetadata(): Promise<Metadata> {
  const list = streamList((await getStreams()).map((stream) => stream.name))
  const title = list.charAt(0).toUpperCase() + list.slice(1)
  return {
    title: `${title} — Brisbane`,
    description: `Custom ${list}, built in Brisbane on hardware we own. We work out what is actually wrong, build the thing that fixes it, and stay on to run it.`,
  }
}

/**
 * Home page.
 *
 * The fold is the promise and the three ways in: the message, two ways on
 * (start a conversation, or see the work), and the stage: one card per
 * stream, each a link. The streams are argued straight after,
 * in "What changes", and the
 * argument that ties them together sits *after* that — supporting material
 * for someone who is already interested, not a gate in front of the thing
 * they came for.
 *
 * The header is the masthead. There was a full lockup at the top of this plate
 * and it was costing about 120px of the scarcest space on the site to say a
 * name nobody has heard yet — the headline does that job better. So the mark
 * stays in the header, the header is present here exactly as it is on every
 * other page, and the plate opens straight onto the argument.
 *
 * Everything below the fold is a server component. The only client boundaries
 * are the rotating headline, the stage, the mill lines and the Reveal
 * wrappers, and the copy inside a Reveal is still rendered on the server.
 */
export default async function Home() {
  const [streams, partners, crew, site] = await Promise.all([
    getStreams(),
    getPartners(),
    getCrew(),
    getSite(),
  ])

  return (
    <main className="home">
      {/*
        The fold is one machined plate: the message on the left; on the
        right the stage, three stream cards, one link per stream, whose rims
        follow the headline as each word types (hero-cards, 6 November).
      */}
      <section className="home-hero">
        <div className="home-plate">
          {/* Behind everything on the plate; renders nothing on touch or
              under reduced motion, where the CSS lines stay. */}
          <MillLines />

          {/* One timeline for the headline and the stage (HeroRun.tsx). */}
          <HeroRunProvider words={streams.map((stream) => stream.name)}>
            <div className="home-hero__inner">
              <div className="home-hero__say">
                <RotatingHeadline />

                <p className="home-hero__lede">
                  Most businesses bend themselves around tools that nearly fit.
                </p>
                <p className="home-hero__sub">
                  It starts with a conversation about what is actually going wrong. Then we build
                  the thing that fixes it, and stay on to run it.
                </p>

                {/* The copy promises a conversation, so the fold offers one;
                  and for someone who wants to see first, the work. */}
                <p className="home-hero__cta">
                  <Link href="/contact" className="basic-button">
                    Start a conversation
                  </Link>
                  <Link href="/built" className="basic-button secondary-button">
                    See what we&rsquo;ve built
                  </Link>
                </p>
              </div>

              {/* After the copy in the source: the two buttons come first in
                  the tab order, then the three cards. Inside the copy block,
                  because its height is set against the copy's
                  (hero-stage-2). */}
              <HeroStage
                photos={site.heroPhotos}
                streams={streams.map((stream) => ({
                  slug: stream.slug,
                  name: stream.name,
                  href: stream.href,
                }))}
              />
            </div>
          </HeroRunProvider>

          {/*
            The plate's bottom edge. Two jobs: it stops a short content block
            floating in a tall viewport, and it puts proof in the fold — until
            now the first evidence that anyone has ever paid us was three
            sections down the page.
          */}
          <div className="home-plate__foot">
            <div className="home-plate__trust">
              <span id="home-trust-label" className="home-plate__trust-label">
                Working with
              </span>
              <ul className="home-plate__logos" aria-labelledby="home-trust-label">
                {partners.map((partner) => (
                  <li key={partner.slug} className="home-plate__logo">
                    <Image
                      src={partner.logo.src}
                      alt={partner.name}
                      width={partner.logo.width}
                      height={partner.logo.height}
                      className="home-plate__logo-img"
                    />
                  </li>
                ))}
              </ul>
            </div>
            <a className="home-plate__cue" href="#what-changes">
              <span className="home-plate__cue-label">More on each</span>
              <span className="home-plate__cue-knob" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M6 10 L12 16 L18 10"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      <StreamMoves streams={streams} />

      <Reveal id="why" className="home-why">
        <div className="home-why__grid">
          <CutPhoto
            photo={site.workingPhoto}
            sizes="(max-width: 979px) 92vw, (max-width: 1366px) 40vw, 545px"
            className="home-why__photo"
          />
          <div className="home-why__copy">
            <p className="home-eyebrow">Why we work this way</p>
            <h2 className="home-why__title home-line">
              Different work, the same complaint underneath it.
            </h2>
            <p className="home-why__body home-line">
              A platform that does eighty per cent of the job. A template site that fights you every
              time you edit it. A system specified by someone who had never had to run the place.
              Every one of them ends with the organisation bending to fit the tool.
            </p>
            <p className="home-why__body home-line">
              Between us we have spent years running operations, not only building software for them
              — which is most of why we notice when a system has been specified by someone who has
              not. We make our own tools and run our own hardware, and the same small team does the
              whole job. That is why the answer is the same in all three: work out what is actually
              wrong, build to that, and stay on to run it.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal id="partners" className="home-sec">
        <div className="home-sec__head">
          <h2>Who we work with</h2>
          <p className="home-eyebrow">Clients &amp; partners</p>
        </div>
        <div className="home-orgs">
          {partners.map((partner) => (
            <div key={partner.slug} className="home-org">
              <div className="home-org__plate">
                <Image
                  src={partner.logo.src}
                  alt={partner.name}
                  width={partner.logo.width}
                  height={partner.logo.height}
                  sizes="210px"
                  className="home-org__logo"
                />
              </div>
              <div>
                <p className="home-org__kind">{partner.kind}</p>
                <p className="home-org__body">
                  {partner.body}
                  {partner.pending && (
                    <span className="home-pending" title="Wording not confirmed yet">
                      {' '}
                      [wording needed]
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal id="team" className="home-sec">
        <div className="home-sec__head">
          <h2>The team</h2>
          <p className="home-eyebrow">Everyone you will actually deal with</p>
        </div>
        <div className="home-people">
          {crew.map((member) => (
            <figure key={member.slug} className="home-person">
              <div className="home-face">
                {member.portrait ? (
                  /* In colour, with no tone layer. The edge below is drawn
                     over it. */
                  <Image
                    src={member.portrait.src}
                    alt=""
                    width={member.portrait.width}
                    height={member.portrait.height}
                    sizes="(max-width: 560px) 92vw, (max-width: 979px) 31vw, (max-width: 1366px) 18vw, 245px"
                    className="home-face__img"
                  />
                ) : (
                  <TerminalTile name={member.name} />
                )}
                <span className="home-face__edge" aria-hidden="true" />
              </div>
              <figcaption>
                <h3 className="home-person__name">{member.name}</h3>
                <p className="home-person__role">{member.role}</p>
                <p className="home-person__bio">
                  {member.summary}
                  {member.pending && (
                    <span className="home-pending" title="Entry not written by this person yet">
                      {' '}
                      [pending]
                    </span>
                  )}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="home-sec__more">
          <Link href="/team">Read the longer version &rarr;</Link>
        </p>
      </Reveal>

      <Reveal id="start" className="home-close">
        <h2 className="home-close__title home-line">Tell us what you are trying to build.</h2>
        {/*
          Title and button only (home-tweaks). The email and location moved
          to the footer, beside the ABN, on every page. Still no phone here:
          it is in the header contacts and on /contact.
        */}
        <p className="home-close__cta">
          <Link href="/contact" className="basic-button">
            Start a conversation
          </Link>
        </p>
      </Reveal>
    </main>
  )
}
