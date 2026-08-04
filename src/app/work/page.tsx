import type { Metadata } from 'next'
import Link from 'next/link'
import { CASE_STUDY } from '@constants'
import '../styles/pages.scss'
import '../styles/work.scss'

export const metadata: Metadata = {
  title: 'Work — Medical Device Software, Built in Australia',
  description:
    'Building a TGA-regulated Class A medical device portal to IEC 62304 — front end, API, design system and hosting, in house, from Brisbane.',
  alternates: { canonical: '/work' },
  openGraph: { url: '/work', title: 'Work — Medical Device Software, Built in Australia' },
}

export default function WorkPage() {
  return (
    <main className="page">
      <p className="page__eyebrow">{CASE_STUDY.eyebrow}</p>
      <h1 className="page__title">{CASE_STUDY.title}</h1>
      <p className="page__lede">{CASE_STUDY.lede}</p>

      <div className="work">
        {CASE_STUDY.sections.map((section, i) => (
          <section key={section.heading} className="work__section">
            <p className="work__index" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </p>
            <h2 className="work__heading">{section.heading}</h2>
            <div className="work__content">
              {section.body.map((para) => (
                <p key={para.slice(0, 40)} className="work__para">
                  {para}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside className="work__status">
        <p className="work__status-label">Status</p>
        <p className="work__status-value">{CASE_STUDY.status}</p>
        <Link href="/contact" className="basic-button work__status-cta">
          Start a conversation
        </Link>
      </aside>
    </main>
  )
}
