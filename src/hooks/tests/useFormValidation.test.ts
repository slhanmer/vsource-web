import { renderHook, act } from '@testing-library/react'
import { useFormValidation } from '../useFormValidation'

describe('useFormValidation', () => {
  it('initializes with provided errors', () => {
    const { result } = renderHook(() => useFormValidation({ email: 'Required', password: null }))

    expect(result.current.errors).toEqual({
      email: 'Required',
      password: null,
    })
  })

  it('updates a field error when setFieldError is called', () => {
    const { result } = renderHook(() => useFormValidation())

    act(() => {
      result.current.setFieldError('username', 'Must not be empty')
    })

    expect(result.current.errors).toEqual({
      username: 'Must not be empty',
    })
  })

  it('clears a field error when setFieldError is called with null', () => {
    const { result } = renderHook(() => useFormValidation({ username: 'Invalid' }))

    act(() => {
      result.current.setFieldError('username', null)
    })

    expect(result.current.errors).toEqual({
      username: null,
    })
  })
})
