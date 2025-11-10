export function stringifyQuery(query: any): string {
  if (!query)
    return ''

  const searchParams = Object.keys(query)
    .map((key) => {
      // Here we simply add a check for array of values
      let stringified = query[key]
      if (Array.isArray(query[key]))
        stringified = query[key].join(',')

      return [key, stringified].map(encodeURIComponent).join('=')
    })
    .join('&')
  return searchParams ? `?${searchParams}` : ''
}

export function isObject(val: any) {
  return typeof val === 'function' || (typeof val === 'object' && !!val)
}

/**
 * Build a normalized path from a base `path` and an `idOrPath`.
 * Ensures there is exactly one slash between them (and removes extra trailing/leading slashes).
 * - If idOrPath is empty, returns cleaned `path`.
 * - If path is empty, returns `/${idOrPath}` (ensures an initial slash).
 */
export function formatPathAndId(path: string, idOrPath: string | number): string {
  const leftRaw = String(path ?? '')
  const rightRaw = String(idOrPath ?? '')

  // Helper: split on forward or back slashes, remove empty parts
  const splitSegments = (s: string) => s.split(/[\\/]+/).filter(Boolean)

  const leftSegments = splitSegments(leftRaw)
  const rightSegments = splitSegments(rightRaw)

  const leftHasLeading = /^[\\/]/.test(leftRaw)

  // If right is empty, return normalized left (preserve leading slash if present)
  if (rightSegments.length === 0) {
    if (leftSegments.length === 0)
      return ''
    return leftHasLeading ? `/${leftSegments.join('/')}` : leftSegments.join('/')
  }

  // If left is empty, always return leading slash + right segments
  if (leftSegments.length === 0)
    return `/${rightSegments.join('/')}`

  // Both present: preserve left's leading slash if it existed
  const joined = `${leftSegments.join('/')}/${rightSegments.join('/')}`
  return leftHasLeading ? `/${joined}` : joined
}
