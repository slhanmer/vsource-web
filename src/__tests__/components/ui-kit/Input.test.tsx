import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import Input from '../../../components/ui-kit/Input'
import { validateValue } from '../../../utils'

jest.mock('../../../utils', () => ({
  validateValue: jest.fn(() => null),
  getCssVarPx: jest.fn(() => 0),
  debounceViewport: (fn: any) => fn,
  ddmmyyyyToSql: jest.fn((v: string) => v),
  sqlToDdmmyyyy: jest.fn((v: string) => v),
  // Real implementation, not a stub — it is a pure leaf module with no imports,
  // so requiring it directly costs nothing and the assertions below then test
  // actual sanitisation behaviour rather than a mock's say-so.
  sanitiseText: jest.requireActual('../../../utils/sanitiseText').sanitiseText,
}))

jest.mock('react-imask', () => ({
  IMaskInput: ({ value, placeholder, disabled, className, onAccept, readOnly }: any) => (
    <input
      data-testid="imask-input"
      value={value || ''}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      readOnly={readOnly}
      onChange={(e) => onAccept?.(e.target.value)}
    />
  ),
  IMask: { MaskedRange: class {} },
}))

jest.mock('react-colorful', () => ({
  HexColorPicker: ({ color, onChange }: any) => (
    <input
      data-testid="hex-picker"
      type="color"
      value={color}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}))

/** Pull the value out of the synthetic event Input emits. */
const changedValue = (onChange: jest.Mock) => onChange.mock.calls.at(-1)?.[0]?.target?.value

describe('Input', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // clearAllMocks does not undo mockReturnValue, so reassert the default —
    // otherwise a `mockReturnValue` set in one test leaks into every later one.
    ;(validateValue as jest.Mock).mockReturnValue(null)
  })

  describe('accessibility', () => {
    it('has no axe violations for basic text input', async () => {
      const { container } = render(<Input name="username" label="Username" hideLabel={false} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no axe violations for password input', async () => {
      const { container } = render(
        <Input name="pwd" type="password" label="Password" hideLabel={false} />
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('label', () => {
    it('renders visible label when hideLabel=false', () => {
      render(<Input name="email" label="Email" hideLabel={false} />)
      expect(screen.getByText('Email')).toBeVisible()
    })

    it('visually hides label when hideLabel=true', () => {
      const { container } = render(<Input name="email" label="Email" hideLabel />)
      expect(container.querySelector('.visually-hidden')).toBeInTheDocument()
    })

    it('associates label with input via htmlFor', () => {
      render(<Input name="email" label="Email" hideLabel={false} />)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    it('renders a required asterisk on a visible label', () => {
      const { container } = render(
        <Input name="email" label="Email" hideLabel={false} required value="" />
      )
      expect(container.querySelector('.asterix')).toBeInTheDocument()
    })

    it('does not render the asterisk when the label is hidden', () => {
      const { container } = render(<Input name="email" label="Email" hideLabel required value="" />)
      expect(container.querySelector('.asterix')).not.toBeInTheDocument()
    })
  })

  describe('text input', () => {
    it('renders with placeholder', () => {
      render(<Input name="q" placeholder="Search…" />)
      expect(screen.getByPlaceholderText('Search…')).toBeInTheDocument()
    })

    it('displays current value', () => {
      render(<Input name="q" value="Hello" onChange={jest.fn()} />)
      expect(screen.getByRole('textbox')).toHaveValue('Hello')
    })

    it('calls onChange when value changes', () => {
      const onChange = jest.fn()
      render(<Input name="q" value="" onChange={onChange} />)
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } })
      expect(onChange).toHaveBeenCalled()
    })

    it('disables input when disabled=true', () => {
      render(<Input name="q" disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('makes input readOnly when readOnly=true', () => {
      render(<Input name="q" readOnly />)
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
    })
  })

  describe('error state', () => {
    it('renders error message', () => {
      render(<Input name="email" error="Invalid email" />)
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
    })

    it('adds aria-describedby pointing to the error element', () => {
      render(<Input name="email" error="Required" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'email-error')
    })

    it('sets aria-invalid when error is present', () => {
      render(<Input name="email" error="Bad input" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('password type', () => {
    it('renders password input with masked characters', () => {
      render(<Input name="pwd" type="password" label="Password" hideLabel={false} />)
      const input = screen.getByLabelText('Password') as HTMLInputElement
      expect(input.type).toBe('password')
    })

    it('toggles to text type when show-password is clicked', () => {
      render(<Input name="pwd" type="password" label="Password" hideLabel={false} />)
      const input = screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement
      fireEvent.click(screen.getByLabelText(/show password/i))
      expect(input.type).toBe('text')
    })

    it('toggles back to password after hide is clicked', () => {
      render(<Input name="pwd" type="password" label="Password" hideLabel={false} />)
      const input = screen.getByLabelText('Password', { selector: 'input' }) as HTMLInputElement
      fireEvent.click(screen.getByLabelText(/show password/i))
      fireEvent.click(screen.getByLabelText(/hide password/i))
      expect(input.type).toBe('password')
    })
  })

  describe('currency type', () => {
    it('renders with $ prefix for currency type', () => {
      render(<Input name="amount" type="currency" value="100" onChange={jest.fn()} />)
      expect(screen.getByRole('textbox')).toHaveValue('$100')
    })
  })

  describe('date type', () => {
    it('renders DateInputMask for date type', () => {
      render(<Input name="dob" type="date" value="" onChange={jest.fn()} disabled={false} />)
      expect(screen.getByTestId('imask-input')).toBeInTheDocument()
    })
  })

  describe('time type', () => {
    it('renders TimeInputMask for time type', () => {
      render(<Input name="appt" type="time" value="09:00" onChange={jest.fn()} />)
      expect(screen.getByTestId('imask-input')).toHaveValue('09:00')
    })
  })

  describe('datetime type', () => {
    it('renders a date and a time mask for datetime type', () => {
      render(<Input name="when" type="datetime" value="2026-07-24T09:00" onChange={jest.fn()} />)
      // Both halves are IMaskInputs — the date mask and the time mask.
      expect(screen.getAllByTestId('imask-input')).toHaveLength(2)
    })

    it('recombines both halves into a single ISO-style value', () => {
      const onChange = jest.fn()
      render(<Input name="when" type="datetime" value="2026-07-24T09:00" onChange={onChange} />)
      const [, timeInput] = screen.getAllByTestId('imask-input')
      fireEvent.change(timeInput, { target: { value: '14:30' } })
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({ target: expect.objectContaining({ value: '2026-07-24T14:30' }) })
      )
    })
  })

  describe('textarea (large text)', () => {
    it('renders textarea when maxLength>249 and type=text', () => {
      render(<Input name="bio" type="text" maxLength={500} value="" onChange={jest.fn()} />)
      expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement)
    })

    it('renders a single-line input at or below 249', () => {
      render(<Input name="bio" type="text" maxLength={249} value="" onChange={jest.fn()} />)
      expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLInputElement)
    })
  })

  // APT-147. `maxLength` was previously dropped above 500
  // (`maxLength > 500 ? undefined : maxLength`), leaving long fields uncapped
  // while the character counter kept reporting a limit.
  describe('maxLength enforcement', () => {
    it('applies the maxLength attribute above 500', () => {
      render(<Input name="note" maxLength={5000} value="" onChange={jest.fn()} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '5000')
    })

    it('applies the maxLength attribute at or below 500', () => {
      render(<Input name="note" maxLength={300} value="" onChange={jest.fn()} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '300')
    })

    it('applies the maxLength attribute on a single-line field', () => {
      render(<Input name="q" maxLength={40} value="" onChange={jest.fn()} />)
      expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '40')
    })

    it('caps an over-length value on blur', () => {
      const onChange = jest.fn()
      render(<Input name="note" maxLength={300} value={'a'.repeat(320)} onChange={onChange} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(changedValue(onChange)).toHaveLength(300)
    })
  })

  describe('textarea size buckets', () => {
    it.each([
      [300, 'size-small'],
      [499, 'size-small'],
      [500, 'size-medium'],
      [999, 'size-medium'],
      [1000, 'size-large'],
      [5000, 'size-large'],
    ])('maxLength %i gets %s', (len, expected) => {
      render(<Input name="note" maxLength={len} value="" onChange={jest.fn()} />)
      expect(screen.getByRole('textbox')).toHaveClass(expected)
    })
  })

  // APT-147. Sanitisation runs at blur rather than change so that NFC
  // normalisation cannot disrupt IME composition or move the caret on paste.
  describe('sanitisation on blur', () => {
    it('strips bidi overrides', () => {
      const onChange = jest.fn()
      render(<Input name="note" value={'Dose \u202E10mg'} onChange={onChange} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(changedValue(onChange)).toBe('Dose 10mg')
    })

    it('strips zero-width formatting characters', () => {
      const onChange = jest.fn()
      render(<Input name="note" value={'he\u200Bllo\uFEFF'} onChange={onChange} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(changedValue(onChange)).toBe('hello')
    })

    it('keeps ZWJ and ZWNJ, which carry meaning', () => {
      const onChange = jest.fn()
      render(
        <Input
          name="note"
          value={'\u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u0645'}
          onChange={onChange}
        />
      )
      fireEvent.blur(screen.getByRole('textbox'))
      // Unchanged, so the no-op guard suppresses the callback entirely.
      expect(onChange).not.toHaveBeenCalled()
    })

    it('keeps bidi marks, which do not enable reordering attacks', () => {
      const onChange = jest.fn()
      render(<Input name="note" value={'\u200Fشلوم\u200E ok'} onChange={onChange} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('trims leading and trailing whitespace', () => {
      const onChange = jest.fn()
      render(<Input name="note" value={'   spaced   '} onChange={onChange} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(changedValue(onChange)).toBe('spaced')
    })

    it('collapses newlines in a single-line field', () => {
      const onChange = jest.fn()
      render(<Input name="q" value={'one\ntwo'} onChange={onChange} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(changedValue(onChange)).toBe('one two')
    })

    it('preserves newlines in a textarea, normalising CRLF', () => {
      const onChange = jest.fn()
      render(<Input name="note" maxLength={500} value={'one\r\ntwo'} onChange={onChange} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(changedValue(onChange)).toBe('one\ntwo')
    })

    it('does not call onChange when the value is already clean', () => {
      const onChange = jest.fn()
      render(<Input name="q" value="already clean" onChange={onChange} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('leaves a password untouched', () => {
      // NFC would change the bytes hashed at registration and break logins.
      const onChange = jest.fn()
      render(
        <Input
          name="pwd"
          type="password"
          label="Password"
          hideLabel={false}
          value={'  pa\u200Bss  '}
          onChange={onChange}
        />
      )
      fireEvent.blur(screen.getByLabelText('Password', { selector: 'input' }))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('leaves a one-time code untouched', () => {
      const onChange = jest.fn()
      render(<Input name="otp" type="code" value=" 123 " onChange={onChange} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(onChange).not.toHaveBeenCalled()
    })

    it('still calls the caller onBlur', () => {
      const onBlur = jest.fn()
      render(<Input name="q" value="  x  " onChange={jest.fn()} onBlur={onBlur} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(onBlur).toHaveBeenCalled()
    })
  })

  describe('character counter', () => {
    it('shows counter when value is near maxLength', () => {
      render(<Input name="bio" type="text" maxLength={10} value="12345678" onChange={jest.fn()} />)
      expect(screen.getByText('8 / 10')).toBeInTheDocument()
    })

    it('does not show counter when below 80% of maxLength', () => {
      render(<Input name="bio" type="text" maxLength={100} value="short" onChange={jest.fn()} />)
      expect(screen.queryByText(/\/ 100/)).not.toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('calls onValidate on blur', () => {
      const onValidate = jest.fn()
      ;(validateValue as jest.Mock).mockReturnValue('Required')
      render(<Input name="email" type="email" value="" required onValidate={onValidate} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(onValidate).toHaveBeenCalledWith('Required')
    })

    it('does not call onValidate when autoValidate=false', () => {
      const onValidate = jest.fn()
      render(<Input name="email" value="" onValidate={onValidate} autoValidate={false} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(onValidate).not.toHaveBeenCalled()
    })

    // Behaviour change: blur used to validate the raw value. It now validates
    // the sanitised one, so a field failing only on invisible characters passes.
    it('validates the sanitised value, not the raw one', () => {
      render(<Input name="q" value={'  hi\u200B  '} onChange={jest.fn()} onValidate={jest.fn()} />)
      fireEvent.blur(screen.getByRole('textbox'))
      expect(validateValue).toHaveBeenLastCalledWith('text', 'hi', expect.anything())
    })
  })

  describe('rightIcon', () => {
    it('renders rightIcon element', () => {
      render(<Input name="q" rightIcon={<span data-testid="icon">🔍</span>} />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
  })
})
