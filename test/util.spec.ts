import { describe, expect, it } from 'vitest'
import { formatIdOrPath, formatPathAndId, isObject, stringifyQuery } from '../src/util'

describe('util.stringifyQuery', () => {
  it('returns empty string for falsy input', () => {
    expect(stringifyQuery(undefined)).toBe('')
    expect(stringifyQuery(null)).toBe('')
  })

  it('returns empty string for empty object', () => {
    expect(stringifyQuery({})).toBe('')
  })

  it('encodes simple key/value pairs', () => {
    const res = stringifyQuery({ a: 1, b: 'two' })
    // order can be deterministic based on Object.keys insertion order in tests
    expect(res).toBe('?a=1&b=two')
  })

  it('joins array values with comma and encodes comma', () => {
    const res = stringifyQuery({ tags: ['one', 'two'] })
    // comma is encoded to %2C
    expect(res).toBe('?tags=one%2Ctwo')
  })

  it('encodes special characters in keys and values', () => {
    const res = stringifyQuery({ 'a b': 'x y', 'amp': '1&2' })
    // check that encoding applied
    expect(res).toContain('a%20b=')
    expect(res).toContain('x%20y')
    expect(res).toContain('amp=1%262')
  })
})

describe('util.isObject', () => {
  it('returns true for plain objects and arrays', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(true)
  })

  it('returns true for functions', () => {
    expect(isObject(() => {})).toBe(true)
  })

  it('returns false for null and primitives', () => {
    expect(isObject(null)).toBe(false)
    expect(isObject(123)).toBe(false)
    expect(isObject('str')).toBe(false)
    expect(isObject(false)).toBe(false)
  })
})

describe('util.formatIdOrPath', () => {
  it('removes leading slashes', () => {
    expect(formatIdOrPath('/abc')).toBe('abc')
    expect(formatIdOrPath('///abc')).toBe('abc')
  })

  it('returns numeric values as strings', () => {
    expect(formatIdOrPath(123)).toBe('123')
  })

  it('returns empty string for empty input', () => {
    expect(formatIdOrPath('')).toBe('')
  })
})

describe('util.formatPathAndId', () => {
  it('joins path and id with single slash', () => {
    expect(formatPathAndId('users', '1')).toBe('users/1')
    expect(formatPathAndId('users/', '/1')).toBe('users/1')
  })

  it('preserves left-side leading slash if present', () => {
    expect(formatPathAndId('/users', '1')).toBe('/users/1')
    expect(formatPathAndId('/users/', '/1')).toBe('/users/1')
  })

  it('returns /id when path empty', () => {
    expect(formatPathAndId('', '1')).toBe('/1')
    expect(formatPathAndId('/', '1')).toBe('/1')
  })

  it('returns path when id empty', () => {
    expect(formatPathAndId('users', '')).toBe('users')
    expect(formatPathAndId('/api/', '')).toBe('/api')
  })

  it('handles nested id paths', () => {
    expect(formatPathAndId('/api/', '/nested/path')).toBe('/api/nested/path')
    expect(formatPathAndId('api', '/v1/resource')).toBe('api/v1/resource')
  })

  it('works for numeric id and preserves left', () => {
    expect(formatPathAndId('items', 42)).toBe('items/42')
    expect(formatPathAndId('/items/', 42)).toBe('/items/42')
  })

  it('keeps left leading slashes intact (per current implementation)', () => {
    // If left has multiple leading slashes, they are preserved by the current implementation
    expect(formatPathAndId('///api//', 'v1')).toBe('///api/v1')
  })

  it('preserves internal slashes in both parts', () => {
    expect(formatPathAndId('a/b/c', 'd/e')).toBe('a/b/c/d/e')
    expect(formatPathAndId('/a//b/', '/c//d')).toBe('/a//b/c//d')
    expect(formatPathAndId('users', 'a//b')).toBe('users/a//b')
  })
})
