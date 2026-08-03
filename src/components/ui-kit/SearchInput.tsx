import React, { forwardRef } from 'react'
import Input from './Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

/**
 * Props for the SearchInput component.
 *
 * @property name - Field name passed to the underlying `Input`
 * @property value - Controlled input value
 * @property onChange - Standard input change handler
 * @property onSearch - Called when the search icon is clicked (for triggering an explicit search)
 * @property onClear - Called when the clear (×) button is clicked. If omitted, a synthetic
 *                     empty-value change event is dispatched through `onChange` instead.
 * @property placeholder - Input placeholder text (default: `'Search...'`)
 * @property disabled - Disables the input (default: `false`)
 * @property confirmed - When `true`, replaces the search icon with a green check mark
 * @property required - Marks the field as required (default: `false`)
 * @property loading - Show a spinner instead of the search icon while a search is in progress
 * @property clearable - Show a clear (×) button when the field has a value (default: `true`)
 * @property label - Optional visible label above the input
 */
interface SearchInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch?: () => void
  onClear?: () => void
  placeholder?: string
  disabled?: boolean
  confirmed?: boolean
  required?: boolean
  loading?: boolean
  clearable?: boolean
  name: string
  className?: string
  label?: string
  width?: string
  fullWidth?: boolean
  autoFocus?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onChange,
      onSearch,
      onClear,
      placeholder = 'Search...',
      disabled = false,
      confirmed = false,
      required = false,
      loading = false,
      clearable = true,
      name,
      className,
      label,
      width,
      fullWidth = false,
      autoFocus = false,
    },
    ref
  ) => {
    const hasValue = value.length > 0
    const showClear = clearable && hasValue && !loading && !disabled

    const handleClear = () => {
      if (onClear) {
        onClear()
      } else {
        // Fall back to firing a synthetic empty change so controlled parents reset.
        onChange({
          target: { name, value: '' },
        } as React.ChangeEvent<HTMLInputElement>)
      }
    }

    const rightIcon = loading ? (
      <span className="spinner" />
    ) : (
      // Both icons are clickable, so they're real buttons — an SVG with onClick
      // is focusable but never fires on Enter/Space, and reads as an image.
      // Icons stay aria-hidden; the button carries the accessible name.
      <span className="search-input__icons">
        {showClear && (
          <button
            type="button"
            className="search-input__clear"
            aria-label="Clear search"
            onClick={handleClear}
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          className="search-input__search"
          aria-label="Search"
          onClick={onSearch}
          disabled={disabled || !onSearch}
        >
          <FontAwesomeIcon
            icon={confirmed ? faCheck : faSearch}
            className="search-icon"
            style={{ color: confirmed ? '#1c7245' : '' }}
            aria-hidden="true"
          />
        </button>
      </span>
    )

    return (
      <Input
        ref={ref}
        name={name}
        label={label}
        hideLabel={label ? false : true}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={className}
        width={width}
        fullWidth={fullWidth}
        rightIcon={rightIcon}
        autoFocus={autoFocus}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'
