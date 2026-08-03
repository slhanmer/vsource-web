import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Camera } from '../../../components/ui-kit/Camera'

jest.mock('../../../utils', () => ({
  debounceButton: (fn: any) => fn,
  getCssVarPx: jest.fn(() => 0),
  debounceViewport: (fn: any) => fn,
}))

jest.mock('react-webcam', () => {
  const MockWebcam = React.forwardRef((_props: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      getScreenshot: () => 'data:image/jpeg;base64,mockscreenshot',
    }))
    return <video data-testid="webcam-video" />
  })
  MockWebcam.displayName = 'MockWebcam'

  return {
    __esModule: true,
    default: MockWebcam,
  }
})

describe('Camera', () => {
  describe('accessibility', () => {
    it('has no axe violations in initial state', async () => {
      const { container } = render(<Camera onCapture={jest.fn()} />)
      expect(await axe(container)).toHaveNoViolations()
    })

    it('has no axe violations when camera is active', async () => {
      const { container } = render(<Camera onCapture={jest.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: 'Open camera' }))
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders the camera toggle button initially', () => {
      render(<Camera onCapture={jest.fn()} />)
      expect(screen.getByRole('button', { name: 'Open camera' })).toBeInTheDocument()
    })

    it('does not show webcam feed initially', () => {
      render(<Camera onCapture={jest.fn()} />)
      expect(screen.queryByTestId('webcam-video')).not.toBeInTheDocument()
    })

    it('does not show error initially', () => {
      render(<Camera onCapture={jest.fn()} />)
      expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
    })
  })

  describe('toggle camera', () => {
    it('shows webcam feed after toggling camera on', () => {
      render(<Camera onCapture={jest.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: 'Open camera' }))
      expect(screen.getByTestId('webcam-video')).toBeInTheDocument()
    })

    it('shows capture button when camera is active', () => {
      render(<Camera onCapture={jest.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: 'Open camera' }))
      expect(screen.getByRole('button', { name: 'Capture photo' })).toBeInTheDocument()
    })

    it('toggle button can be clicked multiple times without throwing', () => {
      render(<Camera onCapture={jest.fn()} />)
      const toggleBtn = screen.getByRole('button', { name: 'Open camera' })
      expect(() => {
        fireEvent.click(toggleBtn)
        fireEvent.click(toggleBtn)
      }).not.toThrow()
    })
  })

  describe('capture', () => {
    it('calls onCapture with screenshot data', () => {
      const onCapture = jest.fn()
      render(<Camera onCapture={onCapture} />)
      fireEvent.click(screen.getByRole('button', { name: 'Open camera' }))
      fireEvent.click(screen.getByRole('button', { name: 'Capture photo' }))
      expect(onCapture).toHaveBeenCalledWith('data:image/jpeg;base64,mockscreenshot')
    })
  })

  describe('size prop', () => {
    it('applies small class for size="small"', () => {
      const { container } = render(<Camera onCapture={jest.fn()} size="small" />)
      expect(container.querySelector('.small')).toBeInTheDocument()
    })
  })
})
