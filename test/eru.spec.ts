import { beforeEach, describe, expect, it, vi } from 'vitest'
import { eru } from '../src/eru'

// Helper to create a fetch response object
function createFetchResponder(data: any, ok = true, status = 200) {
  return {
    ok,
    status,
    statusText: ok ? 'OK' : 'ERROR',
    text: async () => new Promise((resolve) => {
      resolve(typeof data === 'string' ? data : JSON.stringify(data))
    }),
  }
}

// Create and install a fetch mock that resolves with the given responder
function createFetchMock(responder = createFetchResponder({}), overrideGlobal = true) {
  const fetchMock = vi.fn().mockResolvedValue(responder)
  if (overrideGlobal)
    globalThis.fetch = fetchMock

  return fetchMock
}

// Setup mock localStorage.getItem
function mockLocalStorage(getItemReturn: string | null = null) {
  const getItem = vi.fn().mockReturnValue(getItemReturn)
  // @ts-expect-error mock
  globalThis.localStorage = { getItem }
  return getItem
}

// Utility to read last fetch call args
function lastFetchCall(fetchMock: any) {
  const calls = fetchMock.mock.calls
  return calls.length ? calls[calls.length - 1] : null
}

beforeEach(() => {
  vi.restoreAllMocks()
  // default global mocks to avoid test leakage
  createFetchMock(createFetchResponder({ ok: true }))
  // @ts-expect-error provide a localStorage mock by default
  globalThis.localStorage = { getItem: vi.fn().mockReturnValue(null) }
})

describe('eru route integration', () => {
  it('normalizes path + id so there are not two slashes between them', async () => {
    const e = eru('https://api/')
    const route = e.route('/users/')

    const fetchMock = createFetchMock(createFetchResponder({ success: true }))
    await route.get('123', {})

    const [url] = lastFetchCall(fetchMock)!
    // between "users" and "123" should be a single slash
    expect(url).toContain('/users/123')
    expect(url).not.toContain('/users//123')
  })

  it('post with object as first arg treats it as body and does not introduce extra slash', async () => {
    const e = eru('https://api/')
    const route = e.route('users')

    const fetchMock = createFetchMock(createFetchResponder({ created: true }))
    await route.post({ name: 'alice' }) // object as first arg -> body

    const [url, init] = lastFetchCall(fetchMock)!
    // url should end in '/users' (basePath has trailing slash)
    expect(url.endsWith('/users')).toBe(true)
    // body should be present and be a string (serialized)
    expect(typeof init.body).toBe('string')
  })

  it('sets Authorization header from localStorage when authTokenKey is configured', async () => {
    mockLocalStorage('tok-123')

    const e = eru('https://api/', { authTokenKey: 'myTokenKey' })
    const route = e.route('/items/')

    const fetchMock = createFetchMock(createFetchResponder({ ok: true }))
    await route.post('1', { name: 'test' })

    const [, init] = lastFetchCall(fetchMock)!
    // Authorization header should be added by runRequest
    expect(init.headers?.Authorization).toBe('Bearer tok-123')
  })

  it('onLoading (true/false) and onDone are called for a successful request', async () => {
    const onLoading = vi.fn()
    const onDone = vi.fn()

    const e = eru('https://api/')
    const route = e.route('/things')

    // const fetchMock = createFetchMock(createFetchResponder({ ok: true }))
    await route.get('9', { onDone, onLoading })
    // onLoading should be called at least twice: true at start, false at finally
    expect(onLoading).toHaveBeenCalled()

    expect(onLoading.mock.calls[0][0]).toBe(true)
    expect(onLoading.mock.calls[1][0]).toBe(false)

    expect(onDone).toHaveBeenCalled()
  })

  it('delete requests remove any provided body before sending', async () => {
    const e = eru('https://api/')
    const route = e.route('/remove')

    const fetchMock = createFetchMock(createFetchResponder({ deleted: true }))
    // Provide a body in options (should be removed by patchBodyless)
    await route.delete('7', { body: { foo: 'bar' } } as any)

    const [, init] = lastFetchCall(fetchMock)!
    expect(init.body).toBeUndefined()
  })
})
