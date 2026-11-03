import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BUILT, STREAMS, STREAM_COMMON } from '@constants'
import StreamMark from '@/components/home/StreamMark'
import '../styles/pages.scss'
import '../styles/stream.scss'

/**
 * One offer per stream — /software, /websites, /robotics.
 *
 * One template, three routes, all of it driven from constants/streams.ts. A
 * fourth stream would be a data change rather than a new page, and nothing here
 * knows which stream it is rendering beyond what that file says.
 *
 * This replaces /services, which tried to be five offers on one page and
 * therefore ranked for none of them. `dynamicParams = false` means anything
 * that is not a stream is a 404 rather than an empty render — this route sits
 * at the top level, so without it every unmatched path on the site would land
 * here.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return STREAMS.map((stream) => ({ stream: stream.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ stream: string }>
}): Promise<Metadata> {
  const { stream: id } = await params
  const stream = STREAMS.find((item) => item.id === id)
  if (!stream) return {}

  return {
    title: `${stream.name} — ${stream.promise}`,
    description: stream.pageLede,
    alternates: { canonical: stream.href },
    openGraph: { url: stream.href, title: `${stream.name} — V Source` },
  }
}

export default async function StreamPage({ params }: { params: Promise<{ stream: string }> }) {
  const { stream: id } = await params
  const stream = STREAMS.find((item) => item.id === id)
  if (!stream) notFound()

  // Anything on /built that belongs to this stream, so the offer and the proof
  // are one click apart in both directions.
  const projects = BUILT.filter((project) => project.stream === stream.id)

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
        <StreamMark id={stream.id} className="stream__mark" />
      </div>

      <p className="stream__who">{stream.who}</p>

      {stream.sections.map((section) => (
        <section key={section.id} id={section.id} className="stream__section">
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
        </section>
      ))}

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
