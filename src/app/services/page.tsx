import type { Metadata } from 'next'
import Link from 'next/link'
import { SERVICES, APPROACH } from '@constants'
import '../styles/pages.scss'
import '../styles/services.scss'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Custom software, Australian hosting on our own hardware, regulated and safety-critical work, and ongoing support — built in house with our own component library and ORM.',
}

export default function ServicesPage() {
  return (
    <main className="page">
      <p className="page__eyebrow">What we do</p>
      <h1 className="page__title">Custom software, built and run by the people who wrote it.</h1>
      <p className="page__lede">
        No account managers, no subcontractors, no platform licence quietly compounding in the
        background. A small team who build the software, own the tools it is built from, and run
        the hardware it sits on.
      </p>

      <div className="services">
        {SERVICES.map((service, i) => (
          <section key={service.title} className="services__item">
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
