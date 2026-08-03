import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { debounceInput } from '@utils'
import Fuse from 'fuse.js'
import './styles/dropdown.scss'

/**
 * A single selectable option in the Dropdown list.
 *
 * @property label - Display content; may be a string or a ReactNode for custom rendering
 * @property value - The raw string value passed to `onSelect`
 * @property searchText - Optional plain-text override used for Fuse.js fuzzy matching.
 *   Required when `label` is a ReactNode (so the search index has text to match against).
 * @property optionClassName - Extra class applied to the individual option row
 * @property group - Grouping key (reserved for future grouped-list rendering)
 */
export interface Option {
  label: string | ReactNode
  value: string
  searchText?: string
  optionClassName?: string
  group?: string
}

/**
 * Props for the Dropdown component.
 *
 * @property options - Array of selectable options
 * @property onSelect - Called with the selected option's `value` when an item is chosen
 * @property value - Controlled selected value. Derived to the matching `Option` during render.
 * @property placeholder - Placeholder text shown when nothing is selected (default: `'Select...'`)
 * @property label - Label rendered above the dropdown trigger
 * @property searchable - Show an inline text input for local Fuse.js fuzzy filtering (default: `false`)
 * @property onSearchChange - If provided, disables local filtering and fires this callback instead
 *   (debounced 600 ms, or immediately on Enter/blur). Use for server-side/API-driven search.
 * @property loading - Show a "Searching…" spinner in the menu (used with `onSearchChange`)
 * @property selectedLabel - Override the displayed label for the selected item in the trigger button
 * @property required - Highlights the dropdown when no value is selected
 * @property disabled - Disables all interaction
 * @property width - CSS width of the outer container
 * @property fullWidth - Stretch the container to 100% width
 * @property portalClassname - Extra class applied to the portalled menu `<div>`
 */
interface DropdownProps {
  options: Option[]
  placeholder?: string
  onSelect: (value: string) => void
  className?: string
  portalClassname?: string
  value?: string | number | null
  style?: React.CSSProperties
  id?: string
  label?: string
  selectedLabel?: string
  searchable?: boolean
  onSearchChange?: (query: string) => void // hook for API search
  required?: boolean
  disabled?: boolean
  width?: string
  fullWidth?: boolean
  loading?: boolean
}

/** Portal menu geometry, measured from the trigger. */
interface MenuPosition {
  top: number
  left: number
  width: number
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = 'Select...',
  onSelect,
  className,
  portalClassname,
  value,
  style,
  id,
  label,
  selectedLabel,
  searchable = false,
  onSearchChange,
  required = false,
  disabled = false,
  width,
  fullWidth = false,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // Menu geometry lives in state rather than being written onto the node, so the
  // portal renders positioned on its first paint and nothing reads a ref during render.
  const [position, setPosition] = useState<MenuPosition | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  /**
   * Selected option is a pure function of `value` + `options` — derived during
   * render, not mirrored into state. `undefined` value means uncontrolled, in
   * which case nothing is ever selected via prop.
   */
  const selected = useMemo(() => {
    if (value === undefined) return null
    return options.find((opt) => String(opt.value) === String(value)) ?? null
  }, [value, options])

  const updatePosition = useCallback(() => {
    const trigger = dropdownRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const menuHeight = menuRef.current?.offsetHeight ?? 0
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    // Flip upward when there isn't room below and there is above.
    const flipUp = menuHeight > 0 && spaceBelow < menuHeight && spaceAbove > spaceBelow

    setPosition({
      top: flipUp ? rect.top - menuHeight - 8 : rect.bottom,
      left: rect.left,
      width: rect.width,
    })
  }, [])

  // Measure on open, then track scroll/resize. useLayoutEffect so the first
  // paint of the portal is already in the right place.
  useLayoutEffect(() => {
    updatePosition()

    window.addEventListener('scroll', updatePosition, true) // capture — catches inner scroll containers
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, updatePosition])

  const isRequired = required && !value

  const fuse = useMemo(
    () =>
      new Fuse(
        options.map((opt) => ({
          ...opt,
          searchText: opt.searchText ?? (typeof opt.label === 'string' ? opt.label : ''),
        })),
        {
          keys: ['searchText'],
          threshold: 0.5,
          ignoreLocation: true,
          minMatchCharLength: 2,
        }
      ),
    [options]
  )

