import { useRef, useState } from 'react'
import { IMaskInput, IMask } from 'react-imask'
import DatePicker from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { Popover } from './Popover'
import 'react-datepicker/dist/react-datepicker.css'
import './styles/dateInputMask.scss'

/**
 * Props for the DateInputMask component.
 *
 * @property value - Controlled date string in the mask format (e.g. `'DD-MM-YYYY'`)
 * @property onChange - Called with the masked string whenever the user types or picks a date
 * @property format - Mask format variant:
 *   - `'ddmmyyyy'` — full date `DD-MM-YYYY` with calendar picker toggle (default)
 *   - `'mmyyyy'` — month/year only `MM-YYYY`
 *   - `'yyyy'` — year only `YYYY`
 * @property disabled - Disables the input
 * @property readOnly - Prevents editing; calendar picker is also hidden
 * @property placeholder - Overrides the default format hint placeholder
 */
interface DateInputMaskProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  format?: 'ddmmyyyy' | 'mmyyyy' | 'yyyy'
  disabled: boolean
  readOnly?: boolean
}

const getFieldAtCursor = (cursorPos: number, format: string): 'DD' | 'MM' | 'YYYY' => {
  if (format === 'yyyy') return 'YYYY'
  if (format === 'mmyyyy') return cursorPos <= 2 ? 'MM' : 'YYYY'
  if (cursorPos <= 2) return 'DD'
  if (cursorPos <= 5) return 'MM'
  return 'YYYY'
}

const getFieldRejectMsg = (field: 'DD' | 'MM' | 'YYYY'): string => {
  switch (field) {
    case 'DD':
      return 'Day must be between 01-31'
    case 'MM':
      return 'Month must be between 01-12'
    case 'YYYY':
      return 'Year must be between 1900-2100'
  }
}

export const DateInputMask: React.FC<DateInputMaskProps> = ({
  value = '',
  onChange,
  placeholder,
  className,
  format = 'ddmmyyyy',
  disabled = false,
  readOnly = false,
}) => {
  const [rejectMsg, setRejectMsg] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)
  const rejectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)

  const { blocks, placeholderText } = (() => {
    switch (format) {
      case 'yyyy':
        return {
          blocks: { YYYY: { mask: IMask.MaskedRange, from: 1900, to: 2100 } },
          placeholderText: 'YYYY',
        }
      case 'mmyyyy':
        return {
          blocks: {
            MM: { mask: IMask.MaskedRange, from: 1, to: 12 },
            YYYY: { mask: IMask.MaskedRange, from: 1900, to: 2100 },
          },
          placeholderText: 'MM-YYYY',
        }
      default:
        return {
          blocks: {
            DD: { mask: IMask.MaskedRange, from: 1, to: 31 },
            MM: { mask: IMask.MaskedRange, from: 1, to: 12 },
            YYYY: { mask: IMask.MaskedRange, from: 1900, to: 2100 },
          },
          placeholderText: 'DD-MM-YYYY',
        }
    }
  })()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return
    const before = inputRef.current?.value ?? ''
    const cursorPos = inputRef.current?.selectionStart ?? 0
    setTimeout(() => {
      const after = inputRef.current?.value ?? ''
      if (after === before) {
        if (rejectTimer.current) clearTimeout(rejectTimer.current)
        setRejectMsg(getFieldRejectMsg(getFieldAtCursor(cursorPos, format)))
        rejectTimer.current = setTimeout(() => setRejectMsg(null), 2000)
      }
    }, 0)
  }

  // Parse DD-MM-YYYY string to Date for the picker
  const parsedDate = (): Date | null => {
    if (!value || value.length < 10) return null
    const [d, m, y] = value.split('-')
    const date = new Date(`${y}-${m}-${d}`)
    return isNaN(date.getTime()) ? null : date
  }

  return (
    <div className="date-input-wrapper">
      <div className="date-input-row">
        <IMaskInput
          mask={format === 'yyyy' ? 'YYYY' : format === 'mmyyyy' ? 'MM{-}YYYY' : 'DD{-}MM{-}YYYY'}
          blocks={blocks}
          value={value}
          inputRef={inputRef}
          onKeyDown={handleKeyDown}
          onAccept={(val: string) => {
            setRejectMsg(null)
            onChange(val.replaceAll('/', '-'))
          }}
          placeholder={placeholder || placeholderText}
          className={`input-field ${className}`}
          disabled={disabled}
          inputMode="numeric"
          readOnly={readOnly}
        />
        {format === 'ddmmyyyy' && !disabled && !readOnly && (
          <span ref={iconRef}>
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="date-picker-icon"
              role="button"
              tabIndex={0}
              aria-label="Choose a date"
              onClick={() => setShowPicker((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setShowPicker((prev) => !prev)
                }
              }}
            />
          </span>
        )}
      </div>

      {/* Portalled so the calendar escapes collapsed/overflow-hidden parents. */}
      <Popover
        anchorRef={iconRef}
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        placement="bottom-end"
        className="date-picker-popover"
        aria-label="Choose a date"
      >
        <DatePicker
          selected={parsedDate()}
          onChange={(date: Date | null) => {
            if (!date) return
            const d = String(date.getDate()).padStart(2, '0')
            const m = String(date.getMonth() + 1).padStart(2, '0')
            const y = date.getFullYear()
            onChange(`${d}-${m}-${y}`)
            setShowPicker(false)
          }}
          inline
          minDate={new Date('1900-01-01')}
          maxDate={new Date(new Date().getFullYear() + 10, 11, 31)}
        />
      </Popover>
      <span className={`input-hint ${rejectMsg ? 'error' : ''}`}>
        {rejectMsg ?? `Format: ${placeholderText}`}
      </span>
    </div>
  )
}
