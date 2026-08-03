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
 * Service cards and the work teaser map over the shared constants so the home
 * page and the detail pages cannot drift apart.
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
            We build to fit instead. Our own component library, our own ORM, our own servers —
            which is why software built exactly for you now costs a fraction of what it used to,
            and why nobody else&rsquo;s release schedule can break it.
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
              <article key={service.title} className="card">
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
              </article>
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
              <article key={member.name} className="card">
                <h3>{member.name}</h3>
                <p className="card__role">{member.role}</p>
                <p>{member.summary}</p>
              </article>
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
