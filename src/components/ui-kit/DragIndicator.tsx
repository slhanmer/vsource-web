import React from 'react'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './styles/dragIndicator.scss'

/**
 * Props for the DragIndicator chevron affordance.
 *
 * @property first - Disable the up chevron when this is the first item in its list (default: `false`)
 * @property last - Disable the down chevron when this is the last item in its list (default: `false`)
 */
interface DragIndicatorProps {
  first?: boolean
  last?: boolean
}

export const DragIndicator: React.FC<DragIndicatorProps> = ({ first = false, last = false }) => {
  return (
    <span className="drag-indicator-container">
      <FontAwesomeIcon icon={faChevronUp} className={`chevron ${first ? 'disabled' : ''}`} />
      <FontAwesomeIcon icon={faChevronDown} className={`chevron ${last ? 'disabled' : ''}`} />
    </span>
  )
}