  const debouncedSearch = useMemo(
    () =>
      debounceInput((val: string) => {
        if (onSearchChange) {
          // Api search
          onSearchChange(val.toLowerCase())
        }
      }, 600),
    [onSearchChange]
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    if (onSearchChange) debouncedSearch(val)
  }

  const handleBlur = () => {
    if (onSearchChange && search.trim()) {
      debouncedSearch.cancel?.()
      onSearchChange(search.toLowerCase())
    }
  }

  const filteredOptions = useMemo(() => {
    // Api search — parent owns filtering
    if (onSearchChange) {
      return options
    }
    // local search
    return search ? fuse.search(search.toLowerCase()).map((res) => res.item) : options
  }, [search, options, fuse, onSearchChange])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const clickedInsideToggle = dropdownRef.current?.contains(target)
      const clickedInsideMenu = menuRef.current?.contains(target)

      if (!clickedInsideToggle && !clickedInsideMenu) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: Option) => {
    onSelect(option.value)
    setIsOpen(false)
    setSearch('')
  }

  const isAsync = !!onSearchChange
  const showSearching = isAsync && loading
  const showNoResults = !loading && filteredOptions.length === 0 && search.trim().length > 0

  return (
    <div className={`dropdown-container ${fullWidth ? 'full-width' : ''}`} style={{ width: width }}>
      {label && (
        <label
          className={`dropdown-label ${disabled ? 'disabled' : ''} ${isRequired ? 'required' : ''}`}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div
        id={id}
        ref={dropdownRef}
        className={`dropdown ${className || ''} ${disabled ? 'disabled' : ''} ${isRequired ? 'required' : ''}`}
        aria-required={isRequired}
        aria-disabled={disabled}
        style={style}
      >
        {searchable ? (
          <div
            className={`dropdown-input-wrapper ${disabled ? 'disabled' : ''} ${isRequired ? 'required' : ''}`}
          >
            <input
              type="text"
              className="dropdown-search-input"
              placeholder={
                isFocused
                  ? ''
                  : (selected?.searchText ??
                    (typeof selected?.label === 'string' ? selected.label : placeholder))
              }
              value={search}
              onChange={handleSearch}
              onFocus={() => {
                if (!disabled) {
                  setIsFocused(true)
                  setIsOpen(true)
                }
              }}
              onBlur={() => {
                setIsFocused(false)
                handleBlur()
              }}
              disabled={disabled}
            />

            {/* Raw button, not <Button>: the arrow toggles open/close and must fire
              instantly — Button's 500ms click-lock would make it feel broken. */}
            <button
              type="button"
              className="dropdown-arrow-btn"
              aria-label={isOpen ? 'Close options' : 'Open options'}
              onClick={() => setIsOpen(!isOpen)}
              disabled={disabled}
            >
              <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`dropdown-toggle ${!selected ? 'is-placeholder' : ''} ${disabled ? 'disabled' : ''} ${isRequired ? 'required' : ''}`}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <span className="dropdown-text">
              {selectedLabel ?? (selected ? selected.label : placeholder)}
            </span>
            <FontAwesomeIcon
              className={`dropdown-arrow ${disabled ? 'disabled' : ''} ${isRequired ? 'required' : ''}`}
              icon={isOpen ? faChevronUp : faChevronDown}
            />
          </button>
        )}

        {isOpen &&
          createPortal(
            <div
              ref={menuRef}
              className={`dropdown-menu portal ${portalClassname ? portalClassname : ''}`}
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                top: position?.top ?? 0,
                left: position?.left ?? 0,
                width: position?.width ?? 'auto',
                // Hidden until measured — avoids a one-frame flash at 0,0.
                visibility: position ? 'visible' : 'hidden',
                zIndex: 999999,
              }}
            >
              <div className="dropdown-item-container">
                {showSearching ? (
                  <div className="dropdown-item loading">Searching…</div>
                ) : showNoResults ? (
                  <div className="dropdown-item loading">No results found</div>
                ) : filteredOptions.length > 0 ? (
                  filteredOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className={`dropdown-item ${opt.optionClassName || ''} ${
                        selected?.value === opt.value ? 'selected' : ''
                      }`}
                      onMouseDown={() => !disabled && handleSelect(opt)}
                    >
                      {opt.label}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item disabled">No results</div>
                )}
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  )
}
