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
 * Formats the given ID or path by removing leading slashes.
 * @param idOrPath The ID or path to format.
 * @returns String
 */
export function formatIdOrPath(idOrPath: string | number): string {
  const _idOrPath = String(idOrPath)
  return _idOrPath ? _idOrPath.replace(/^\/+/, '') : ''
}

/**
 * Build a normalized path from a base `path` and an `idOrPath`.
 * Ensures there is exactly one slash between them (and removes extra trailing/leading slashes).
 * - If idOrPath is empty, returns cleaned `path`.
 * - If path is empty, returns `/${idOrPath}` (ensures an initial slash).
 */
export function formatPathAndId(path: string, idOrPath: string | number): string {
  const left = String(path ?? '')
  const right = String(idOrPath ?? '')

  // Only remove trailing slashes from the left side
  const leftTrimmed = left.replace(/\/+$/, '')

  // Only remove leading slashes from the right side
  const rightTrimmed = right.replace(/^\/+/, '')

  if (!rightTrimmed)
    return leftTrimmed

  if (!leftTrimmed)
    return `/${rightTrimmed}`

  return `${leftTrimmed}/${rightTrimmed}`
}
