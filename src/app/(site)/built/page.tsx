import type { Metadata } from 'next'
import Link from 'next/link'
import { BUILT, COMING_SOON } from '@constants'
import ProjectMedia from '@/components/built/ProjectMedia'
import '../styles/pages.scss'
import '../styles/built.scss'

export const metadata: Metadata = {
  title: 'Built — projects and current work',
  description:
    'Systems, sites and machines we have built and still run, from Brisbane. Medical device software to IEC 62304, accessible web work, and hardware that has to keep walking.',
  alternates: { canonical: '/built' },
  openGraph: { url: '/built', title: 'Built — projects and current work' },
}

/**
 * The showpiece.
 *
 * Media leads, words follow — the opposite of the old /work page, which was
 * ~970 words about one client and not a single picture of anything. One
 * featured item across the full width, then a grid.
 *
 * Every card is a link to the project's own page, so each project is an
 * indexable URL that can carry its own detail and its own search surface.
 */
export default function BuiltPage() {
  const featured = BUILT.find((project) => project.featured)
  const rest = BUILT.filter((project) => !project.featured)

  return (
    <main className="page built">
      <p className="page__eyebrow">Built</p>
      <h1 className="page__title">Things we have made, and still run.</h1>
      <p className="page__lede">
        Some of this is software you will never see the inside of, and some of it walks. What they
        have in common is that the people who built them are the people who answer the phone about
        them.
      </p>

      {featured && (
        <Link href={`/built/${featured.slug}`} className="built-card built-card--lead">
          <ProjectMedia
            spec={featured.media}
            priority
            sizes="(max-width: 979px) 100vw, 710px"
            className="built-card__media"
          />
          <div className="built-card__body">
            <p className="built-card__meta">
              <span className="built-card__stream">{featured.stream}</span>
              <span className="built-card__year">{featured.year}</span>
              <span className={`built-card__status is-${featured.status}`}>{featured.status}</span>
            </p>
            <h2 className="built-card__title">{featured.title}</h2>
            <p className="built-card__line">
              {featured.line}
              {featured.placeholder && (
                <span className="home-pending" title="Invented copy — not signed off">
                  {' '}
                  [placeholder]
                </span>
              )}
            </p>
            <span className="built-card__go">See the project</span>
          </div>
        </Link>
      )}

      <div className="built-grid">
        {rest.map((project) => (
          <Link key={project.slug} href={`/built/${project.slug}`} className="built-card">
            <ProjectMedia
              spec={project.media}
              sizes="(max-width: 700px) 100vw, (max-width: 1080px) 50vw, 400px"
              className="built-card__media"
            />
            <div className="built-card__body">
              <p className="built-card__meta">
                <span className="built-card__stream">{project.stream}</span>
                <span className="built-card__year">{project.year}</span>
                <span className={`built-card__status is-${project.status}`}>{project.status}</span>
              </p>
              <h2 className="built-card__title">{project.title}</h2>
              <p className="built-card__line">
                {project.line}
                {project.placeholder && (
                  <span className="home-pending" title="Invented copy — not signed off">
                    {' '}
                    [placeholder]
                  </span>
                )}
              </p>
              <span className="built-card__go">See the project</span>
            </div>
          </Link>
        ))}
      </div>

      {/*
        Named, real, and not started. A quiet row rather than eight more cards
        with nothing in them: a list with things coming reads as a pipeline,
        where eight empty cards read as padding.
      */}
      <section className="built-soon" aria-labelledby="built-soon-heading">
        <h2 id="built-soon-heading" className="built-soon__heading">
          Coming
        </h2>
        <ul className="built-soon__list">
          {COMING_SOON.map((item) => (
            <li key={item.name} className="built-soon__item">
              <span className="built-soon__name">{item.name}</span>
              <span className="built-soon__stream">{item.stream}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
