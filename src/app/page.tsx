import Link from 'next/link'
import './styles/pages.scss'
import './styles/home.scss'

/**
 * Home page — STRUCTURE ONLY.
 *
 * Every string below is placeholder. Copy is pending the crew details and the
 * engineering offering; the Aptium reference needs sign-off on how much can be
 * named while the project is still in development.
 */
export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero__inner">
          <p className="page__eyebrow">Software &amp; engineering</p>
          <h1 className="hero__title">We build software that has to keep working.</h1>
          <p className="hero__lede">
            V Source is a three-person studio in Brisbane. We take on the work that needs doing
            properly — regulated products, technical integrations, systems that outlive the people
            who commissioned them.
          </p>
          <div className="hero__actions">
            <Link href="/contact" className="hero__cta">
              Start a conversation
            </Link>
            <Link href="/work" className="hero__cta hero__cta--ghost">
              See our work
            </Link>
          </div>
          <p className="placeholder-copy hero__note">
            headline, lede and both CTAs are stand-ins. Needs the real positioning.
          </p>
        </div>
      </section>

      <div className="page">
        <section className="page__section">
          <h2 className="page__section-title">What we do</h2>
          <div className="card-grid">
            <article className="card">
              <h3>Software</h3>
              <p>
                Web applications, APIs and the infrastructure under them. React, TypeScript, Node.
              </p>
            </article>
            <article className="card">
              <h3>Engineering</h3>
              <p>Placeholder — awaiting the actual engineering offering.</p>
            </article>
            <article className="card">
              <h3>Ongoing support</h3>
              <p>We stay with what we build. Maintenance, iteration and the unglamorous parts.</p>
            </article>
          </div>
        </section>

        <section className="page__section">
          <h2 className="page__section-title">Selected work</h2>
          <div className="placeholder-copy">
            Aptium case study goes here — a TGA-regulated Class A medical imaging device management
            suite, currently in development. Needs sign-off before it goes live.
          </div>
        </section>

        <section className="page__section">
          <h2 className="page__section-title">The crew</h2>
          <div className="placeholder-copy">
            Three cards — names, roles, background. Awaiting details.
          </div>
        </section>
      </div>
    </main>
  )
}
