import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BUILT, STREAMS } from '@constants'
import ProjectMedia from '@/components/built/ProjectMedia'
import '../../styles/pages.scss'
import '../../styles/built.scss'

/**
 * One project.
 *
 * Statically generated at build time — there are three of these and they change
 * when somebody writes copy, not when somebody loads the page. `dynamicParams`
 * off means a slug that is not in BUILT is a 404 rather than a rendered empty
 * page, which is what you want for a fixed set.
 *
 * Each page names the stream it belongs to and links back to it, so the
 * showpiece feeds the offer rather than sitting beside it.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return BUILT.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = BUILT.find((item) => item.slug === slug)
  if (!project) return {}

  return {
    title: `${project.title} — Built`,
    description: project.lede,
    alternates: { canonical: `/built/${project.slug}` },
    openGraph: { url: `/built/${project.slug}`, title: `${project.title} — Built` },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = BUILT.find((item) => item.slug === slug)
  if (!project) notFound()

  const stream = STREAMS.find((item) => item.id === project.stream)

  return (
    <main className="page built-project">
      <p className="page__eyebrow">
        <Link href="/built" className="built-project__back">
          Built
        </Link>
      </p>
      <h1 className="page__title">{project.title}</h1>
      <p className="page__lede">
        {project.lede}
        {project.placeholder && (
          <span className="home-pending" title="Invented copy — not signed off">
            {' '}
            [placeholder]
          </span>
        )}
      </p>

      <ProjectMedia spec={project.media} priority className="built-project__media" />

      <div className="built-project__grid">
        <div className="built-project__body">
          {project.body.map((para) => (
            <p key={para.slice(0, 40)} className="built-project__para">
              {para}
            </p>
          ))}

          {(stream || project.url) && (
            <p className="built-project__stream">
              {stream && (
                <>
                  This is {stream.name.toLowerCase()} work.{' '}
                  <Link href={stream.href}>See how {stream.name.toLowerCase()} works</Link>
                </>
              )}
              {stream && project.url && ' · '}
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  Visit the site →
                </a>
              )}
            </p>
          )}
        </div>

        <dl className="built-project__facts">
          {project.facts.map((fact) => (
            <div key={fact.label} className="built-project__fact">
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
          <div className="built-project__fact">
            <dt>Client</dt>
            <dd>{project.client}</dd>
          </div>
        </dl>
      </div>

      <p className="built-project__cta">
        <Link href="/contact" className="basic-button">
          Start a conversation
        </Link>
      </p>
    </main>
  )
}
