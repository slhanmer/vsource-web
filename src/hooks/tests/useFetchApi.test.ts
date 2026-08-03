import { renderHook, act } from '@testing-library/react'
import { useFetchApi } from '../useFetchApi'

// Mock global.fetch
const mockFetch = jest.fn()
global.fetch = mockFetch as any

describe('useFetchApi', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    mockFetch.mockReset()
    // 4xx/5xx paths fire a second fetch to errors/logError. The *Once* mocks
    // below only cover the first call, so give the rest a default — otherwise
    // logError's fetch returns undefined and it can't attach its .catch().
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({}),
    })
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('returns data and success code when fetch succeeds with JSON', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ message: 'ok', data: { foo: 'bar' } }),
    })

    const { result } = renderHook(() => useFetchApi())

    await act(async () => {
      const output = await result.current('test/endpoint', { hello: 'world' })
      expect(output.msgCode).toBe(1)
      expect(output.data).toEqual({ foo: 'bar' })
    })
  })

  it('does not log on success', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ message: 'ok', data: {} }),
    })

    const { result } = renderHook(() => useFetchApi())

    await act(async () => {
      await result.current('test/endpoint', { hello: 'world' })
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('logs error and sets msgCode=3 on client error', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 404,
      json: async () => ({ message: 'Not found' }),
    })

    const { result } = renderHook(() => useFetchApi())

    await act(async () => {
      const output = await result.current('test/endpoint', { foo: 'bar' })
      expect(output.msgCode).toBe(3)
      expect(output.msg).toBe('Not found')
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch.mock.calls[1][0]).toContain('errors/logError')
  })

  it('logs error and sets msgCode=4 on server error', async () => {
    mockFetch.mockResolvedValueOnce({
      status: 500,
      json: async () => ({ message: 'Server exploded' }),
    })

    const { result } = renderHook(() => useFetchApi())

    await act(async () => {
      const output = await result.current('test/endpoint', { foo: 'bar' })
      expect(output.msgCode).toBe(4)
      expect(output.msg).toBe('Server exploded')
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch.mock.calls[1][0]).toContain('errors/logError')
  })

  it('handles fetch failure gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network down'))

    const { result } = renderHook(() => useFetchApi())

    await act(async () => {
      const output = await result.current('test/endpoint', { foo: 'bar' })
      expect(output.msgCode).toBe(4)
      expect(output.msg).toBe('Failed to communicate with server')
    })

    expect(mockFetch).toHaveBeenCalledTimes(2)
    expect(mockFetch.mock.calls[1][0]).toContain('errors/logError')
  })

  it('does not log when a custom baseUrl is supplied', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network down'))

    const { result } = renderHook(() => useFetchApi())

    await act(async () => {
      await result.current('test/endpoint', { foo: 'bar' }, 'json', 'https://third-party.example/')
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
