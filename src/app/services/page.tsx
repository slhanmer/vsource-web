import type { Metadata } from 'next'
import Link from 'next/link'
import { SERVICES, APPROACH } from '@constants'
import '../styles/pages.scss'
import '../styles/services.scss'

export const metadata: Metadata = {
  title: 'Services — Custom Software Development, Brisbane',
  description:
    'Custom software, design and accessibility to WCAG 2.2 AA, Australian hosting on our own hardware, regulated and safety-critical work, and ongoing support. Built in house, top to bottom, from Brisbane.',
  alternates: { canonical: '/services' },
  openGraph: { url: '/services', title: 'Services — Custom Software Development, Brisbane' },
}

/** One Service node per offering, all provided by the organisation in layout.tsx. */
const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': SERVICES.map((service) => ({
    '@type': 'Service',
    '@id': `https://www.vsource.dev/services#${service.id}`,
    name: service.title,
    description: service.summary,
    provider: { '@id': 'https://www.vsource.dev/#organisation' },
    areaServed: 'AU',
  })),
}

export default function ServicesPage() {
  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }}
      />
      <p className="page__eyebrow">What we do</p>
      <h1 className="page__title">Custom software, built and run by the people who wrote it.</h1>
      <p className="page__lede">
        A small team who build the software, own the tools it is built from, and run the hardware it
        sits on. The people who write your code are the people you talk to, and there is no platform
        licence sitting underneath it.
      </p>

      <div className="services">
        {SERVICES.map((service, i) => (
          <section key={service.id} id={service.id} className="services__item">
            <p className="services__index" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </p>
            <div className="services__head">
              <h2 className="services__title">{service.title}</h2>
              <p className="services__summary">{service.summary}</p>
            </div>
            <div className="services__content">
              {service.body.map((para) => (
                <p key={para.slice(0, 40)} className="services__para">
                  {para}
                </p>
              ))}
              <ul className="services__includes">
                {service.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <section className="approach">
        <h2 className="approach__heading">{APPROACH.heading}</h2>
        {APPROACH.body.map((para) => (
          <p key={para.slice(0, 40)} className="approach__para">
            {para}
          </p>
        ))}
        <Link href="/contact" className="basic-button approach__cta">
          Start a conversation
        </Link>
      </section>
    </main>
  )
}
