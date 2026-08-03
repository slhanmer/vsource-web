'use client'

import { useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import Button from './Button'
import Input from './Input'
import { Magnifier } from './Magnifier'
import { PageLoader } from './PageLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faMinus,
  faMagnifyingGlass,
  faPrint,
  faDownload,
} from '@fortawesome/free-solid-svg-icons'

import './styles/pdfViewer.scss'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const MIN_SCALE = 0.5
const MAX_SCALE = 2.2
const SCALE_STEP = 0.2

/**
 * Props for the PDFViewer component.
 *
 * @property file - URL or data-URL of the PDF to render using pdf.js
 * @property controls - Additional control elements rendered in the toolbar alongside the built-in buttons
 * @property showMagnify - Show the magnifier toggle button; hold `m` or click to activate the loupe
 * @property showPrint - Show a print button (opens the PDF in a hidden iframe for printing)
 * @property showDownload - Show a download button
 * @property downloadFileName - Filename used when downloading (default: `'unknown.pdf'`)
 */
type PDFViewerProps = {
  file: string
  controls?: React.ReactNode
  showMagnify?: boolean
  showPrint?: boolean
  showDownload?: boolean
  downloadFileName?: string
}

export const PDFViewer = ({
  file,
  controls,
  showMagnify,
  showPrint,
  showDownload,
  downloadFileName,
}: PDFViewerProps) => {
  const [pages, setPages] = useState<HTMLCanvasElement[]>([])
  const [scale, setScale] = useState(1.2)
  const [pageInput, setPageInput] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [magnifierEnabled, setMagnifierEnabled] = useState(false)
  const [isHoldingKey, setIsHoldingKey] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [activeCanvas, setActiveCanvas] = useState<HTMLCanvasElement | null>(null)
  const [activePage, setActivePage] = useState<number | null>(null)
  const [lastPage, setLastPage] = useState(currentPage)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadPdf = async () => {
      setLoading(true)
      const pdf = await pdfjsLib.getDocument({ url: file }).promise
      const renderedPages: HTMLCanvasElement[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: context, viewport, canvas }).promise
        renderedPages.push(canvas)
      }

      // Guard: a fast zoom / file swap can start a second load before this one
      // finishes — don't paint stale pages from a superseded run.
      if (cancelled) return

      setPages(renderedPages)
      setLoading(false)
    }

    loadPdf()

    return () => {
      cancelled = true
    }
  }, [file, scale])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'm') setIsHoldingKey(true)
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === 'm') setIsHoldingKey(false)
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)

    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  const isMagnifierActive = magnifierEnabled || isHoldingKey

  const jumpToPage = (page: number) => {
    const el = document.getElementById(`page-${page}`)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  if (currentPage !== lastPage) {
    setLastPage(currentPage)
    setPageInput(currentPage)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const page = Number(entry.target.getAttribute('data-page'))
            setCurrentPage(page)
          }
        })
      },
      {
        root: document.querySelector('.pdf-scroll-container'),
        threshold: 0.5,
      }
    )

    const elements = document.querySelectorAll('.pdf-page')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [pages])

  const commitPageInput = () => {
    let page = Number(pageInput)

    if (isNaN(page)) page = currentPage

    const safePage = Math.max(1, Math.min(pages.length, page))

    setPageInput(safePage)
    setCurrentPage(safePage)
    jumpToPage(safePage)
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-controls">
        <div className="pdf-controls__groups">
          <div className="groups__standard">
            <div className="flex-container column">
              <div className="button-set">
                <Button
                  aria-label="Zoom in"
                  variant="icon-only"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  handleClick={() => setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP))}
                  disabled={scale >= MAX_SCALE}
                />
                <span>{Math.round(scale * 100)}%</span>
                <Button
                  aria-label="Zoom out"
                  variant="icon-only"
                  icon={<FontAwesomeIcon icon={faMinus} />}
                  handleClick={() => setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP))}
                  disabled={scale <= MIN_SCALE}
                />
              </div>
            </div>
            <div className="flex-container column">
              <div className="button-set">
                <Button
                  aria-label="Next page"
                  variant="icon-only"
                  icon={<FontAwesomeIcon icon={faPlus} />}
                  handleClick={() => {
                    const next = Math.min(pages.length, currentPage + 1)
                    setCurrentPage(next)
                    jumpToPage(next)
                  }}
                  disabled={currentPage >= pages.length}
                />
                <Input
                  label="Current page number"
                  hideLabel
                  name="pageInput"
                  type="number"
                  value={String(pageInput)}
                  onChange={(e) => setPageInput(Number(e.target.value))}
                  width="40px"
                  onBlur={commitPageInput}
                  handleKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      commitPageInput()
                    }
                  }}
                />
                <span> / {pages.length}</span>
                <Button
                  aria-label="Previous page"
                  variant="icon-only"
                  icon={<FontAwesomeIcon icon={faMinus} />}
                  handleClick={() => {
                    const prev = Math.max(1, currentPage - 1)
                    setCurrentPage(prev)
                    jumpToPage(prev)
                  }}
                  disabled={currentPage <= 1}
                />
              </div>
            </div>
          </div>
          <div className="groups__standard">
            {showMagnify && (
              <Button
                aria-label="Toggle magnifier"
                variant="icon-only"
                icon={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                className="magnify-toggle"
                handleClick={() => setMagnifierEnabled((v) => !v)}
              />
            )}
            {showPrint && (
              <Button
                aria-label="Print"
                variant="icon-only"
                icon={<FontAwesomeIcon icon={faPrint} />}
                className="print"
                handleClick={() => {
                  const iframe = document.createElement('iframe')
                  iframe.style.display = 'none'
                  iframe.src = file
                  document.body.appendChild(iframe)
                  iframe.contentWindow?.focus()
                  iframe.contentWindow?.print()
                }}
              />
            )}
            {showDownload && (
              <Button
                aria-label="Download"
                variant="icon-only"
                icon={<FontAwesomeIcon icon={faDownload} />}
                className="download"
                handleClick={() => {
                  const a = document.createElement('a')
                  a.href = file
                  a.download = downloadFileName ?? 'unknown.pdf'
                  a.click()
                }}
              />
            )}
          </div>
        </div>

        {controls && <div className="pdf-controls__extra">{controls}</div>}
      </div>
      <div className="pdf-scroll-container">
        {loading && pages.length === 0 ? (
          <div className="pdf-loading" role="status" aria-live="polite">
            <PageLoader loadingText="Loading your PDF" />
          </div>
        ) : (
          pages.map((canvas, i) => (
            <div key={`${i}-${scale}`} id={`page-${i + 1}`} data-page={i + 1} className="pdf-page">
              <canvas
                className={magnifierEnabled ? 'magnify' : ''}
                ref={(el) => {
                  if (!el) return

                  const ctx = el.getContext('2d')
                  el.width = canvas.width
                  el.height = canvas.height
                  ctx?.drawImage(canvas, 0, 0)
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()

                  const scaleX = e.currentTarget.width / rect.width
                  const scaleY = e.currentTarget.height / rect.height

                  setMouse({
                    x: (e.clientX - rect.left) * scaleX,
                    y: (e.clientY - rect.top) * scaleY,
                  })

                  setActiveCanvas(e.currentTarget)
                  setActivePage(i)
                }}
                onMouseLeave={() => {
                  setActivePage(null)
                }}
              />

              {isMagnifierActive && activePage === i && activeCanvas && (
                <Magnifier x={mouse.x} y={mouse.y} canvas={activeCanvas} size={300} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
