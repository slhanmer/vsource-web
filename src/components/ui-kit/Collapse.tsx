import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import './styles/collapse.scss'

/**
 * Props for the Collapse component.
 *
 * @property title - Toggle header content (string or ReactNode)
 * @property children - Collapsible body content
 * @property size - Panel width variant: `'small'` or `'full'` (default: `'full'`)
 * @property startOpen - Open the panel on first render (default: `false`). Ignored in controlled mode.
 * @property disabled - Prevent toggling; greys out the header
 * @property error - Apply error styling to the header and border
 * @property isOpen - Controlled open state. When provided, the component is fully controlled.
 * @property onToggle - Called when the header is clicked in controlled mode
 */
interface CollapseProps {
  title: string | ReactNode
  children: React.ReactNode
  size?: 'small' | 'full'
  startOpen?: boolean
  className?: string
  disabled?: boolean
  error?: boolean
  isOpen?: boolean
  onToggle?: () => void
}

/**
 * Imperative handle exposed via `forwardRef`.
 *
 * @property recalcHeight - Recalculate and re-apply the panel's height when the content changes
 *   size while open (e.g. after a child component adds or removes rows).
 *
 * @example
 * const collapseRef = useRef<CollapseRef>(null)
 * collapseRef.current?.recalcHeight()
 */
export interface CollapseRef {
  recalcHeight: () => void
}

const Collapse = forwardRef<CollapseRef, CollapseProps>(
  (
    {
      title,
      children,
      size = 'full',
      startOpen = false,
      className,
      disabled = false,
      error = false,
      isOpen,
      onToggle,
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = useState(startOpen ? startOpen : false)
    const [contentVisible, setContentVisible] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const innerRef = useRef<HTMLDivElement>(null)
    const transitionMs = 80

    const isControlled = typeof isOpen === 'boolean'
    const open = isControlled ? isOpen : internalOpen

    const toggle = () => {
      if (disabled) return

      if (isControlled) {
        onToggle?.()
      } else {
        setInternalOpen((prev) => !prev)
      }
    }

    useEffect(() => {
      if (!isControlled) {
        setInternalOpen(startOpen)
      }
    }, [startOpen, isControlled])

    useEffect(() => {
      const wrapper = wrapperRef.current
      const inner = innerRef.current
      if (!wrapper || !inner) return

      if (open) {
        // Set fixed height to allow transition
        const fullHeight = inner.scrollHeight
        wrapper.style.height = `${fullHeight}px`
        const timer = setTimeout(() => {
          wrapper.style.height = 'auto'
          setContentVisible(true)
        }, transitionMs)
        return () => clearTimeout(timer)
      } else {
        // Explicitly measure before collapsing
        const fullHeight = inner.scrollHeight
        wrapper.style.height = `${fullHeight}px`
        setContentVisible(false)

        // Force reflow to register height before collapsing
        wrapper.getBoundingClientRect()

        // Animate to zero
        requestAnimationFrame(() => {
          wrapper.style.height = '0px'
        })
      }
    }, [open])

    useImperativeHandle(ref, () => ({
      recalcHeight() {
        const wrapper = wrapperRef.current
        const inner = innerRef.current
        if (wrapper && inner && open) {
          const fullHeight = inner.scrollHeight
          wrapper.style.height = `${fullHeight}px`
        }
      },
    }))

    return (
      <div
        className={clsx('collapse', size, className, {
          disabled,
          open,
          error,
        })}
      >
        <button
          className={clsx('collapse-toggle', { size, disabled, error })}
          onClick={toggle}
          type="button"
          disabled={disabled}
        >
          <span className={clsx('title', { size, disabled, error })}>{title}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={clsx('icon', { size, disabled, error })}
          />
        </button>

        <div
          ref={wrapperRef}
          className={`collapse-content ${open ? 'show' : ''} ${error ? 'error' : ''}`}
          style={{ height: '0px' }}
        >
          <div className="horizontal-divider" />
          <div ref={innerRef} className={`collapse-inner ${contentVisible ? 'visible' : 'hidden'}`}>
            {children}
          </div>
        </div>
      </div>
    )
  }
)

Collapse.displayName = 'Collapse'

export default Collapse
