import Link from 'next/link'
import { CASE_STUDY_TEASER, CREW, SERVICES } from '@constants'
import './styles/pages.scss'
import './styles/home.scss'

/**
 * Home page.
 *
 * Framed from the visitor's problem rather than from our capabilities: the
 * hero opens on a situation most readers recognise, and the mechanism (owning
 * the stack) is what stops "cheaper" reading as "worse". Everything below is
 * proof of that mechanism.
 *
 * Every card is a link to its own anchor on the detail page, so a card that
 * describes something also takes you to it. Ids live on the constants, so the
 * cards and the anchors cannot drift apart.
 */
export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero__inner">
          <p className="page__eyebrow">Custom software</p>
          <h1 className="hero__title">
            Most businesses bend themselves around software that nearly fits.
          </h1>
          <p className="hero__lede">
            We build to fit instead. We make our own tools and run our own hardware, which is why
            software built exactly for you now costs a fraction of what it used to — and why no one
            else&rsquo;s software update can break yours.
          </p>
          <div className="hero__actions">
            <Link href="/contact" className="basic-button">
              Start a conversation
            </Link>
            <Link href="/work" className="basic-button secondary-button">
              See our work
            </Link>
          </div>
        </div>
      </section>

      <div className="page">
        <section className="page__section">
          <h2 className="page__section-title">What we do</h2>
          <div className="card-grid">
            {SERVICES.map((service) => (
              <Link key={service.id} href={`/services#${service.id}`} className="card card--link">
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
              </Link>
            ))}
          </div>
          <p className="home__more">
            <Link href="/services">How we work &rarr;</Link>
          </p>
        </section>

        <section className="page__section">
          <h2 className="page__section-title">Selected work</h2>
          <Link href="/work" className="card card--link home__work">
            <h3>{CASE_STUDY_TEASER.title}</h3>
            <p>{CASE_STUDY_TEASER.summary}</p>
            <span className="home__work-cta">{CASE_STUDY_TEASER.cta} &rarr;</span>
          </Link>
        </section>

        <section className="page__section">
          <h2 className="page__section-title">The crew</h2>
          <div className="card-grid">
            {CREW.map((member) => (
              <Link key={member.id} href={`/crew#${member.id}`} className="card card--link">
                <h3>{member.name}</h3>
                <p className="card__role">{member.role}</p>
                <p>{member.summary}</p>
              </Link>
            ))}
          </div>
          <p className="home__more">
            <Link href="/crew">Read the longer version &rarr;</Link>
          </p>
        </section>
      </div>
    </main>
  )
}
