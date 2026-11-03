import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CONTACT, CREW, PARTNERS, PHOTOS, STREAMS } from '@constants'
import Reveal from '@/components/home/Reveal'
import RotatingHeadline from '@/components/home/RotatingHeadline'
import StreamMoves from '@/components/home/StreamMoves'
import CutPhoto from '@/components/photos/CutPhoto'
import './styles/pages.scss'
import './styles/home.scss'

export const metadata: Metadata = {
  title: 'Software, websites and robotics — Brisbane',
  description:
    'Custom software, websites and systems work, built in Brisbane on hardware we own. We work out what is actually wrong, build the thing that fixes it, and stay on to run it.',
}

/**
 * Home page.
 *
 * Three streams means three different buyers landing on the same URL, so this
 * page routes before it argues: logo, the promise, then the three doors, all
 * inside the first screen. The detail bands follow, and the argument that ties
 * the three together sits *after* them — it is supporting material for someone
 * who is already interested, not a gate in front of the thing they came for.
 *
 * The header is the masthead. There was a full lockup at the top of this plate
 * and it was costing about 120px of the scarcest space on the site to say a
 * name nobody has heard yet — the headline does that job better. So the mark
 * stays in the header, the header is present here exactly as it is on every
 * other page, and the plate opens straight onto the argument.
 *
 * Everything below the fold is a server component. The only client boundaries
 * are the rotating headline, the stream bands and the Reveal wrappers, and the
 * copy inside a Reveal is still rendered on the server.
 */
export default function Home() {
  return (
    <main className="home">
      {/*
        The fold is one machined plate. The streams are openings cut through
        it, not cards resting on a page, and each opening has a photograph of
        that kind of work cut into it in turn.

        The door names are spans, not headings: the band for each stream below
        carries the real h2, and two h2s with the same text would put every
        stream in the document outline twice.
      */}
      <section className="home-hero">
        <div className="home-plate">
          <div className="home-hero__inner">
            <div className="home-hero__say">
              <RotatingHeadline />

              <p className="home-hero__lede">
                Most businesses bend themselves around tools that nearly fit.
              </p>
              <p className="home-hero__sub">
                It starts with a conversation about what is actually going wrong. Then we build the
                thing that fixes it, and stay on to run it.
              </p>

              {/*
                The doors are for someone who already knows which stream they
                want. This is for everyone else — and since the copy above
                promises a conversation, the fold has to offer one.
              */}
              <p className="home-hero__cta">
                <Link href="/contact" className="basic-button">
                  Start a conversation
                </Link>
              </p>
            </div>

            <Reveal as="div" className="home-doors">
              {STREAMS.map((stream) => (
                <a key={stream.id} className="home-door" href={stream.href}>
                  <div className="home-door__cut">
                    <CutPhoto
                      photo={PHOTOS.streams[stream.id].door}
                      sizes="(max-width: 480px) 64px, (max-width: 979px) 36vw, (max-width: 1440px) 17vw, 232px"
                      className="home-door__photo"
                    />
                    <div className="home-door__body">
                      <span className="home-door__name">{stream.name}</span>
                      <span className="home-door__lede">{stream.door}</span>
                      <span className="home-door__go">Learn more</span>
                    </div>
                  </div>
                </a>
              ))}
            </Reveal>
          </div>

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
                {PARTNERS.map((partner) => (
                  <li key={partner.id} className="home-plate__logo">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      className="home-plate__logo-img"
                    />
                  </li>
                ))}
              </ul>
            </div>
            <a className="home-plate__cue" href="#software">
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

      <StreamMoves />

      <Reveal id="why" className="home-why">
        <div className="home-why__grid">
          <CutPhoto
            photo={PHOTOS.working}
            sizes="(max-width: 979px) 100vw, 580px"
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
          {PARTNERS.map((partner) => (
            <div key={partner.id} className="home-org">
              <div className="home-org__plate">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                  sizes="210px"
                  className="home-org__logo"
                />
              </div>
              <div>
                <p className="home-org__kind">{partner.kind}</p>
                <p className="home-org__body">
                  {partner.body}
                  {partner.pending && (
                    <span className="home-pending" title="Wording still to come from Craig">
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
          {CREW.map((member) => (
            <figure key={member.id} className="home-person">
              <div className={`home-face ${member.portrait ? '' : 'home-face--empty'}`.trim()}>
                {member.portrait ? (
                  /* In colour, with no tone layer. The edge below is drawn
                     over it. */
                  <Image
                    src={member.portrait}
                    alt=""
                    width={1200}
                    height={1500}
                    sizes="(max-width: 560px) 100vw, (max-width: 979px) 33vw, 240px"
                    className="home-face__img"
                  />
                ) : (
                  <span className="home-face__initials" aria-hidden="true">
                    {member.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </span>
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
        <div className="home-close__row home-line">
          <span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </span>
          {/*
            No phone here. It is in the header contacts and on /contact, which
            is where someone who wants to ring looks — repeating it at the foot
            of the home page was the third time the same number appeared on one
            screen.
          */}
          <span>{CONTACT.location}</span>
          <span>ABN {CONTACT.abn}</span>
        </div>
        <p className="home-close__cta">
          <Link href="/contact" className="basic-button">
            Start a conversation
          </Link>
        </p>
      </Reveal>
    </main>
  )
}
