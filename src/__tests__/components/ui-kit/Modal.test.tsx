import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import Modal from '../../../components/ui-kit/Modal'

jest.mock('../../../utils', () => ({
  debounceButton: (fn: any) => fn,
  getCssVarPx: jest.fn(() => 0),
  debounceViewport: (fn: any) => fn,
}))

describe('Modal', () => {
  describe('accessibility', () => {
    it('has no axe violations when open with a title', async () => {
      render(
        <Modal isOpen onClose={jest.fn()} title="Confirm">
          <p>Are you sure?</p>
        </Modal>
      )
      expect(await axe(document.body)).toHaveNoViolations()
    })

    it('has no axe violations when named via aria-label only (no title)', async () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="Confirm dialog">
          <p>Are you sure?</p>
        </Modal>
      )
      expect(await axe(document.body)).toHaveNoViolations()
    })

    it('has role="dialog" on modal content', () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="D">
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has aria-modal="true"', () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="D">
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    })

    it('resolves accessible name from title via aria-labelledby', () => {
      render(
        <Modal isOpen onClose={jest.fn()} title="My Modal">
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByRole('dialog', { name: 'My Modal' })).toBeInTheDocument()
    })

    it('resolves accessible name from aria-label when no title', () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="Screen reader name">
          <p>Content</p>
        </Modal>
      )
      expect(screen.getByRole('dialog', { name: 'Screen reader name' })).toBeInTheDocument()
    })
  })

  describe('open/closed state', () => {
    it('renders children when isOpen=true', () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="D">
          <p>Modal body</p>
        </Modal>
      )
      expect(screen.getByText('Modal body')).toBeInTheDocument()
    })

    it('does not render when isOpen=false', () => {
      render(
        <Modal isOpen={false} onClose={jest.fn()} aria-label="D">
          <p>Hidden</p>
        </Modal>
      )
      expect(screen.queryByText('Hidden')).not.toBeInTheDocument()
    })
  })

  describe('title', () => {
    it('renders title text', () => {
      render(
        <Modal isOpen onClose={jest.fn()} title="Confirm action">
          <p>Body</p>
        </Modal>
      )
      expect(screen.getByText('Confirm action')).toBeInTheDocument()
    })

    it('renders no heading when no title is provided', () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="D">
          <p>Body</p>
        </Modal>
      )
      expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })
  })

  describe('close button', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = jest.fn()
      render(
        <Modal isOpen onClose={onClose} title="T">
          <p>Body</p>
        </Modal>
      )
      fireEvent.click(document.querySelector('.modal-closer')!)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('hides close button when showCloseButton=false', () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="D" showCloseButton={false}>
          <p>Body</p>
        </Modal>
      )
      expect(document.querySelector('.modal-closer')).not.toBeInTheDocument()
    })
  })

  describe('overlay behaviour', () => {
    it('calls onClose when overlay is clicked and closeOnOverlay=true', () => {
      const onClose = jest.fn()
      render(
        <Modal isOpen onClose={onClose} aria-label="D" closeOnOverlay>
          <p>Body</p>
        </Modal>
      )
      fireEvent.click(document.querySelector('.modal-overlay')!)
      expect(onClose).toHaveBeenCalled()
    })

    it('does not call onClose when overlay is clicked and closeOnOverlay=false', () => {
      const onClose = jest.fn()
      render(
        <Modal isOpen onClose={onClose} aria-label="D" closeOnOverlay={false}>
          <p>Body</p>
        </Modal>
      )
      fireEvent.click(document.querySelector('.modal-overlay')!)
      expect(onClose).not.toHaveBeenCalled()
    })

    it('does not call onClose when modal content is clicked', () => {
      const onClose = jest.fn()
      render(
        <Modal isOpen onClose={onClose} aria-label="D">
          <p>Body</p>
        </Modal>
      )
      fireEvent.click(screen.getByRole('dialog'))
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('Escape key', () => {
    it('calls onClose on Escape when closeOnOverlay=true', () => {
      const onClose = jest.fn()
      render(
        <Modal isOpen onClose={onClose} aria-label="D" closeOnOverlay>
          <p>Body</p>
        </Modal>
      )
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).toHaveBeenCalled()
    })

    it('does not call onClose on Escape when closeOnOverlay=false', () => {
      const onClose = jest.fn()
      render(
        <Modal isOpen onClose={onClose} aria-label="D" closeOnOverlay={false}>
          <p>Body</p>
        </Modal>
      )
      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('fullScreen variant', () => {
    it('applies fullscreen class when fullScreen=true', () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="D" fullScreen>
          <p>Body</p>
        </Modal>
      )
      expect(screen.getByRole('dialog')).toHaveClass('fullscreen')
    })
  })

  describe('width prop', () => {
    it('applies custom maxWidth via style', () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="D" width="800px">
          <p>Body</p>
        </Modal>
      )
      expect(screen.getByRole('dialog')).toHaveStyle({ maxWidth: '800px' })
    })
  })

  describe('text alignment', () => {
    it('applies left text alignment by default', () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="D">
          <p>Body</p>
        </Modal>
      )
      const body = document.querySelector('.modal-body') as HTMLElement
      expect(body.style.textAlign).toBe('left')
    })

    it('applies center text alignment', () => {
      render(
        <Modal isOpen onClose={jest.fn()} aria-label="D" textAlignment="center">
          <p>Body</p>
        </Modal>
      )
      const body = document.querySelector('.modal-body') as HTMLElement
      expect(body.style.textAlign).toBe('center')
    })
  })
})
