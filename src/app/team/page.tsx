import type { Metadata } from 'next'
import Image from 'next/image'
import { CREW, PHOTOS } from '@constants'
import TonedPhoto from '@/components/photos/TonedPhoto'
import '../styles/pages.scss'
import '../styles/crew.scss'

export const metadata: Metadata = {
  title: 'Team — the people who build it',
  description:
    'A technical director off the tools, a developer who ran kitchens, and a QA lead who reads the documentation before the auditor does. A small team in Brisbane.',
  alternates: { canonical: '/team' },
  openGraph: { url: '/team', title: 'Team — the people who build it' },
}

/**
 * The team.
 *
 * Moved from /crew — Craig dislikes "crew", the nav label was changed in August
 * and the route was not. /crew now 301s here (next.config.ts); the old
 * app/crew/ folder has been deleted.
 *
 * Initials fallback, used where a portrait does not exist. Deliberately not a
 * grey avatar silhouette: the box keeps its 4:5 shape and takes a tinted,
 * milled plate with the initials cut into it, so it reads as a blank in a set
 * rather than as an image that failed to load.
 *
 * That matters because the row is MIXED, not empty. Tom and Asuka will never
 * have photographs (see crew.ts), the others will, and a flat
 * grey box in that row is the thing the eye goes to first. See
 * `.crew__portrait--empty` in crew.scss, and keep it in step with
 * `.home-face--empty` in home.scss.
 */
const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const CREW_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': CREW.map((person) => ({
    '@type': 'Person',
    '@id': `https://www.vsource.dev/team#${person.id}`,
    name: person.name,
    jobTitle: person.role,
    worksFor: { '@id': 'https://www.vsource.dev/#organisation' },
  })),
}

export default function TeamPage() {
  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CREW_SCHEMA) }}
      />
      <p className="page__eyebrow">Who you get</p>
      <h1 className="page__title">A small team, and you talk to all of them.</h1>
      <p className="page__lede">
        There is no account manager here. The people who scope the work are the people who write it,
        and between us we have spent longer on building sites, in kitchens and under regulatory
        audit than we have in stand-ups.
      </p>

      {/* The group photograph, full width under the head. Renders nothing until
          one is set in constants/photos.ts. */}
      {PHOTOS.group && (
        <TonedPhoto
          photo={PHOTOS.group}
          sizes="(max-width: 1320px) 100vw, 1320px"
          className="crew-group"
        />
      )}

      <div className="crew">
        {CREW.map((member) => (
          <article key={member.id} id={member.id} className="crew__card">
            {/*
              The portrait box is the same size and shape whether there is a
              photograph in it or not, so the page does not reflow on the day
              the shoot lands. The source stays greyscale and the duotone is a
              layer over it — a straight export drops in and picks up the
              treatment without being re-edited.
            */}
            <div
              className={`crew__portrait ${member.portrait ? '' : 'crew__portrait--empty'}`.trim()}
              aria-hidden="true"
            >
              {member.portrait ? (
                <>
                  <Image
                    src={member.portrait}
                    alt=""
                    width={880}
                    height={1100}
                    sizes="(max-width: 860px) 100vw, (max-width: 1320px) 33vw, 420px"
                    unoptimized
                    className="crew__portrait-img"
                  />
                  <span className="crew__portrait-tone" />
                </>
              ) : (
                <span className="crew__initials">{initials(member.name)}</span>
              )}
            </div>
            <div className="crew__body">
              <h2 className="crew__name">{member.name}</h2>
              <p className="crew__role">{member.role}</p>
              <p className="crew__bio">
                {member.bio}
                {member.pending && (
                  <span className="home-pending" title="Entry not written by this person yet">
                    {' '}
                    [pending]
                  </span>
                )}
              </p>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
