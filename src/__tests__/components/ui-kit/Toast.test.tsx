import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import { ToastProvider, useToast } from '../../../components/ui-kit/Toast'

jest.useFakeTimers()

function TestToast({ type, code }: { type?: string; code?: number }) {
  const { showToast } = useToast()
  return (
    <button onClick={() => showToast('Test message', (code !== undefined ? code : type) as any)}>
      Show
    </button>
  )
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('ToastProvider / useToast', () => {
  describe('accessibility', () => {
    it('has no axe violations when provider is empty', async () => {
      // axe uses setTimeout internally; switch to real timers for this test only
      jest.useRealTimers()
      const { container } = render(
        <ToastProvider>
          <div />
        </ToastProvider>
      )
      const result = await axe(container)
      jest.useFakeTimers()
      expect(result).toHaveNoViolations()
    })
  })

  describe('initial state', () => {
    it('renders children without any toasts initially', () => {
      renderWithProvider(<p>Content</p>)
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.queryByText('Test message')).not.toBeInTheDocument()
    })
  })

  describe('showToast', () => {
    it('displays the toast message', () => {
      renderWithProvider(<TestToast type="info" />)
      act(() => {
        screen.getByRole('button').click()
      })
      expect(screen.getByText('Test message')).toBeInTheDocument()
    })

    it('applies correct CSS class for "success" type', () => {
      renderWithProvider(<TestToast type="success" />)
      act(() => {
        screen.getByRole('button').click()
      })
      expect(screen.getByText('Test message')).toHaveClass('success')
    })

    it('applies correct CSS class for "error" type', () => {
      renderWithProvider(<TestToast type="error" />)
      act(() => {
        screen.getByRole('button').click()
      })
      expect(screen.getByText('Test message')).toHaveClass('error')
    })

    it('applies correct CSS class for "warning" type', () => {
      renderWithProvider(<TestToast type="warning" />)
      act(() => {
        screen.getByRole('button').click()
      })
      expect(screen.getByText('Test message')).toHaveClass('warning')
    })

    it('applies correct CSS class for "info" type', () => {
      renderWithProvider(<TestToast type="info" />)
      act(() => {
        screen.getByRole('button').click()
      })
      expect(screen.getByText('Test message')).toHaveClass('info')
    })
  })

  describe('numeric code mapping', () => {
    const cases: [number, string][] = [
      [0, 'info'],
      [1, 'success'],
      [2, 'info'],
      [3, 'warning'],
      [4, 'error'],
    ]

    cases.forEach(([code, expectedClass]) => {
      it(`maps code ${code} to "${expectedClass}" class`, () => {
        renderWithProvider(<TestToast code={code} />)
        act(() => {
          screen.getByRole('button').click()
        })
        expect(screen.getByText('Test message')).toHaveClass(expectedClass)
      })
    })
  })

  describe('timing', () => {
    it('adds exiting class after duration - 300ms', () => {
      renderWithProvider(<TestToast />)
      act(() => {
        screen.getByRole('button').click()
      })
      act(() => {
        jest.advanceTimersByTime(2700)
      }) // 3000 - 300
      expect(screen.getByText('Test message')).toHaveClass('exiting')
    })

    it('removes the toast after the full duration', () => {
      renderWithProvider(<TestToast />)
      act(() => {
        screen.getByRole('button').click()
      })
      act(() => {
        jest.advanceTimersByTime(3000)
      })
      expect(screen.queryByText('Test message')).not.toBeInTheDocument()
    })

    it('supports custom duration', () => {
      function TestCustom() {
        const { showToast } = useToast()
        return <button onClick={() => showToast('Quick', 'info', 1000)}>Show</button>
      }
      renderWithProvider(<TestCustom />)
      act(() => {
        screen.getByRole('button').click()
      })
      act(() => {
        jest.advanceTimersByTime(700)
      })
      expect(screen.getByText('Quick')).toHaveClass('exiting')
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(screen.queryByText('Quick')).not.toBeInTheDocument()
    })
  })

  describe('multiple toasts', () => {
    it('stacks multiple toasts', () => {
      function MultiToast() {
        const { showToast } = useToast()
        return (
          <>
            <button onClick={() => showToast('First', 'info')}>First</button>
            <button onClick={() => showToast('Second', 'success')}>Second</button>
          </>
        )
      }
      renderWithProvider(<MultiToast />)
      act(() => {
        screen.getByRole('button', { name: 'First' }).click()
      })
      act(() => {
        screen.getByRole('button', { name: 'Second' }).click()
      })
      // 'First'/'Second' appear in both buttons and toasts; check the toast container
      expect(document.querySelector('.toast-container')).toHaveTextContent('First')
      expect(document.querySelector('.toast-container')).toHaveTextContent('Second')
    })
  })

  describe('error boundary', () => {
    it('throws when useToast is called outside ToastProvider', () => {
      const Broken = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        expect(() => useToast()).toThrow('useToast must be used within ToastProvider')
        return null
      }
      render(<Broken />)
    })
  })
})
