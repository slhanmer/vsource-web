import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'
import { TextEncoder, TextDecoder } from 'util'

expect.extend(toHaveNoViolations)

Object.assign(global, { TextEncoder, TextDecoder })

const originalError = console.error

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) {
      return // 👈 swallow this warning only
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// Polyfill ResizeObserver for JSDOM
class ResizeObserver {
  callback: ResizeObserverCallback
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }
  observe() {
    // no-op
  }
  unobserve() {
    // no-op
  }
  disconnect() {
    // no-op
  }
}

;(global as any).ResizeObserver = ResizeObserver

// Polyfill IntersectionObserver for JSDOM (used by PdfViewer)
class IntersectionObserver {
  callback: IntersectionObserverCallback
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
;(global as any).IntersectionObserver = IntersectionObserver

// Stub URL.createObjectURL for JSDOM (used by FileUploader)
global.URL.createObjectURL = jest.fn(() => 'blob:mock')

// Stub window.scrollTo for JSDOM (used by usePreventScroll in Modal)
window.scrollTo = jest.fn() as any
