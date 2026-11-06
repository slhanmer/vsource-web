import type { Metadata, ResolvingMetadata } from 'next'
import { withShareCard } from '../../shareCard'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getProjects, getStream } from '@/data'
import ProjectMedia from '@/components/built/ProjectMedia'
import '../../styles/pages.scss'
import '../../styles/built.scss'

/**
 * One project.
 *
 * Statically generated from Payload at build time, and again after a save in
 * the admin (src/data/, the `content` tag).
 *
 * `dynamicParams` is ON, so a project published after the deploy works at its
 * URL without another deploy: the first request renders it and caches it. A
 * slug that is not a published project still 404s, because the page calls
 * notFound() — drafts included, since src/data/ never reads them.
 *
 * Each page names the stream it belongs to and links back to it, so the
 * showpiece feeds the offer rather than sitting beside it.
 */
export const dynamicParams = true

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }))
}

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ slug: string }>
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return {}

  return withShareCard(
    {
      title: `${project.title} — Built`,
      description: project.lede,
      alternates: { canonical: `/built/${project.slug}` },
      openGraph: { url: `/built/${project.slug}`, title: `${project.title} — Built` },
    },
    parent
  )
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const stream = await getStream(project.stream)

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

      <ProjectMedia
        spec={project.media}
        preload
        sizes="(max-width: 1366px) 94vw, 1275px"
        className="built-project__media"
      />

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
                  {/*
                    A link that moves someone to a new tab without saying so is
                    disorienting if you cannot see it happen (WCAG G201).
                    `.visually-hidden` is in global.scss, which every page gets
                    — not the copy in home.scss, which only the home page
                    imports.
                  */}
                  <span className="visually-hidden"> (opens in a new tab)</span>
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

      {/*
        Several live sites under one project. Each card is one link, to the
        live site, in the same tab — these are the work, so going to them is
        the point. Nothing renders when a project has none.
      */}
      {project.sites && project.sites.length > 0 && (
        <section className="built-sites" aria-labelledby="built-sites-heading">
          <h2 id="built-sites-heading" className="built-sites__heading">
            The sites
          </h2>
          <ul className="built-sites__list">
            {project.sites.map((site) => (
              <li key={site.url} className="built-sites__item">
                <a href={site.url} rel="noopener" className="built-site">
                  <span className="built-site__shot">
                    <Image
                      src={site.screenshot.src}
                      alt={site.screenshot.alt}
                      width={site.screenshot.width}
                      height={site.screenshot.height}
                      sizes="(max-width: 559px) 92vw, (max-width: 1099px) 47vw, 235px"
                      className="built-site__img"
                    />
                  </span>
                  <span className="built-site__name">{site.name}</span>
                  <span className="built-site__where">{site.where}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="built-project__cta">
        <Link href="/contact" className="basic-button">
          Start a conversation
        </Link>
      </p>
    </main>
  )
}
