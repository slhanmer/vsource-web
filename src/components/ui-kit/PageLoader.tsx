import React from 'react'
import './styles/pageLoader.scss'

/**
 * Props for the PageLoader full-page loading screen.
 *
 * @property loadingText - Text displayed below the scan-sweep animation (default: `'Loading'`)
 */
interface PageLoaderProps {
  loadingText?: string
  size?: 'page' | 'inline'
}

// Fixed 5×5 point grid — the point-cloud texture the sweep travels over.
const DOT_ROWS = [13, 37, 61, 85, 109]
const DOT_COLS = [16, 48, 80, 112, 144]

export const PageLoader: React.FC<PageLoaderProps> = ({
  loadingText = 'Loading',
  size = 'page',
}) => {
  return (
    <div className={`page-loader-container page-loader-container--${size}`}>
      <svg
        className="page-loader-scan"
        viewBox="0 0 160 118"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g className="page-loader-grid">
          {DOT_ROWS.map((cy) =>
            DOT_COLS.map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.5" />)
          )}
        </g>
        <g className="page-loader-sweep">
          <rect className="page-loader-sweep-line" x="0" y="0" width="160" height="2.5" />
          <rect className="page-loader-sweep-trail" x="0" y="2.5" width="160" height="15" />
        </g>
      </svg>
      <h2 className="page-loader-text">{loadingText}</h2>
    </div>
  )
}
