import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe } from 'jest-axe'
import FileUploader from '../../../components/ui-kit/FileUploader'

jest.mock('../../../utils', () => ({
  debounceButton: (fn: any) => fn,
  getDisplayFileName: jest.fn((name: string) => name),
}))

jest.mock('../../../hooks', () => ({
  useViewport: jest.fn(() => false),
  useHoverAndTouch: jest.fn(() => ({
    isHovered: false,
    isTouched: false,
    handleMouseEnter: jest.fn(),
    handleMouseLeave: jest.fn(),
    handleTouchStart: jest.fn(),
    handleTouchEnd: jest.fn(),
  })),
}))

function makeFile(name = 'file.txt', type = 'text/plain') {
  return new File(['content'], name, { type })
}

describe('FileUploader', () => {
  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<FileUploader />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('rendering', () => {
    it('renders default label "Upload file"', () => {
      render(<FileUploader />)
      expect(screen.getByText('Upload file')).toBeInTheDocument()
    })

    it('renders custom label', () => {
      render(<FileUploader label="Drop files here" />)
      expect(screen.getByText('Drop files here')).toBeInTheDocument()
    })

    it('renders custom buttonName over label', () => {
      render(<FileUploader label="Upload" buttonName="Select document" />)
      expect(screen.getByText('Select document')).toBeInTheDocument()
    })

    it('renders the upload box', () => {
      const { container } = render(<FileUploader />)
      expect(container.querySelector('.upload-box')).toBeInTheDocument()
    })
  })

  describe('file selection', () => {
    it('calls onChange when a file is selected', async () => {
      const onChange = jest.fn()
      render(<FileUploader onChange={onChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = makeFile('doc.pdf', 'application/pdf')
      fireEvent.change(input, { target: { files: [file] } })
      await waitFor(() => expect(onChange).toHaveBeenCalledWith([file]))
    })

    it('replaces file in single mode', async () => {
      const onChange = jest.fn()
      render(<FileUploader onChange={onChange} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      fireEvent.change(input, { target: { files: [makeFile('a.txt')] } })
      fireEvent.change(input, { target: { files: [makeFile('b.txt')] } })
      await waitFor(() => {
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
        expect(lastCall).toHaveLength(1)
        expect(lastCall[0].name).toBe('b.txt')
      })
    })

    it('accumulates files in multiple mode', async () => {
      const onChange = jest.fn()
      render(<FileUploader onChange={onChange} multiple />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      fireEvent.change(input, { target: { files: [makeFile('a.txt')] } })
      fireEvent.change(input, { target: { files: [makeFile('b.txt')] } })
      await waitFor(() => {
        const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
        expect(lastCall).toHaveLength(2)
      })
    })
  })

  describe('drag and drop', () => {
    it('calls onChange when files are dropped', async () => {
      const onChange = jest.fn()
      const { container } = render(<FileUploader onChange={onChange} />)
      const file = makeFile('dropped.txt')
      fireEvent.drop(container.firstChild as Element, {
        dataTransfer: { files: [file] },
      })
      await waitFor(() => expect(onChange).toHaveBeenCalledWith([file]))
    })
  })

  describe('file list display', () => {
    it('shows uploaded file names when showUploads=true', async () => {
      render(<FileUploader showUploads onChange={jest.fn()} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      fireEvent.change(input, { target: { files: [makeFile('report.pdf')] } })
      await waitFor(() => expect(screen.getByText('report.pdf')).toBeInTheDocument())
    })

    it('calls onRemove and removes file when close button is clicked', async () => {
      const onRemove = jest.fn()
      render(<FileUploader showUploads onRemove={onRemove} onChange={jest.fn()} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      fireEvent.change(input, { target: { files: [makeFile('toRemove.pdf')] } })
      await waitFor(() => screen.getByText('toRemove.pdf'))
      fireEvent.click(
        document.querySelector('.modal-closer, .close-button, button[class*="close"]')!
      )
      await waitFor(() => {
        expect(onRemove).toHaveBeenCalledWith(0)
        expect(screen.queryByText('toRemove.pdf')).not.toBeInTheDocument()
      })
    })
  })

  describe('disabled state', () => {
    it('applies disabled class when disabled=true', () => {
      const { container } = render(<FileUploader disabled />)
      expect(container.querySelector('.file-uploader')).toHaveClass('disabled')
    })

    it('disables the file input when disabled=true', () => {
      render(<FileUploader disabled />)
      expect(document.querySelector('input[type="file"]')).toBeDisabled()
    })
  })

  describe('required state', () => {
    it('applies required class when required=true', () => {
      const { container } = render(<FileUploader required />)
      expect(container.querySelector('.file-uploader')).toHaveClass('required')
    })
  })

  describe('renameFile', () => {
    it('renames files using renameFile function', async () => {
      const onChange = jest.fn()
      const renameFile = (f: File) => new File([f], 'renamed.pdf', { type: f.type })
      render(<FileUploader onChange={onChange} renameFile={renameFile} />)
      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      fireEvent.change(input, { target: { files: [makeFile('original.pdf')] } })
      await waitFor(() => {
        const files: File[] = onChange.mock.calls[0][0]
        expect(files[0].name).toBe('renamed.pdf')
      })
    })
  })
})
