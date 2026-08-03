import React from 'react'
import './styles/progressBar.scss'

/**
 * Props for the ProgressBar component.
 *
 * @property progress - Completion percentage (0–100). Values outside this range are clamped.
 *   Displays `'0%'` at zero, `'COMPLETED'` at 100, and `'N%'` otherwise.
 */
interface ProgressBarProps {
  progress: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Normalize: coerce to number, handle NaN, clamp 0–100
  const safeProgress = Math.min(100, Math.max(0, Number(progress) || 0))

  const label = safeProgress === 0 ? '0%' : safeProgress >= 100 ? 'COMPLETED' : `${safeProgress}%`

  return (
    <div className="progress-bar-container">
      <div
        className={safeProgress === 0 ? 'progress-zero' : 'progress-bar'}
        style={{ width: `${safeProgress}%` }}
      >
        {label}
      </div>
    </div>
  )
}
