'use client'

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Button from './Button'
import { usePreventScroll } from '@hooks'

import './styles/modal.scss'

/**
 * Props for the Modal component.
 *
 * @property isOpen - Controls visibility. The modal mounts on first open and unmounts after the close animation.
 * @property onClose - Called when the close button, overlay click, or Escape key fires
 * @property children - Modal body content
 * @property title - Heading text rendered in the modal header
 * @property closeOnOverlay - Close when clicking the backdrop (default: `true`). Also controls Escape key.
 * @property fullScreen - Expand the modal to fill the viewport (default: `false`)
 * @property width - Max width of the modal panel (default: `'600px'`)
 * @property textAlignment - Text alignment within the modal body (default: `'left'`)
 * @property showCloseButton - Render the ✕ close button in the header (default: `true`)
 */

type ModalBase = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode | string
  closeOnOverlay?: boolean
  fullScreen?: boolean
  className?: string
  textAlignment?: 'left' | 'center' | 'right'
  showCloseButton?: boolean
  width?: string
}

type ModalProps = ModalBase &
  (
    | { title: string; 'aria-label'?: string } // visible heading
    | { title?: undefined; 'aria-label': string } // no heading → aria-label required
  )

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  'aria-label': ariaLabel,
  closeOnOverlay = false,
  fullScreen = false,
  className,
  textAlignment = 'left',
  showCloseButton = true,
  width = '600px',
}) => {
  // Stays mounted through the close animation. isOpen drives open; the overlay's
  // own transitionend drives unmount.
  const [closing, setClosing] = useState(false)
  const visible = isOpen || closing

  usePreventScroll(visible)

  // Entering close: arm the closing flag so the portal survives the animation.
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen)
    setClosing(!isOpen)
  }

  // Escape key handler
  useEffect(() => {
    if (!closeOnOverlay) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [closeOnOverlay, isOpen, onClose])

  // If not mounted at all, don’t render
  if (!visible) return null

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    // Only the overlay's own transition ends the close — child transitions
    // bubble up here too and would unmount mid-animation.
    if (e.target !== e.currentTarget) return
    if (!isOpen) setClosing(false)
  }

  return ReactDOM.createPortal(
    <div
      className={`modal-overlay ${isOpen ? 'open' : 'closing'}`}
      onClick={closeOnOverlay ? onClose : undefined}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        className={`modal-content ${className || ''} ${fullScreen ? 'fullscreen' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-label={!title ? ariaLabel : undefined}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: width || '600px' }}
      >
        <div className={`modal-header-container ${!showCloseButton ? 'no-close-button' : ''}`}>
          {title && (
            <div className="modal-header">
              <h2 id="modal-title">{title}</h2>
            </div>
          )}
          {showCloseButton && (
            <Button
              label=""
              aria-label="Close dialog"
              variant="close"
              handleClick={onClose}
              className="modal-closer"
            />
          )}
        </div>
        <div className="modal-body" style={{ textAlign: textAlignment }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
