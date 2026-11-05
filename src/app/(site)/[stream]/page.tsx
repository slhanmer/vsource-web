import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { STREAM_COMMON } from '@constants'
import { getProjects, getStream, getStreams } from '@/data'
import ProjectMedia from '@/components/built/ProjectMedia'
import CutPhoto from '@/components/photos/CutPhoto'
import '../styles/pages.scss'
import '../styles/stream.scss'
/* Section clips use the /built media frame and its pause control. */
import '../styles/built.scss'

/**
 * One offer per stream — /software, /robotics, /websites.
 *
 * One template, every route, all of it driven from the `streams` collection
 * (src/data/). A fourth stream is a data change rather than a new page — and,
 * with dynamicParams on, not a redeploy either. It does need a mark in
 * StreamMark, which is drawn in code.
 *
 * This replaces /services, which tried to be five offers on one page and
 * therefore ranked for none of them.
 *
 * ⚠ `dynamicParams` MUST BE TRUE. This route sits at the top level, so every
 * unmatched path lands here, and the page's notFound() is what makes those a
 * 404. It used to be `false`, which was fine while the content was constants.
 * With Payload it breaks the site: a save in /admin clears the `content` tag,
 * Next then refuses to regenerate a prerendered stream page it can no longer
 * find in its cache (NoFallbackError), and /software, /robotics and /websites
 * all 404 until the next deploy. Found by the cms brief's verify step.
 */
export const dynamicParams = true

export async function generateStaticParams() {
  return (await getStreams()).map((stream) => ({ stream: stream.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stream: string }>
}): Promise<Metadata> {
  const { stream: slug } = await params
  const stream = await getStream(slug)
  if (!stream) return {}

  return {
    title: `${stream.name} — ${stream.promise}`,
    description: stream.pageLede,
    alternates: { canonical: stream.href },
    openGraph: { url: stream.href, title: `${stream.name} — V Source` },
  }
}

export default async function StreamPage({ params }: { params: Promise<{ stream: string }> }) {
  const { stream: slug } = await params
  const stream = await getStream(slug)
  if (!stream) notFound()

  // Anything on /built that belongs to this stream, so the offer and the proof
  // are one click apart in both directions.
  let mediaIndex = 0
  const projects = (await getProjects()).filter((project) => project.stream === stream.slug)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `https://www.vsource.dev${stream.href}#service`,
    name: stream.name,
    description: stream.pageLede,
    provider: { '@id': 'https://www.vsource.dev/#organisation' },
    areaServed: 'AU',
  }

  return (
    <main className="page stream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="stream__head">
        <div>
          <p className="page__eyebrow">{stream.name}</p>
          <h1 className="page__title">{stream.promise}</h1>
          <p className="page__lede">{stream.pageLede}</p>
        </div>
        {/* A photograph where the line drawing was (review-2), at its own
            aspect. */}
        {stream.pagePhoto && (
          <CutPhoto
            photo={stream.pagePhoto}
            sizes="(max-width: 768px) 100vw, 460px"
            className="stream__photo"
          />
        )}
      </div>

      <p className="stream__who">{stream.who}</p>

      {/*
        A section with media is two columns, text and media, and they
        alternate sides down the page: the first with media has it on the
        right, the next on the left. A section without media stays one text
        column and does not count towards the alternation.
      */}
      {stream.sections.map((section) => {
        const flip = section.media ? mediaIndex++ % 2 === 1 : false
        return (
          <section
            key={section.slug}
            id={section.slug}
            className={`stream__section${section.media ? ' stream__section--media' : ''}${flip ? ' is-flipped' : ''}`}
          >
            <div className="stream__text">
              <h2 className="stream__title">
                {section.title}
                {section.pending && (
                  <span className="home-pending" title="Placeholder — not signed off">
                    {' '}
                    [placeholder]
                  </span>
                )}
              </h2>
              <div className="stream__content">
                {section.body.map((para) => (
                  <p key={para.slice(0, 40)} className="stream__para">
                    {para}
                  </p>
                ))}
                {section.includes && (
                  <ul className="stream__includes">
                    {section.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {/*
                  The hand-off to the page that covers this subject properly. It is
                  a field rather than a link inside `body` because `body` entries
                  are plain strings — markdown written in one would render as
                  literal brackets on the page.
                */}
                {section.link && (
                  <p className="stream__onward">
                    <Link href={section.link.href}>{section.link.label} &rarr;</Link>
                  </p>
                )}
              </div>
            </div>
            {section.media && (
              <div className="stream__figure">
                {section.media.kind === 'video' ? (
                  <ProjectMedia
                    spec={section.media}
                    sizes="(max-width: 979px) 100vw, 560px"
                    className="stream__clip"
                  />
                ) : (
                  <CutPhoto
                    photo={{
                      src: section.media.src ?? '',
                      alt: section.media.alt,
                      width: section.media.width,
                      height: section.media.height,
                    }}
                    sizes="(max-width: 979px) 100vw, 560px"
                    className="stream__image"
                  />
                )}
              </div>
            )}
          </section>
        )
      })}

      <section className="stream__common">
        <h2 className="stream__title">{STREAM_COMMON.heading}</h2>
        <ul className="stream__includes">
          {STREAM_COMMON.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/*
        Price on the page. Most shops in this market hide it behind a form,
        which costs them every buyer who was only ever going to find out whether
        they could afford it. Two of these cannot be priced before they are
        scoped, and saying that plainly is more use than "contact us".
      */}
      <section className="stream__price">
        <p className="stream__price-label">What it costs</p>
        <p className="stream__price-value">{stream.pricing.value}</p>
        <p className="stream__price-note">{stream.pricing.note}</p>
      </section>

      <section className="stream__proof">
        <p className="stream__proof-label">{stream.proof.label}</p>
        <p className="stream__proof-body">
          {stream.proof.body}
          {stream.proof.pending && (
            <span className="home-pending" title="Wording still to come from Craig">
              {' '}
              [wording needed]
            </span>
          )}
        </p>
        {projects.length > 0 && (
          <ul className="stream__projects">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={`/built/${project.slug}`}>{project.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="stream__cta">
        <Link href="/contact" className="basic-button">
          Start a conversation
        </Link>
      </p>
    </main>
  )
}
