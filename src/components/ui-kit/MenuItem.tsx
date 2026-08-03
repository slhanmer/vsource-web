import React from 'react'
import './styles/menuItem.scss'

/**
 * A single row inside a menu (Popover, Dropdown, etc).
 *
 * Not a Button — a menu row: left-aligned, full-width, hover-fill,
 * no debounce. Compose these as the children of a Popover.
 *
 * @property label - Row text
 * @property onSelect - Fired on click/Enter/Space
 * @property icon - Optional leading icon element
 * @property tone - 'default' | 'danger' (danger = destructive, red)
 * @property disabled - Disable this row
 */
interface MenuItemProps {
  label: React.ReactNode
  onSelect: () => void
  icon?: React.ReactNode
  tone?: 'default' | 'danger'
  disabled?: boolean
  className?: string
}

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  onSelect,
  icon,
  tone = 'default',
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      className={`context-menu-item context-menu-item--${tone} ${className}`.trim()}
      onClick={(e) => {
        e.stopPropagation()
        if (!disabled) onSelect()
      }}
    >
      {icon && <span className="context-menu-item__icon">{icon}</span>}
      <span className="context-menu-item__label">{label}</span>
    </button>
  )
}
