import { forwardRef, ReactNode, useEffect, useRef, useState } from 'react'
import { validateValue, ddmmyyyyToSql, sqlToDdmmyyyy, sanitiseText } from '@utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faPalette } from '@fortawesome/free-solid-svg-icons'
import { DateInputMask } from './DateInputMask'
import { ColourPicker } from './ColourPicker'
import { EditorToolbar } from './EditorToolbar'
import type { ValidationOptions, InputType } from '@types'
import { TimeInputMask } from './TimeInputMask'
import Spacer from './Spacer'

import './styles/input.scss'

/**
 * Props for the Input component.
 *
 * @property name - Field name used for `id`/`name` attributes and validation wiring
 * @property type - Input type; controls rendering, validation, and autocomplete.
 *   Special types handled internally:
 *   - `'date'` — renders `DateInputMask` with DD-MM-YYYY format; stores as SQL `YYYY-MM-DD`
 *   - `'colour'` — text field with `#` prefix and an inline `ColourPicker` popover
 *   - `'password'` — shows eye toggle to reveal/hide the value
 *   - `'time'` — native `<input type="time">` with 60-second step
 *   - `'currency'` — text field with `$` prefix
 *   - `'mobile'` / `'phone'` — tel autocomplete
 *   - `'chat'` — multiline textarea (implies `maxLength > 249` behaviour)
 *   - `'code'` — one-time code. Digits only (anything else is stripped, including
 *     on paste), numeric keypad, and `one-time-code` autocomplete so the platform
 *     can offer an SMS code. Deliberately one field rather than a row of boxes,
 *     which keeps paste and autofill working. Pair with `maxLength`.
 * @property value - Controlled value. Currency/colour types manage the prefix automatically.
 * @property onChange - Change handler; always receives the raw value without any prefix
 * @property label - Visible label text (hidden by default — use `hideLabel: false` to show)
 * @property hideLabel - When `true` (default), label is visually hidden but accessible
 * @property subtleLabel - Renders the label in a muted, smaller style
 * @property autoValidate - Run `validateValue` on change/blur and call `onValidate` (default: `true`)
 * @property onValidate - Receives the validation error string, or `null` when valid
 * @property validationOptions - Additional options passed to `validateValue` (e.g. `allowInternational`)
 * @property error - External error message shown below the field. Also triggers error styling.
 * @property required - Marks the field as required; highlights when empty
 * @property maxLength - Character limit. Shows a counter at 80% capacity. Lengths > 249 trigger `<textarea>`.
 * @property withEditor - Attach the `EditorToolbar` above large textareas (for rich-text fields)
 * @property hasLinks - Enable the links toolbar button when `withEditor` is active (default: `true`)
 * @property hasBlanks - Enable the blanks toolbar button (default: `true`)
 * @property hasBulletPoints - Enable the bullet-points toolbar button (default: `true`)
 * @property rightIcon - Node rendered inside the input on the right (e.g. a search icon)
 * @property isPreview - Applies a read-only preview style
 * @property onContentChange - Called with extra height (px) when an inline picker opens/closes,
 *   so parent containers can recalculate their layout
 * @property prefix - Override the default prefix character (currency: `$`, colour: `#`)
 * @property fullWidth - Stretch the wrapper to 100% width
 * @property readOnly - HTML `readonly` attribute
 */
type InputProps = {
  label?: string
  hideLabel?: boolean
  name: string
  type?: InputType
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  reservesError?: boolean
  error?: string
  required?: boolean
  className?: string
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  autoValidate?: boolean
  onValidate?: (error: string | null) => void
  validationOptions?: ValidationOptions
  style?: React.CSSProperties
  autoComplete?: string
  prefix?: string
  maxLength?: number
  width?: string
  fullWidth?: boolean
  height?: string
  margin?: string
  onContentChange?: (extraHeight?: number) => void
  isPreview?: boolean
  subtleLabel?: boolean
  withEditor?: boolean
  rightIcon?: ReactNode
  onBlur?: (e?: any) => void
  readOnly?: boolean
  hasLinks?: boolean
  hasBlanks?: boolean
  hasBulletPoints?: boolean
  autoFocus?: boolean
}

const defaultAutoComplete: Record<string, string> = {
  text: 'on',
  email: 'email',
  password: 'current-password',
  number: 'on',
  mobile: 'tel',
  phone: 'tel',
  currency: 'on',
  colour: 'off',
  date: 'date',
  time: 'time',
  chat: 'off',
  code: 'one-time-code',
}

