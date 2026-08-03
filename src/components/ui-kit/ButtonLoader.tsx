import React from 'react'
import './styles/buttonLoader.scss'

/**
 * Props for the ButtonLoader inline animated dots indicator.
 *
 * @property size - Visual size hint in px (currently not applied to DOM; reserved for future use)
 */

export const ButtonLoader: React.FC = () => {
  return (
    <span className="button-loader" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  )
}
