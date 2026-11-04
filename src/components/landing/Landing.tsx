import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LANDINGS, STREAMS } from '@constants'
import StreamMark from '@/components/home/StreamMark'
import '@/app/(site)/styles/pages.scss'
import '@/app/(site)/styles/stream.scss'

const BASE = 'https://www.vsource.dev'

/**
 * One search landing page — /regulated, /accessibility.
 *
 * Deliberately the stream template's twin, down to the classes: these are
 * documents, the same as the stream pages, and a landing page that looks
 * different from the rest of the site reads as a landing page. Everything it
 * says comes from constants/landings.ts; the route files only name a slug.
 *
 * Server-rendered, all of it. The copy has to be in the HTML of the first
 * response, because most AI crawlers do not execute JavaScript and these two
 * pages exist to be read by them.
 */
export function landingMetadata(slug: string): Metadata {
  const landing = LANDINGS.find((item) => item.slug === slug)
  if (!landing) return {}

  return {
    title: landing.metaTitle,
    description: landing.metaDescription,
    alternates: { canonical: `/${landing.slug}` },
    openGraph: {
      url: `/${landing.slug}`,
      title: landing.metaTitle,
      description: landing.metaDescription,
    },
  }
}

export default function Landing({ slug }: { slug: string }) {
  const landing = LANDINGS.find((item) => item.slug === slug)
  if (!landing) notFound()

  const stream = STREAMS.find((item) => item.id === landing.stream)
  if (!stream) notFound()

  const url = `${BASE}/${landing.slug}`

  // areaServed is AU, not Brisbane, on purpose: someone looking for regulated
  // or specialist capability searches nationally, and proximity stops mattering.
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: landing.metaTitle,
    description: landing.metaDescription,
    serviceType: landing.serviceType,
    provider: { '@id': `${BASE}/#organisation` },
    areaServed: 'AU',
  }

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: stream.name, item: `${BASE}${stream.href}` },
      { '@type': 'ListItem', position: 3, name: landing.metaTitle, item: url },
    ],
  }

  return (
    <main className="page stream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="stream__head">
        <div>
          <p className="page__eyebrow">
            <Link href={stream.href}>{stream.name}</Link>
          </p>
          <h1 className="page__title">{landing.title}</h1>
          <p className="page__lede">
            {landing.lede}
            {landing.pending && (
              <span className="home-pending" title="Unverified copy — not signed off">
                {' '}
                [pending]
              </span>
            )}
          </p>
        </div>
        <StreamMark id={stream.id} className="stream__mark" />
      </div>

      {landing.sections.map((section) => (
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
          </div>
        </section>
      ))}

      <p className="stream__cta">
        <Link href="/contact" className="basic-button">
          Start a conversation
        </Link>
      </p>
    </main>
  )
}
