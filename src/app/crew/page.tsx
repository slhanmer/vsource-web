import type { Metadata } from 'next'
import { CREW } from '@constants'
import '../styles/pages.scss'
import '../styles/crew.scss'

export const metadata: Metadata = {
  title: 'Crew',
  description:
    'A technical director off the tools, a developer who ran kitchens, and a QA lead who reads the documentation before the auditor does.',
}

/** Initials fallback while we have no portraits. */
const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export default function CrewPage() {
  return (
    <main className="page">
      <p className="page__eyebrow">Who you get</p>
      <h1 className="page__title">A small team, and you talk to all of them.</h1>
      <p className="page__lede">
        There is no account manager here. The people who scope the work are the people who write
        it, and between us we have spent longer on building sites, in kitchens and under
        regulatory audit than we have in stand-ups.
      </p>

      <div className="crew">
        {CREW.map((member) => (
          <article key={member.name} className="crew__card">
            <div className="crew__portrait" aria-hidden="true">
              {member.portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.portrait} alt="" className="crew__portrait-img" />
              ) : (
                <span className="crew__initials">{initials(member.name)}</span>
              )}
            </div>
            <div className="crew__body">
              <h2 className="crew__name">{member.name}</h2>
              <p className="crew__role">{member.role}</p>
              <p className="crew__bio">{member.bio}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="placeholder-copy">
        DRAFT — titles are invented, Ronan&rsquo;s surname is missing, and there are no portraits
        yet. Bios are a starting point, not final copy.
      </div>
    </main>
  )
}
