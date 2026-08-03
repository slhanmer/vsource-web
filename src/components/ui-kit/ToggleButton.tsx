import React from 'react'
import './styles/toggleButton.scss'

/**
 * A single option in the ToggleButton group.
 *
 * @property label - Display text for the option button
 * @property value - Raw value passed to `onChange` when this option is selected
 * @property disabled - Disable only this option within the group
 */
export interface ToggleOption {
  label: string
  value: string
  disabled?: boolean
}

/**
 * Props for the ToggleButton multi-option selector.
 *
 * @property options - Array of options to render as adjacent buttons
 * @property value - Currently selected option value (controlled)
 * @property onChange - Called with the selected option's `value`
 * @property disabled - Disable the entire group (default: `false`)
 *
 * @example
 * <ToggleButton
 *   options={[{ label: 'Day', value: 'day' }, { label: 'Week', value: 'week' }]}
 *   value={view}
 *   onChange={setView}
 * />
 */
interface ToggleButtonProps {
  options: ToggleOption[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  options,
  value,
  onChange,
  disabled,
  className,
  fullWidth = false,
}) => {
  return (
    <div
      className={`toggle-button ${fullWidth ? 'toggle-button--full' : ''} ${disabled ? 'disabled' : ''} ${className || ''}`}
    >
      {options.map((option) => (
        <button
          key={option.value}
          className={`toggle-button-option ${value === option.value ? 'active' : ''} ${option.disabled ? 'disabled' : ''}`}
          onClick={() => !disabled && !option.disabled && onChange(option.value)}
          disabled={disabled || option.disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