const defaultPrefixes: Record<string, string> = {
  currency: '$',
  colour: '#',
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hideLabel = false,
      name,
      type = 'text',
      value,
      onChange,
      placeholder,
      disabled = false,
      reservesError = false,
      error,
      required = false,
      className = '',
      handleKeyDown,
      autoValidate = true,
      onValidate,
      validationOptions,
      style,
      autoComplete,
      prefix,
      maxLength,
      width,
      fullWidth = false,
      height,
      onContentChange,
      isPreview = false,
      subtleLabel = false,
      withEditor = false,
      rightIcon,
      onBlur,
      readOnly = false,
      hasLinks = true,
      hasBlanks = true,
      hasBulletPoints = true,
      autoFocus = false,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showColourPicker, setShowColourPicker] = useState(false)
    const [pickerAbove, setPickerAbove] = useState(false)

    const wrapperRef = useRef<HTMLDivElement>(null)

    // --- keep password toggle ---
    useEffect(() => setShowPassword(false), [])

    const runValidation = () => {
      if (!autoValidate) return
      const err = validateValue(type as any, value ?? '', {
        required,
        ...(validationOptions || {}),
      })
      onValidate?.(err)
    }

    const raw = value ?? ''
    const val = typeof raw === 'string' ? raw.trim() : String(raw).trim()

    const isEmpty = required && val === ''
    const isInvalid = Boolean(error)
    const stateClass = isEmpty || isInvalid ? 'required' : ''

    const resolvedAutoComplete = autoComplete ?? defaultAutoComplete[type] ?? 'on'
    const resolvedPrefix = prefix ?? defaultPrefixes[type] ?? ''

    const hasPrefix = type === 'currency' || type === 'colour'
    const isCode = type === 'code'
    const displayValue =
      hasPrefix && resolvedPrefix
        ? value
          ? String(value).startsWith(resolvedPrefix)
            ? value
            : `${resolvedPrefix}${value}`
          : '' // <-- allow empty string so placeholder shows
        : (value ?? '')

    const max = typeof maxLength === 'number' ? maxLength : parseInt(maxLength || '0', 10)
    const textareaSize = max >= 1000 ? 'size-large' : max >= 500 ? 'size-medium' : 'size-small'
    const largeInput = type === 'text' && max > 249
    const showCounter =
      typeof maxLength === 'number' &&
      maxLength > 0 &&
      (type === 'text' || largeInput) &&
      typeof value === 'string' &&
      value.length >= maxLength * 0.8

    /**
     * Blur, not change: `normalize('NFC')` mid-keystroke disrupts IME composition
     * (dead keys, CJK), and rewriting a controlled value on change jumps the caret
     * on paste. Blur avoids both and is still ahead of submit.
     *
     * `password` is exempt — NFC changes the bytes hashed at registration and would
     * break existing logins. `code` already strips to digits on change.
     */
    const handleBlur = (mode: 'multiline' | 'single-line') => () => {
      if (readOnly || disabled) {
        onBlur?.()
        return
      }
      const allowNewlines = mode === 'multiline'
      const current = value ?? ''
      const cleaned =
        type === 'password' || isCode
          ? current
          : sanitiseText(current, { allowNewlines, maxLength: max > 0 ? max : undefined })

      if (cleaned !== current) {
        onChange?.({
          target: { name, value: cleaned },
        } as React.ChangeEvent<HTMLInputElement>)
      }

      if (autoValidate) {
        const err = validateValue(type as any, cleaned, {
          required,
          ...(validationOptions || {}),
        })
        onValidate?.(err)
      }

      onBlur?.()
    }

    // `datetime` carries both halves in one value; split for the two masks and recombine on either one changing.
    const [datetimeDate, datetimeTime] = (value ?? '').split('T')
    const emitDatetime = (d?: string, t?: string) => {
      const next = d ? (t ? `${d}T${t}` : d) : ''
      onChange?.({ target: { name, value: next } } as React.ChangeEvent<HTMLInputElement>)
      if (autoValidate && d) {
        const err = validateValue('datetime' as any, next, {
          required,
          ...(validationOptions || {}),
        })
        onValidate?.(err)
      }
    }

    useEffect(() => {
      if (showColourPicker && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const pickerHeight = 180
        setPickerAbove(spaceBelow < pickerHeight)
      }
    }, [showColourPicker])

    useEffect(() => {
      if (!showColourPicker) return

      const handleClickOutside = (e: MouseEvent) => {
        if (!wrapperRef.current) return
        if (!wrapperRef.current.contains(e.target as Node)) {
          setShowColourPicker(false)
          onContentChange?.(0)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showColourPicker, onContentChange])

    return (
      <div
        ref={wrapperRef}
        className={`input-wrapper ${error ? 'has-error' : ''} ${reservesError ? 'reserves-error' : ''} ${autoValidate ? '' : 'no-validation'} ${fullWidth ? 'full-width' : ''}`}
        style={{ width: fullWidth ? '100%' : width, height }}
      >
        <label
          htmlFor={name}
          className={`${hideLabel ? 'visually-hidden' : 'input-label'} ${subtleLabel ? 'subtle-label' : ''} ${required ? 'required' : ''} ${disabled ? 'disabled' : ''}`}
        >
          {label}
          {required && !hideLabel && (
            <span className="asterix required" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <div
          className={`input-field-row ${hideLabel ? 'no-label' : ''} ${isPreview ? 'preview' : ''} ${withEditor ? 'with-editor' : ''} ${fullWidth ? 'full-width' : ''}`}
        >
          {type === 'colour' ? (
            <div className="colour-input-wrapper">
              <input
                id={name}
                name={name}
                type="text"
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder || '#FFFFFF'}
                className={`input-field colour-input ${className} ${stateClass}`}
                maxLength={7}
                onBlur={runValidation}
                autoFocus={autoFocus}
                ref={ref}
              />

              <FontAwesomeIcon
                icon={faPalette}
                className="hide-show-icon"
                onClick={() => {
                  const next = !showColourPicker
                  setShowColourPicker(next)
                  const pickerHeight = 180
                  setTimeout(() => onContentChange?.(next ? pickerHeight : 0), 50)
                }}
              />
            </div>
          ) : type === 'date' ? (
            <DateInputMask
              value={
                value
                  ? /^\d{4}-\d{2}-\d{2}$/.test(value)
                    ? sqlToDdmmyyyy(value) // SQL → UI
                    : value // already UI
                  : ''
              }
              onChange={(uiVal: string) => {
                if (uiVal.length < 10) {
                  onChange?.({
                    target: { name, value: uiVal },
                  } as React.ChangeEvent<HTMLInputElement>)
                  return
                }

                const sqlVal = ddmmyyyyToSql(uiVal)

                onChange?.({
                  target: { name, value: sqlVal },
                } as React.ChangeEvent<HTMLInputElement>)

                if (autoValidate) {
                  const err = validateValue('date' as any, sqlVal, {
                    required,
                    ...(validationOptions || {}),
                  })
                  onValidate?.(err)
                }
              }}
              placeholder={placeholder || 'DD-MM-YYYY'}
              className={`input-field ${className} ${stateClass}`}
              disabled={disabled}
              readOnly={readOnly}
            />
          ) : type === 'time' ? (
            <TimeInputMask
              value={value ?? ''}
              onChange={(val) => {
                onChange?.({
                  target: { name, value: val },
                } as React.ChangeEvent<HTMLInputElement>)

                if (autoValidate && val.length === 5) {
                  const err = validateValue('time' as any, val, {
                    required,
                    ...(validationOptions || {}),
                  })
                  onValidate?.(err)
                }
              }}
              placeholder={placeholder}
              className={`${className} ${stateClass}`}
              disabled={disabled}
              readOnly={readOnly}
            />
          ) : type === 'datetime' ? (
            // Two masked fields over one value — stored as SQL `YYYY-MM-DDTHH:mm`
            // so it round-trips without a separate parse step.
            <div className="datetime-input-row">
              <DateInputMask
                value={datetimeDate ? sqlToDdmmyyyy(datetimeDate) : ''}
                onChange={(uiVal) => {
                  if (uiVal.length < 10) return
                  emitDatetime(ddmmyyyyToSql(uiVal), datetimeTime)
                }}
                placeholder="DD-MM-YYYY"
                className={`input-field ${className} ${stateClass}`}
                disabled={disabled}
                readOnly={readOnly}
              />
              <Spacer size={1.25} />
              <TimeInputMask
                value={datetimeTime}
                onChange={(val) => emitDatetime(datetimeDate, val)}
                placeholder="HH:mm"
                className={`${className} ${stateClass}`}
                disabled={disabled || !datetimeDate}
                readOnly={readOnly}
              />
            </div>
          ) : (
            <>
              {largeInput ? (
                <div style={{ position: 'relative', width: '100%' }}>
                  {withEditor && (
                    <EditorToolbar
                      hasLinks={hasLinks}
                      hasBlanks={hasBlanks}
                      hasBulletPoints={hasBulletPoints}
                      targetName={name}
                      onTextChange={(val) => {
                        const syntheticEvent = {
                          target: { name, value: val },
                        } as React.ChangeEvent<HTMLInputElement>
                        onChange?.(syntheticEvent)
                      }}
                    />
                  )}

                  <textarea
                    style={{ paddingTop: withEditor ? '45px' : '', ...style }}
                    id={name}
                    name={name}
                    value={value ?? ''}
                    onChange={(e) => {
                      const syntheticEvent = {
                        target: { name, value: e.target.value },
                      } as unknown as React.ChangeEvent<HTMLInputElement>
                      onChange?.(syntheticEvent)

                      if (autoValidate) {
                        const err = validateValue(type as any, e.target.value, {
                          required,
                          ...(validationOptions || {}),
                        })
                        onValidate?.(err)
                      }
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`input-field textarea ${className} ${stateClass} ${textareaSize}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    ref={ref as any}
                    onKeyDown={handleKeyDown}
                    required={required}
                    maxLength={maxLength}
                    onBlur={handleBlur('multiline')}
                  />
                  {showCounter && (
                    <div
                      className={`character-counter ${value!.length >= maxLength! ? 'at-limit' : 'near-limit'}`}
                    >
                      {value!.length} / {maxLength}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <input
                    id={name}
                    name={name}
                    // `code` is not a DOM input type — it renders as text, same
                    // as the empty-number case below.
                    type={
                      showPassword
                        ? 'text'
                        : isCode
                          ? 'text'
                          : type === 'number' && (value === '' || value === undefined)
                            ? 'text'
                            : type
                    }
                    inputMode={type === 'number' || isCode ? 'numeric' : undefined}
                    // Legacy iOS reads `pattern`, not `inputMode`, to decide the
                    // keypad. `[0-9]*` also matches empty, so it never blocks submit.
                    pattern={isCode ? '[0-9]*' : undefined}
                    value={hasPrefix ? displayValue : (value ?? '')}
                    onChange={(e) => {
                      let raw = e.target.value
                      if (hasPrefix && resolvedPrefix && raw.startsWith(resolvedPrefix)) {
                        raw = raw.slice(resolvedPrefix.length)
                      }
                      // Codes are digits only — strip whatever a paste brings with
                      // it, so the value the caller sees is always submittable.
                      if (isCode) raw = raw.replace(/\D/g, '')
                      const syntheticEvent = {
                        ...e,
                        target: { ...e.target, name, value: raw },
                      } as React.ChangeEvent<HTMLInputElement>
                      onChange?.(syntheticEvent)
                      if (autoValidate) {
                        const err = validateValue(type as any, raw, {
                          required,
                          ...(validationOptions || {}),
                        })
                        onValidate?.(err)
                      }
                    }}
                    onBlur={handleBlur('single-line')}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`input-field ${isCode ? 'code-field' : ''} ${className} ${stateClass}`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${name}-error` : undefined}
                    ref={ref}
                    onKeyDown={handleKeyDown}
                    required={required}
                    style={style}
                    autoComplete={resolvedAutoComplete}
                    maxLength={maxLength}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                  />
                  {rightIcon && <span className="right-icon">{rightIcon}</span>}
                </>
              )}
              {showCounter && (
                <div
                  className={`character-counter ${value!.length >= maxLength! ? 'at-limit' : 'near-limit'}`}
                >
                  {value!.length} / {maxLength}
                </div>
              )}
            </>
          )}

          {type === 'password' && (
            <FontAwesomeIcon
              role="button"
              className="hide-show-icon"
              icon={!showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            />
          )}
        </div>

        {/* --- conditionally render picker below input (like the working version) --- */}
        {type === 'colour' && showColourPicker && (
          <div className={`color-picker-wrapper ${pickerAbove ? 'top' : ''}`}>
            <ColourPicker
              value={value || '#FFFFFF'}
              onChange={(val) => {
                const syntheticEvent = {
                  target: { name, value: val },
                } as unknown as React.ChangeEvent<HTMLInputElement>
                onChange?.(syntheticEvent)
              }}
            />
          </div>
        )}

        <div className="input-error-container">
          {error && (
            <div id={`${name}-error`} className="input-error">
              {error}
            </div>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = 'CustomInput'
export default Input
