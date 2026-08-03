import type { Metadata } from 'next'
import { CONTACT } from '@constants'
import ContactForm from './ContactForm'
import '../styles/pages.scss'
import '../styles/contact.scss'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Tell us what you are building and we will tell you honestly whether we are the right fit.',
}

export default function ContactPage() {
  return (
    <main className="page">
      <p className="page__eyebrow">Start a conversation</p>
      <h1 className="page__title">Tell us what you are trying to build.</h1>
      <p className="page__lede">
        We will tell you honestly whether we are the right people for it. If we are not, we will
        usually know who is.
      </p>

      <div className="contact">
        <ContactForm />

        <aside className="contact__aside">
          <h2 className="contact__aside-heading">Or just email us</h2>
          <p className="contact__aside-note">
            No form, no tracking, no autoresponder. A person reads it.
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
