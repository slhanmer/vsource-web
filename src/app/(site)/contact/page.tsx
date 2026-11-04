import type { Metadata } from 'next'
import { CONTACT } from '@constants'
import ContactForm from './ContactForm'
import '../styles/pages.scss'
import '../styles/contact.scss'

export const metadata: Metadata = {
  title: 'Contact — Software Developers in Brisbane',
  description:
    'Tell us what you are building and you will get a straight answer about what it would take, and whether we are the right people to build it. Brisbane, Australia.',
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact', title: 'Contact — Software Developers in Brisbane' },
}

export default function ContactPage() {
  return (
    <main className="page">
      <p className="page__eyebrow">Start a conversation</p>
      <h1 className="page__title">Tell us what you are trying to build.</h1>
      <p className="page__lede">
        You will get a straight answer about what it would take, and a realistic view of whether we
        are the right people to build it.
      </p>

      <div className="contact">
        <ContactForm />

        <aside className="contact__aside">
          <h2 className="contact__aside-heading">Or just email us</h2>
          <p className="contact__aside-note">
            The form lands in the same inbox as this address. Either way one of us reads it and
            replies.
          </p>
          <ul className="contact__details">
            <li>
              <span className="contact__label">Email</span>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <span className="contact__label">Phone</span>
              <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </li>
            <li>
              <span className="contact__label">Where</span>
              <span>{CONTACT.location}</span>
            </li>
            <li>
              <span className="contact__label">ABN</span>
              <span>{CONTACT.abn}</span>
            </li>
          </ul>
        </aside>
      </div>
    </main>
  )
}
